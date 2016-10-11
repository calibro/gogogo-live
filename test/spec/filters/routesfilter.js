'use strict';

describe('Filter: routesFilter', function () {

  // load the filter's module
  beforeEach(module('gogogoApp'));

  // initialize a new instance of the filter before each test
  var routesFilter;
  beforeEach(inject(function ($filter) {
    routesFilter = $filter('routesFilter');
  }));

  it('should return the input prefixed with "routesFilter filter:"', function () {
    var text = 'angularjs';
    expect(routesFilter(text)).toBe('routesFilter filter: ' + text);
  });

});
