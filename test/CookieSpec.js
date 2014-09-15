//var jsutils = require('../');

describe('Cookie Spec', function () {
    beforeEach(function() {
        document.cookie = 'cookie=test';
        document.cookie = 'jsutils=awesomeness';
        jsutils.Cookie.init();
    });
    afterEach(function() {
        jsutils.Cookie.clear();
    });

    it('Can read in all of the currently created cookies', function () {
        var mockCookies = {
            cookie: 'test',
            jsutils: 'awesomeness'
        };

        expect(_.isEqual(jsutils.Cookie.all(), mockCookies));
    });

    it('Can clear all of the cookies', function () {
        var mockCookies = {
            cookie: 'test',
            jsutils: 'awesomeness'
        };

        expect(_.isEqual(jsutils.Cookie.all(), mockCookies)).to.equal(true);

        jsutils.Cookie.clear();

        expect(_.isEqual(jsutils.Cookie.all(), {})).to.equal(true);
    });

    it('Can find a cookie by its name', function() {
        expect(jsutils.Cookie.find('cookie')).to.equal('test');
        expect(jsutils.Cookie.find('jsutils')).to.equal('awesomeness');
        expect(jsutils.Cookie.find('undefined')).to.equal(null);
    });

    it('Can test if a cookie exists', function() {
        expect(jsutils.Cookie.has('cookie')).to.equal(true);
        expect(jsutils.Cookie.has('jsutils')).to.equal(true);
        expect(jsutils.Cookie.has('undefined')).to.equal(false);
    });

    it('Can create a new cookie', function() {
        expect(jsutils.Cookie.find('newCookie')).to.equal(null);
        expect(jsutils.Cookie.has('newCookie')).to.equal(false);

        jsutils.Cookie.create('newCookie', 'huzzah');

        expect(jsutils.Cookie.find('newCookie')).to.equal('huzzah');
        expect(jsutils.Cookie.has('newCookie')).to.equal(true);
    });

    it('Can remove a cookie', function() {
        expect(jsutils.Cookie.find('cookie')).to.equal('test');
        expect(jsutils.Cookie.has('cookie')).to.equal(true);

        jsutils.Cookie.remove('cookie');

        expect(jsutils.Cookie.find('cookie')).to.equal(null);
        expect(jsutils.Cookie.has('cookie')).to.equal(false);
    });
});
