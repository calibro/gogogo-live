'use strict';

describe('Filter: pathlenght', function () {

  // load the filter's module
  beforeEach(module('gogogoApp'));

  // initialize a new instance of the filter before each test
  var pathlenght;
  beforeEach(inject(function ($filter) {
    pathlenght = $filter('pathlenght');
  }));

  it('should return the input prefixed with "pathlenght filter:"', function () {
    var text = 'angularjs';
    expect(pathlenght(text)).toBe('pathlenght filter: ' + text);
  });

});
