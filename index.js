var q = require('query');
var ds = require('dataset');
var Popover = require('confirmation-popover');
var Emitter = require('emitter');

module.exports = Tour;

// parse HTML to create a list of steps - tour-id / tour-content need to match
function steps() {
  return Array.prototype.map.call(q.all('[data-tour-content]'), function(el) {
    var id = ds(el, 'tourContent');
    return {
      id: id,
      contentEl: el,
      refEl: q('[data-tour-id="' + id + '"]')
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
  if (!this.popover) {
    this.popover = new Popover('');
    this.popover
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
        self.emit('end');
      })
      .on('ok', function() {
        setTimeout(self.showStep.bind(self, ++self.current), 0);
      });
  }
  self.showStep(self.current);
};

Tour.prototype.showStep = function(index) {
  var step = this.steps[index];

  if (!step) {
    return;
  }
  if (index >= this.steps.length);
  this.popover
    .confirmation('')
    .confirmation(step.contentEl.cloneNode(true))
    .show(step.refEl);
};
