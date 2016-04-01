import chalk from 'chalk';

/**
 * Returns indent for pretty printing.
 * @param  {integer} size - indent size in spaces
 * @return {string} the indent string
 */
export function indent(size) {
  let indentStr = '';
  let _size = size;
  while (_size > 0) {
    indentStr += ' ';
    _size--;
  }
  return indentStr;
}

/**
 * Prints full requests URL seen in test.
 */
export function printTestRequest(testRequests) {
  console.log(chalk.yellow(`${indent(6)} Live requests: `));

  testRequests.forEach(request => {
    console.log(chalk.yellow(`${indent(8)} * ${request}`));
  });
}

/**
 * Print requested hostnames summary.
 */
export function printHostnames(hostnames) {
  console.log(chalk.yellow.bold(`${indent(2)} Hostnames requested: `));

  if (Object.keys(hostnames).length === 0) {
    console.log(chalk.yellow(`${indent(4)}none`));
    return;
  }

  for (const key in hostnames) {
    if (!hostnames[key]) return;
    console.log(chalk.yellow(`${indent(4)}${key}: ${hostnames[key]}`));
  }
}

/**
 * Get the hostname from an HTTP options object.
 * Supports multiple types of options.
 * @param  {object} httpOptions
 * @return {string} the hostname or "Unknown" if not found.
 */
export function getHostname(httpOptions) {
  if (httpOptions.uri && httpOptions.uri.hostname) {
    return httpOptions.uri.hostname;
  } else if (httpOptions.hostname) {
    return httpOptions.hostname;
  } else if (httpOptions.host) {
    return httpOptions.host;
  }
  return 'Unknown';
}

/**
 * Get the href from an HTTP options objet.
 * Supports multiple types of options.
 * @param  {object} httpOptions
 * @return {string} the hostname or "Unknown" if not found.
 */
export function getHref(httpOptions) {
  if (httpOptions.uri && httpOptions.uri.href) {
    return httpOptions.uri.href;
  } else if (httpOptions.hostname && httpOptions.path) {
    return httpOptions.hostname + httpOptions.path;
  } else if (httpOptions.host && httpOptions.path) {
    return httpOptions.host + httpOptions.path;
  }
  return 'Unknown';
}
