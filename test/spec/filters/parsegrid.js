'use strict';

describe('Filter: parseGrid', function () {

  // load the filter's module
  beforeEach(module('gogogoApp'));

  // initialize a new instance of the filter before each test
  var parseGrid;
  beforeEach(inject(function ($filter) {
    parseGrid = $filter('parseGrid');
  }));

  it('should return the input prefixed with "parseGrid filter:"', function () {
    var text = 'angularjs';
    expect(parseGrid(text)).toBe('parseGrid filter: ' + text);
  });

});
