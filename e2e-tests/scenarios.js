'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('my app', function() {


  it('should automatically redirect to /view1 when location hash/fragment is empty', function() {
    browser.get('index.html');
    expect(browser.getLocationAbsUrl()).toMatch("/");
  });


  describe('home', function() {

    beforeEach(function() {
      browser.get('index.html/#/');
    });


    it('should render home when user navigates to /', function() {
      expect(element.all(by.css('[ng-view] p')).first().getText()).
        toMatch(/partial for view 1/);
    });

  });


  describe('order', function() {

    beforeEach(function() {
      browser.get('index.html/#/order');
    });


    it('should render order when user navigates to /order', function() {
      expect(element.all(by.css('[ng-view] p')).first().getText()).
        toMatch(/partial for view 2/);
    });

  });
});
