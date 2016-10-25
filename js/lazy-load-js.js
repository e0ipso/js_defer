/**
 * JS Queue
 *   Load a queue of scripts on demand.
 */
/*global LazyLoad*/
(function ($, Drupal, LazyLoad) {

  Drupal.behaviors.js_defer = {
    attach: function (context, settings) {
      for (var queueName in settings.js_defer) {
        // If the code that triggers the queue fails to trigger it, then
        // we provide a fallback timeout that will trigger it. This has the
        // drawback that the queue may be triggered by the timeout.
        if (settings.js_defer[queueName].fallback === 'timeout' &&
           !settings.js_defer[queueName].timer
        ) {
          settings.js_defer[queueName].timer = setTimeout(
            $.proxy(Drupal, 'js_defer_load', queueName),
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
    var existingBehaviors;

    // Ensure we that have scripts to load
    if (typeof Drupal.settings.js_defer[queueName] === "undefined" ||
      typeof Drupal.settings.js_defer[queueName].scripts === "undefined"
    ) {
      return;
    }
    // Ensure we that have not yet queued these scripts
    if (Drupal.settings.js_defer[queueName].once) {
      return;
    }

    // Make sure this last bit isn't run twice for the same queue
    Drupal.settings.js_defer[queueName].once = true;

    // The scripts come in as an object to ensure there are no duplicates, but
    // we need them to be an array. The keys of the object properties are
    // identical to the values, so we can just use Object.keys().
    var scripts = Object.keys(Drupal.settings.js_defer[queueName].scripts);

    // Run only new behaviors added from the queue, or load all, depending on
    // queue's reattach_all_behaviors setting.
    if (Drupal.settings.js_defer[queueName].reattach_all_behaviors === false) {
      existingBehaviors = $.extend(true, {}, Drupal.behaviors);
      LazyLoad.js(scripts, function () {
        // Execute only new behaviors since we ran the queue
        $.each(Drupal.behaviors, function (index) {
          if (typeof existingBehaviors[index] === 'undefined' && $.isFunction(this.attach)) {
            this.attach(document, Drupal.settings);
          }
        });
      });
    } else {
      LazyLoad.js(scripts, function () {
        Drupal.attachBehaviors(document, Drupal.settings);
      });
    }
  };

})(jQuery, Drupal, LazyLoad);
