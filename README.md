JS Defer
========

Drupal module to defer JS loading after a signal, it is a JavaScript Quality of
Service oriented module. This is useful to give some scripts priority in front
of others. This is not done to make the scripts load faster, but to make give
their XHRs priority against the deferred ones.

## Scenario

Imagine a drupal page where the most important thing is a video that gets auto
played. You also have several ajax carousels, ads all over the page, social
plugins and maybe also a commenting system with a big media rich comments
thread.

Note how we are not talking about the download time of the script, but the
potential XHR requests it can make.

Modern browsers are smart enough to make your page to be ready **as a whole** as
soon as possible. That may delay the video playback a lot since you don't have a
way to tell the browser: _Start making all those requests, but save most of the
bandwidth for the ones related to the video play since that is the thing I want
to be ready as soon as possible_. You don't care if the YouTube embeds in the
comments take longer to display, or if the images in the Facebook page embeds
are not optimally loaded in time. You want your flash player, the analytics
system that comes with it, the custom styles to apply to it and the first buffer
ready. And you want it **fast**.

## Dependencies

This module depends on the following javascript libraries:

  - The [LazyLoad](https://github.com/rgrove/lazyload) library to do the actual
  lazy load of the specified scripts.

## Usage

This module will not do anything on its own, it will need an implementer module.
The implementer module will be responsible for:

  - Listing the scripts to defer in PHP by implementing `hook_js_defer_info`.
  - Triggering the javascript queue that will signal the lazy load start.

```php
/**
 * Implements hook_js_defer_info().
 */
function implementer_js_defer_info() {
  if (user_visiting_video_page()) {
    // Deferred styles for video pages.
    $deferred['js-queue'] = array(
      'fallback' => 'timeout',
      'timeout' => 10,
      'scripts' => array(
        'sites/all/modules/module-name/js/javascript-file1.js',
        'sites/all/modules/module-name/js/javascript-file2.js',
      ),
    );
  }
  else {
    // Deferred styles for the rest of pages.
    $deferred['js-queue-2'] = array(
      'fallback' => FALSE,
      'scripts' => array(
        'sites/all/modules/module-name/js/javascript-file3.js',
        'sites/all/modules/module-name/js/javascript-file4.js',
      ),
    );
  }
  return $deferred;
}
```

And then trigger the queue whenever you need:

```js
// Player informs that the first buffer is ready to be played. It's time to
// allow all other scripts to load their stuff.
Drupal.js_defer_load('js-queue');
// The deferred scripts start to load now.
```
