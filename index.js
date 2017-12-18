var q = require('query');
var overlay = require('overlay');
var Popover = require('confirmation-popover');
var Emitter = require('emitter');

module.exports = Tour;

function id2el(id) {
  return q('[data-tour-id="' + id + '"]') || q(id);
}

function coerce(selectorOrNode) {
  if (typeof selectorOrNode !== 'string') {
    // node or empty
    return selectorOrNode;
  }
  var el = q(selectorOrNode);
  if (el.nodeName === 'TEMPLATE' && el.content) {
    return el.content;
  }
  return el;
}

// parse HTML to create a list of steps - tour-id / tour-content need to match
function steps(container) {
  return Array.prototype.map.call(q.all('[data-tour-content]', container), function(el) {
    var id = el.dataset.tourContent;
    return {
      id: id,
      contentEl: el,
      position: el.dataset.position || 'bottom',
      delay: el.dataset.delay || 0,
      absent: el.dataset.contentAbsent !== undefined,
      refEl: id2el(id)
    };
  })
  .filter(function(step) {
    // only consider steps for which referenceEl is found
    return step.refEl || step.absent;
  });
}

function createPopover(step) {
  var self = this;
  if (step.absent) {
    step.refEl = id2el(step.id);
    self.markStep(true);
  }
  self.popover = new Popover(step.contentEl.cloneNode(true));
  self.popover.classname += ' tour-popover';
  self.popover.el.classList.add('tour-popover');
  self.updateNext();
  self.popover
    .cancel(self.labels.cancel)
    .ok(self.labels.ok)
    .focus('ok')
    .on('show', function() {
      self.emit('show', self.current);
    })
    .on('hide', function() {
      self.emit('hide', self.current);
    })
    .on('cancel', self.end.bind(self))
    .on('ok', self.next.bind(self))
    .position(step.position)
    .show(step.refEl);
}

function Tour(container, options) {
  if (!(this instanceof Tour)) return new Tour(container, options);
  this.steps = steps(coerce(container));
  this.current = 0;
  this.labels = Object.assign({
    ok: 'Next',
    cancel: 'Close'
  }, options && options.labels);
}

Emitter(Tour.prototype);

Tour.prototype.overlay = function(options) {
  this._overlay = overlay(options);
  this._overlay.el.classList.add('tour-overlay');
  return this;
};

Tour.prototype.play = function(index) {
  var self = this;

  self.emit('begin');
  if (self._overlay) {
    self._overlay.show();
  }
  if (typeof index === 'number') {
    self.current = index;
  }
  self.showStep();
};

// hides next button for last step
Tour.prototype.updateNext = function() {
  q('.ok', this.popover.el).classList.toggle('hidden', this.current + 1 >= this.steps.length);
};

// marks element associated with active step
Tour.prototype.markStep = function(on) {
  var step = this.steps[this.current];
  if (step) {
    step.refEl.classList.toggle('tour-active-step', on);
  }
};

Tour.prototype.hideStep = function() {
  if (this.popover) {
    this.popover.hide();
    this.popover = undefined;
  }
};

Tour.prototype.showStep = function() {
  var step;

  this.current %= this.steps.length;
  step = this.steps[this.current];

  if (!step) {
    return;
  }
  if (!step.absent) {
      this.markStep(true);
  }

  this.hideStep();

  setTimeout(createPopover.bind(this, step), step.delay);
};

// called when user acted upon a suggestion in a Tour step
Tour.prototype.react = function(delay) {
  var step = this.steps[this.current];

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

  var popover = this.popover.hide();
  setTimeout(function() {
    popover.show(step.refEl);
    popover.classname += ' tour-reacted';
    popover.el.classList.add('tour-reacted');
  }, delay);
};

Tour.prototype.next = function() {
  var self = this;

  self.markStep(false);
  self.emit('next', ++self.current);
  setTimeout(self.showStep.bind(self), 0);
};

Tour.prototype.end = function() {
  var self = this;

  self.markStep(false);
  if (self._overlay) {
    self._overlay.hide();
  }
  self.hideStep();
  ++self.current;
  self.emit('end');
};
