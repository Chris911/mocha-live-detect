import { EventEmitter } from 'events';
import http from 'http';
import { inherits } from 'util';
import { getHostname, getHref, printHostnames, printTestRequest } from './utils';
import Mocha from 'mocha';

const hostnames = {};
const testRequests = [];

/**
 * Patch mocha to display recording requests during individual tests and at
 * the end of the test suite.
 */
export function patchMocha() {
  const _testRun = Mocha.Test.prototype.run;

  Mocha.Test.prototype.run = function (fn) {
    function done(ctx) {
      fn.call(this, ctx);

      if (testRequests.length) {
        printTestRequest(testRequests);
        testRequests.length = 0;
      }
    }

    return _testRun.call(this, done);
  };

  const _run = Mocha.prototype.run;

  Mocha.prototype.run = function(fn) {
    function done(failures) {
      printHostnames(hostnames);
      fn.call(this, failures);
    }

    return _run.call(this, done);
  };
}

/**
 * Patch Node's HTTP client to record external HTTP calls.
 *   - All hostnames are stored in `hostname` with their count for the whole
 *     test suite.
 *   - Full request URLs are stores in `testRequests` and used to display
 *   	 recorded requests for individual tests.
 *   - Requests to localhost are ignored.
 */
export function patchHttpClient() {
  const _ClientRequest = http.ClientRequest;

  function patchedHttpClient(options, done) {
    if (http.OutgoingMessage) http.OutgoingMessage.call(this);

    const hostname = getHostname(options);

    // Ignore localhost requests
    if (hostname.indexOf('127.0.0.1') === -1 && hostname.indexOf('localhost') === -1) {
      if (hostnames[hostname]) {
        hostnames[hostname]++;
      } else {
        hostnames[hostname] = 1;
      }

      testRequests.push(getHref(options));
    }

    _ClientRequest.call(this, options, done);
  }

  inherits(patchedHttpClient, _ClientRequest || EventEmitter);

  http.ClientRequest = patchedHttpClient;

  http.request = function(options, done) {
    return new http.ClientRequest(options, done);
  };
}
