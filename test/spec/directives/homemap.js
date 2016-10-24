'use strict';

describe('Directive: homemap', function () {

  // load the directive's module
  beforeEach(module('gogogoApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<homemap></homemap>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the homemap directive');
  }));
});
