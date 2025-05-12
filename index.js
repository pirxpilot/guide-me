import Popover from '@pirxpilot/confirmation-popover';
import overlay from '@pirxpilot/overlay';
import Emitter from 'component-emitter';

function id2el(id) {
  return document.querySelector(`[data-tour-id="${id}"]`) || document.querySelector(id);
}

function coerce(selectorOrNode) {
  if (typeof selectorOrNode !== 'string') {
    // node or empty
    return selectorOrNode;
  }
  const el = document.querySelector(selectorOrNode);
  if (el.nodeName === 'TEMPLATE' && el.content) {
    return el.content;
  }
  return el;
}

// parse HTML to create a list of steps - tour-id / tour-content need to match
function steps(container) {
  const result = [];
  container.querySelectorAll('[data-tour-content]').forEach(el => {
    const id = el.dataset.tourContent;
    const refEl = id2el(id);
    const absent = el.dataset.contentAbsent !== undefined;

    // only consider steps for which referenceEl is found
    if (!refEl && !absent) {
      return;
    }

    result.push({
      id,
      contentEl: el,
      position: el.dataset.position || 'bottom',
      delay: el.dataset.delay || 0,
      absent,
      refEl
    });
  });
  return result;
}

function createPopover(step) {
  if (step.absent) {
    step.refEl = id2el(step.id);
    this.markStep(true);
  }
  this.popover = new Popover(step.contentEl.cloneNode(true));
  this.popover.classname += ' tour-popover';
  this.popover.el.classList.add('tour-popover');
  this.updateNext();
  this.popover
    .cancel(this.labels.cancel)
    .ok(this.labels.ok)
    .focus('ok')
    .on('show', () => this.emit('show', this.current))
    .on('hide', () => this.emit('hide', this.current))
    .on('cancel', () => this.end())
    .on('ok', () => this.next())
    .position(step.position)
    .show(step.refEl);
}

export default class Tour extends Emitter {
  static of(...args) {
    return new Tour(...args);
  }

  constructor(container, { labels } = {}) {
    super();
    this.steps = steps(coerce(container));
    this.current = 0;
    this.labels = Object.assign(
      {
        ok: 'Next',
        cancel: 'Close'
      },
      labels
    );
  }

  overlay(options) {
    this._overlay = overlay(options);
    this._overlay.el.classList.add('tour-overlay');
    return this;
  }

  play(index) {
    this.emit('begin');
    if (this._overlay) {
      this._overlay.show();
    }
    if (typeof index === 'number') {
      this.current = index;
    }
    this.showStep();
  }

  // hides next button for last step
  updateNext() {
    this.popover.el.querySelector('.ok').classList.toggle('hidden', this.current + 1 >= this.steps.length);
  }

  // marks element associated with active step
  markStep(on) {
    const step = this.steps[this.current];
    if (step) {
      step.refEl.classList.toggle('tour-active-step', on);
    }
  }

  hideStep() {
    if (this.popover) {
      this.popover.hide();
      this.popover = undefined;
    }
  }

  showStep() {
    this.current %= this.steps.length;
    const step = this.steps[this.current];

    if (!step) {
      return;
    }
    if (!step.absent) {
      this.markStep(true);
    }

    this.hideStep();

    setTimeout(createPopover.bind(this, step), step.delay);
  }

  // called when user acted upon a suggestion in a Tour step
  react(delay) {
    const step = this.steps[this.current];

    if (!step) {
      return;
    }
    if (!this.popover) {
      return;
    }
    if (this.popover.el.classList.contains('tour-reacted')) {
      return;
    }

    if (typeof delay !== 'number') {
      delay = step.delay;
    }

    const popover = this.popover.hide();
    setTimeout(() => {
      popover.show(step.refEl);
      popover.classname += ' tour-reacted';
      popover.el.classList.add('tour-reacted');
    }, delay);
  }

  next() {
    this.markStep(false);
    this.emit('next', ++this.current);
    setTimeout(() => this.showStep(), 0);
  }

  end() {
    this.markStep(false);
    if (this._overlay) {
      this._overlay.hide();
    }
    this.hideStep();
    ++this.current;
    this.emit('end');
  }
}
