[![NPM version][npm-image]][npm-url]

# tour

  Data driven feature tour.

## Installation

  Install with [npm]:

    $ npm install guide-me

  Live demo is [here](http://pirxpilot.github.io/guide-me/)

## API

### `Tour.play(index)`

Call `play to start the tour.

```javascript
    var tour = require('guide-me');
    tour('#tour-id').play();
```

The optional `index` parameter allows to specify the step from which tour should be started. If
`play` is called multiple times without `index` parameter, it restarts itself from
the step following the one that has been closed.

Tour is driven by HTML content. Elements with `data-tour-content` attribute are considered tour
steps. Each step describes DOM element with `data-tour-id` attribute.

```html
<template id='tour-id'>
  <span data-tour-content="button">This is how we start the tour.</span>
  <div data-tour-content="image">
    <p>We have nice picture here.</p>
    <p><em>Seen enough?</em></p>
  </div>
  <div data-tour-content="text">
    And that is the last element...
  </div>
</template>
```

The above example assumes that somewhere else on the page we have the corresponsing elements. The
order of those does not matter, and they can be in any part of DOM tree.

```html
<img data-tour-id="image" src='cute-cats.png'>
<p data-tour-id="text">
  Id eros vidit pri...
</p>
<input data-tour-id="button" type="submit" value="Important button"></input>
```

Please note that `data-tour-content` can also contain CSS query expression to locate the element
associated with the step.

```html
<div id='first'>
  <img class="image" src='cute-cats.png'>
</div>

<!-- This step refers to its element by CSS query -->
<span data-tour-content="#first .image">This is how we start the tour.</span>
```

Default position of step popover is `bottom`. It can be changed by specifying `data-position` attribute.

```html
<span data-tour-content="#abc" data-position='left'>
  This step is displayed to the left of item with abc id.
</span>
```

Steps can optionally specify 'data-delay' (in millis). The sequence of events is as follows:

- previous step is hidden - `hide` event is dispatched
- `next` event is dispatched
- tour waits for `delay` milliseconds - by `default` delay is 0
- next step is displayed
- `show` event is dispatched

```html
<span data-tour-content="#abc" data-delay="250">
  Tour will wait 250ms before displaying this step.
</span>
```

### Tour.react(delay)

Temporarily hides and redisplays the active step after a delay. Can be used to adjust the tour
popover whenever user action changes the screen layout. If `delay` parameter is not specified, the
value of `data- delay` for the active step is used.

### Tour.hideStep()

Hidess active tour step.


### Tour.showStep()

Shows active tour step.

## Events

- `begin` - before the tour start
- `end` - after the tour ends
- `next(index)` - when next step is about to be displayed
- `show(index)` - when step popup is displayed
- `hide(index)` - when step popup is hidden

## Styling

Tour specific CSS can be used to style tours popovers and to mark the active steps.

- `tour-popover` is used for tour popovers
- `tour-active-step` marks the element associated with current active step
- `tour-overlay` allows changing the overlay defaults

## Custom labels

To change 'Next' and 'Close' labels in the Tour windows pass `options.labels` parameter to `Tour` constructor

```javascript
var customLabels = {
  cancel: 'Got it!',
  ok: 'Go on...'
};
var tour = require('tour')(null, { labels: customLabels });

```

## License

  The MIT License (MIT)

  Copyright (c) 2014 [Damian Krzeminski](https://pirxpilot.me)

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.

[npm]: https://www.npmjs.org/

[npm-image]: https://img.shields.io/npm/v/guide-me
[npm-url]: https://npmjs.org/package/guide-me

