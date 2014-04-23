
# tour

  Data driven feature tour.

## Installation

  Install with [component(1)](http://component.io):

    $ component install code42day/tour

  Live demo is [here](http://code42day.github.io/tour/)

## API

### `Tour.play`

Call `play to start the tour.

```javascript
    var tour = require('tour');
    tour().play();
```

Tour is driven by HTML content. Elements with `data-tour-content` attribute are considered tour
steps. Each step describes DOM element with `data-tour-id` attribute.

```html
<div class='hidden'>
  <span data-tour-content="button">This is how we start the tour.</span>
  <div data-tour-content="image">
    <p>We have nice picture here.</p>
    <p><em>Seen enough?</em></p>
  </div>
  <div data-tour-content="text">
    And that is the last element...
  </div>
</div>
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


## License

  The MIT License (MIT)

  Copyright (c) 2014 code42day

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
