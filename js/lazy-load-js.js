/**
 * JS Queue
 *   Load in a set of scripts when certain event has fired.
 */
/*global EventEmitter,LazyLoad*/
(function ($, Drupal, EventEmitter, LazyLoad, window) {
  var Events = Drupal.Events || (Drupal.Events = new EventEmitter());

  Drupal.behaviors.lazyLoadScripts = {
    attach: function (context, settings) {
      var fireBehaviors = function () {
        // Make sure we don't get into infinite recursion.
        if (typeof settings.lazyLoadJS[eventName].fired === 'undefined') {
          Drupal.attachBehaviors(document, Drupal.settings);
        }
        settings.lazyLoadJS[eventName].fired = true;
      };
      for (var eventName in settings.lazyLoadJS) {
        Events.addOnceListener(eventName, function () {
          LazyLoad.js(settings.lazyLoadJS[eventName].scripts, fireBehaviors)
        });

        if (settings.lazyLoadJS[eventName].fallback === 'timeout') {
          // If the code that triggers the event fails to trigger it, we need to
          // provide a fallback timeout that will trigger it. This has the
          // drawback that the event will may be triggered first by the timeout.
          window.setTimeout(function () {
            Events.emit(eventName);
          }, settings.lazyLoadJS[eventName].timeout * 1000);
        }
      }
    }
  };
})(jQuery, Drupal, EventEmitter, LazyLoad, window);
