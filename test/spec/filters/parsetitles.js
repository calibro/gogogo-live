'use strict';

describe('Filter: parseTitles', function () {

  // load the filter's module
  beforeEach(module('gogogoApp'));

  // initialize a new instance of the filter before each test
  var parseTitles;
  beforeEach(inject(function ($filter) {
    parseTitles = $filter('parseTitles');
  }));

  it('should return the input prefixed with "parseTitles filter:"', function () {
    var text = 'angularjs';
    expect(parseTitles(text)).toBe('parseTitles filter: ' + text);
  });

});
