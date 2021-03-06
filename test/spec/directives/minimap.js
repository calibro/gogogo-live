'use strict';

describe('Directive: minimap', function () {

  // load the directive's module
  beforeEach(module('gogogoApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<minimap></minimap>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the minimap directive');
  }));
});
