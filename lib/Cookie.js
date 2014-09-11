var _ = require('underscore');

var Cookie = (function () {
    'use strict';
    var cookies = {},
        findAll = function() {
	    if (!_.isUndefined(document) && !_.isUndefined(document.cookie)) {
                _(document.cookie.split(';'))
                    .chain()
                    .map(function(m) {
                        return m.replace(/^\s+/, '').replace(/\s+$/, '');
                    })
                    .each(function(c) {
                        var arr = c.split('='),
                            key = arr[0],
                            value = null;
                        var size = _.size(arr);
                        if (size > 1) {
                            value = arr.slice(1).join('');
                        }
                        cookies[key] = value;
                    });
	    }
            return cookies;
        },
        defaultLifetime = (1000 * 60 * 60 * 24 * 365 * 10), // 10 years
        today = new Date();

    // retrieving all existing cookies
    findAll();

    return {
        all: function() {
            return cookies;
        },
        find: function(name) {
            return _.isUndefined(cookies[name]) ? null : cookies[name];
        },
        has: function(name) {
            return _.isUndefined(cookies[name]) ? false : true;
        },
        create: function(name, value, time) {
            var offset = (_.isUndefined(time)) ? defaultLifetime : (time * 1000),
                expiresAt = new Date(today.getTime() + offset);

            var cookie = _.map({
                name: escape(value),
                expires: expiresAt.toGMTString(),
                path: '/'
            }, function(value, key) {
                return [(key === 'name') ? name : key, value].join('=');
            }).join(';');

            document.cookie = cookie;
            findAll();
            return cookies[name];
        },
        remove: function(name) {
            var self = this;
            self.create(name, null, -1000000);
            delete cookies[name];
        },
        // for tests only
        init: function() {
            findAll();
        },
        clear: function() {
            var self = this;
            _(cookies).each(function(value, name){
                self.remove(name);
            });
            cookies = {};
        }
    };
}());

// exporting the plugin main function
module.exports = Cookie;
