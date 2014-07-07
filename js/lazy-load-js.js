/**
 * JS Queue
 *   Load a queue of scripts on demand.
 */
/*global LazyLoad*/
(function ($, Drupal, LazyLoad, window) {

  Drupal.behaviors.js_defer = {
    attach: function (context, settings) {
      for (var queueName in settings.js_defer) {
        // If the code that triggers the queue fails to trigger it, then
        // we provide a fallback timeout that will trigger it. This has the
        // drawback that the queue may be triggered by the timeout.
        if (settings.js_defer[queueName].fallback === 'timeout') {
          setTimeout($.proxy(Drupal, 'js_defer_load', queueName),
            settings.js_defer[queueName].timeout * 1000);
        }
      }
    }
  };

  /**
   * Load a named set of scripts
   *
   * @param {string} queueName
   *   Name of the queue to claim is ready.
   */
  Drupal.js_defer_load = function (queueName) {
    // Ensure we that have scripts to load
    if (!Drupal.settings.js_defer[queueName] || !Drupal.settings.js_defer[queueName].scripts.length) {
      return;
    }
    // Ensure we that have not yet queued these scripts
    if (Drupal.settings.js_defer[queueName].once) {
      return;
    }
    Drupal.settings.js_defer[queueName].once = true;
    LazyLoad.js(Drupal.settings.js_defer[queueName].scripts, function () {
      Drupal.attachBehaviors(document, Drupal.settings);
    });
  };

})(jQuery, Drupal, LazyLoad, this);
