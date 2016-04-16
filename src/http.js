(() => {

    'use strict';

    let Promise = require('es6-promise').Promise;

    /**
     * Generate an HTTP request.
     * @param  {Object} request   Configuration object
     * @return {HttpPromise}      Future object
     */
    let http = (request) => {
        return {
            then: function() {
                return request;
            }
        };
    };

    _createShortMethods('get', 'delete', 'head', 'jsonp'); // 'get', 'delete', 'head', 'jsonp'
    _createShortMethodsWithData('post', 'put', 'patch'); // 'post', 'put', 'patch'

    /**
     * Shortcut methods to perform 'GET', 'DELETE', 'HEAD', 'JSONP'
     * @param  {Array} names    List of methods to create
     * @return {HttpPromise}    Future object
     */
    function _createShortMethods(...names) {
        names.forEach((name) => {
            http[name] = (url, config) => {
                return http(_extend({}, config || {}, {
                    method: name,
                    url: url
                }));
            };
        });
    }

    /**
     * Shortcut methods to perform 'POST', 'PUT', 'PATCH'
     * @param  {Array} names    List of methods to create
     * @return {HttpPromise}    Future object
     */
    function _createShortMethodsWithData(...names) {
        names.forEach((name) => {
            http[name] = (url, data, config) => {
                return http(_extend({}, config || {}, {
                    method: name,
                    url: url,
                    data: data
                }));
            };
        });
    }

    /**
     * Extend an object with properties from passed in objects
     * @param  {Object} target     Target Object
     * @param  {Array}  sources    Source Objects
     * @return {Object}            Modified object
     */
    function _extend(target, ...sources) {
        sources.forEach((src) => {
            if (Object.keys(src).length) {
                for (var prop in src) {
                    if (src.hasOwnProperty(prop)) {
                        target[prop] = src[prop];
                    }
                }
            }
        });
        return target;
    }

    window.$http = http;

})();
