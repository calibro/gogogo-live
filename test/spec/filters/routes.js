'use strict';

describe('Filter: routes', function () {

  // load the filter's module
  beforeEach(module('gogogoApp'));

  // initialize a new instance of the filter before each test
  var routes;
  beforeEach(inject(function ($filter) {
    routes = $filter('routes');
  }));

  it('should return the input prefixed with "routes filter:"', function () {
    var text = 'angularjs';
    expect(routes(text)).toBe('routes filter: ' + text);
  });

});
