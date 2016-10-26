'use strict';

describe('Directive: mapall', function () {

  // load the directive's module
  beforeEach(module('gogogoApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<mapall></mapall>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the mapall directive');
  }));
});
