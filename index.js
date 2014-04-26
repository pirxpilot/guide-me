var q = require('query');
var ds = require('dataset');
var classes = require('classes');
var overlay = require('overlay');
var Popover = require('confirmation-popover');
var Emitter = require('emitter');

module.exports = Tour;

// parse HTML to create a list of steps - tour-id / tour-content need to match
function steps() {
  return Array.prototype.map.call(q.all('[data-tour-content]'), function(el) {
    var data = ds(el),
      id = data.get('tourContent');
    return {
      id: id,
      contentEl: el,
      position: data.get('position') || 'bottom',
      refEl: q('[data-tour-id="' + id + '"]') || q(id)
    };
  })
  .filter(function(step) {
    // only consider steps for which referenceEl is found
    return step.refEl;
  });
}

function Tour() {
  if (!(this instanceof Tour)) return new Tour();
  this.steps = steps();
  this.current = 0;
}

Emitter(Tour.prototype);

Tour.prototype.play = function() {
  var self = this;

  self.emit('begin');
  if (!self.popover) {
    self.popover = new Popover('');
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
        self.overlay.remove();
        self.overlay = null;
        self.emit('end');
      })
      .on('ok', function() {
        setTimeout(self.showStep.bind(self, ++self.current), 0);
      });
  }
  self.overlay = overlay();
  classes(self.overlay.el).add('tour-overlay');
  self.overlay.show();
  self.showStep(self.current);
};

Tour.prototype.updateNext = function(index) {
  classes(q('.ok', this.popover.el)).toggle('hidden', index + 1 >= this.steps.length);
};

Tour.prototype.showStep = function(index) {
  var step = this.steps[index];

  if (!step) {
    return;
  }
  this.updateNext(index);
  this.popover
    .confirmation('')
    .confirmation(step.contentEl.cloneNode(true))
    .position(step.position)
    .show(step.refEl);
};
