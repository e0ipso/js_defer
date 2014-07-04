<?php

/**
 * @file
 * API documentation file.
 */

/**
 * Gets a list of all the files to be deferred.
 *
 * @return array
 *   - fallback: The fallback strategy. How to deal with the situation where the
 *     triggering event never fires. Currently supported:
 *     * 'timeout': Triggers the event after a timeout.
 *     * FALSE: no fallback.
 *   - timeout: The amount of seconds before the event is manually triggered.
 *   - scripts: An array of file names as the keys for the argument in hook_js_alter keyed
 *     by the context name. The context name is the name of the JS event that when
 *     triggered will cause the deferred scripts to load.
 */
function hook_js_defer_info() {
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
