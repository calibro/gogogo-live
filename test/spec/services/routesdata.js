'use strict';

describe('Service: routesData', function () {

  // load the service's module
  beforeEach(module('gogogoApp'));

  // instantiate service
  var routesData;
  beforeEach(inject(function (_routesData_) {
    routesData = _routesData_;
  }));

  it('should do something', function () {
    expect(!!routesData).toBe(true);
  });

});
