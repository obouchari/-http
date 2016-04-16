(() => {

    'use strict';

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

    createShortMethods('get', 'delete', 'head', 'jsonp'); // 'get', 'delete', 'head', 'jsonp'
    createShortMethodsWithData('post', 'put', 'patch'); // 'post', 'put', 'patch'

    function createShortMethods(...names) {
        names.forEach((name) => {
            http[name] = (url, config) => {
                return http(extend({}, config || {}, {
                    method: name,
                    url: url
                }));
            };
        });
    }

    function createShortMethodsWithData(...names) {
        names.forEach((name) => {
            http[name] = (url, data, config) => {
                return http(extend({}, config || {}, {
                    method: name,
                    url: url,
                    data: data
                }));
            };
        });
    }

    function extend(target, ...sources) {
        sources.forEach((src) => {
            if (Object.keys(src).length) {
                for (var prop in src) {
                    if (src.hasOwnProperty(prop)) {
                        target[prop] = src[prop];
                    }
                }
            }
        });
        // Return the modified object
        return target;
    };

    window.$http = http;

})();
