module.exports = {
  /*
   * ENVIRONMENTS
   * =================
   */

  // Define globals exposed by modern browsers.
  "browser": true,

  // Define globals exposed by jQuery.
  // "jquery": true,

  // Define globals exposed by Node.js.
  "node": true,

  // Allow ES6.
  "esnext": true,

  /*
   * ENFORCING OPTIONS
   * =================
   */

  // Force all variable names to use either camelCase style or UPPER_CASE
  // with underscores.
  // "camelcase": true,

  // Prohibit use of == and != in favor of === and !==.
  "eqeqeq": true,

  // Enforce tab width of 2 spaces.
  "indent": 4,

  // Prohibit use of a variable before it is defined.
  "latedef": true,

  // Enforce line length to 80 characters
  // "maxlen": 80,

  // Require capitalized names for constructor functions.
  "newcap": false,

  // Enforce use of single quotation marks for strings.
  "quotmark": "single",

  // Enforce placing 'use strict' at the top function scope
  "strict": true,

  // Prohibit use of explicitly undeclared variables.
  "undef": true,

  // Warn when variables are defined but never used.
  // "unused": true,

  /*
   * RELAXING OPTIONS
   * =================
   */

  // Suppress warnings about == null comparisons.
  "eqnull": true
}
