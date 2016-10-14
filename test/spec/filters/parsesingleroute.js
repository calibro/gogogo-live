'use strict';

describe('Filter: parseSingleRoute', function () {

  // load the filter's module
  beforeEach(module('gogogoApp'));

  // initialize a new instance of the filter before each test
  var parseSingleRoute;
  beforeEach(inject(function ($filter) {
    parseSingleRoute = $filter('parseSingleRoute');
  }));

  it('should return the input prefixed with "parseSingleRoute filter:"', function () {
    var text = 'angularjs';
    expect(parseSingleRoute(text)).toBe('parseSingleRoute filter: ' + text);
  });

});
