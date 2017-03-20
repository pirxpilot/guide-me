var q = require('query');
var ds = require('dataset');
var classes = require('classes');
var overlay = require('overlay');
var Popover = require('confirmation-popover');
var Emitter = require('emitter');

module.exports = Tour;

function id2el(id) {
  return q('[data-tour-id="' + id + '"]') || q(id);
}

// parse HTML to create a list of steps - tour-id / tour-content need to match
function steps(container) {
  return Array.prototype.map.call(q.all('[data-tour-content]', container), function(el) {
    var data = ds(el),
      id = data.get('tourContent');
    return {
      id: id,
      contentEl: el,
      position: data.get('position') || 'bottom',
      delay: data.get('delay') || 0,
      absent: data.get('contentAbsent') !== undefined,
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
  self.popover.classes.add('tour-popover');
  self.updateNext();
  self.popover
    .cancel('Close')
    .ok('Next')
    .focus('ok')
    .on('show', function() {
      self.emit('show', self.current);
    })
    .on('hide', function() {
      self.emit('hide', self.current);
    })
    .on('cancel', function() {
      self.markStep(false);
      if (self._overlay) {
        self._overlay.hide();
      }
      self.hideStep();
      ++self.current;
      self.emit('end');
    })
    .on('ok', function() {
      self.markStep(false);
      self.emit('next', ++self.current);
      setTimeout(self.showStep.bind(self), 0);
    })
    .position(step.position)
    .show(step.refEl);
}

function Tour(container) {
  if (!(this instanceof Tour)) return new Tour(container);
  this.steps = steps(container);
  this.current = 0;
}

Emitter(Tour.prototype);

Tour.prototype.overlay = function(options) {
  this._overlay = overlay(options);
  classes(this._overlay.el).add('tour-overlay');
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
  classes(q('.ok', this.popover.el)).toggle('hidden', this.current + 1 >= this.steps.length);
};

// marks element associated with active step
Tour.prototype.markStep = function(on) {
  var step = this.steps[this.current];
  if (step) {
    classes(step.refEl).toggle('tour-active-step', on);
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
  if (this.popover.classes.has('tour-reacted')) {
    return;
  }

  if (typeof delay !== 'number') {
    delay = step.delay;
  }

  var popover = this.popover.hide();
  setTimeout(function() {
    popover.show(step.refEl);
    popover.classname += ' tour-reacted';
    popover.classes.add('tour-reacted');
  }, delay);
};
