<?php

/**
 * @file
 * API documentation file.
 */

/**
 * Gets a list of all the files to be deferred.
 *
 * @return array
 *   Keyed by the context name. The context name is the name of the queue that
 *   when triggered will cause the deferred scripts to load.
 *   - fallback: The fallback strategy. How to deal with the situation where
 *     the queue is never started. Currently supported:
 *     * 'timeout': Trigger the queue to load after a timeout.
 *     * FALSE: No fallback.
 *   - timeout: The amount of seconds before the queue is manually started.
 *   - scripts: An array of file names as the keys for the argument in
 *     hook_js_alter
 */
function hook_js_defer_info() {
  $deferred['js-queue'] = array(
    'fallback' => 'timeout',
    'timeout' => 10,
    'scripts' => array(
      'sites/all/modules/module-name/js/javascript-file1.js',
      'sites/all/modules/module-name/js/javascript-file2.js',
    ),
  );
  $deferred['js-queue-2'] = array(
    'fallback' => FALSE,
    'scripts' => array(
      'sites/all/modules/module-name/js/javascript-file3.js',
      'sites/all/modules/module-name/js/javascript-file4.js',
    ),
  );
  return $deferred;
}
