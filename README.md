JS DEFER
========

Drupal module to defer JS loading after a signal. This is useful to give some
scripts priority in front of others. This is not done to make the scripts load
faster, but to make give their XHRs priority against the deferred ones.

## Dependencies

This module depends on two javascript libraries:

  - The [EventEmitter](https://github.com/Wolfy87/EventEmitter) library to
  signal when the scripts can start loading.
  - The [LazyLoad](https://github.com/rgrove/lazyload) library to do the actual
  lazy load of the specified scripts.

## Usage

This module will not do anything on its own, it will need an implementer module.
The implementer module will be responsible of:

  - Listing the scripts to defer in PHP by implementing `hook_js_defer_info`.
  - Triggering the javascript event that will signal the lazy load start.

```php
/**
 * Implements hook_js_defer_info().
 */
function implementer_js_defer_info() {
  $deferred['js-event'] = array(
    'fallback' => 'timeout',
    'timeout' => 10,
    'scripts' => array(
      'sites/all/modules/module-name/js/javascript-file1.js',
      'sites/all/modules/module-name/js/javascript-file2.js',
    ),
  );
  $deferred['js-event-2'] = array(
    'fallback' => FALSE,
    'scripts' => array(
      'sites/all/modules/module-name/js/javascript-file3.js',
      'sites/all/modules/module-name/js/javascript-file4.js',
    ),
  );
  return $deferred;
}
```

And then trigger the event whenever you need:

```js
// Our tasks are all done.
var event = new EventEmitter();
event.emit('js-event');
// The deferred scripts start to load now.
```