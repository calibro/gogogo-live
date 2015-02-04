'use strict';

describe('Directive: resolveLoader', function () {

  // load the directive's module
  beforeEach(module('gogogoApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<resolve-loader></resolve-loader>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the resolveLoader directive');
  }));
});
