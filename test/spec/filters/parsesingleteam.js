'use strict';

describe('Filter: parseSingleTeam', function () {

  // load the filter's module
  beforeEach(module('gogogoApp'));

  // initialize a new instance of the filter before each test
  var parseSingleTeam;
  beforeEach(inject(function ($filter) {
    parseSingleTeam = $filter('parseSingleTeam');
  }));

  it('should return the input prefixed with "parseSingleTeam filter:"', function () {
    var text = 'angularjs';
    expect(parseSingleTeam(text)).toBe('parseSingleTeam filter: ' + text);
  });

});
