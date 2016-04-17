(() => {

    let Promise = require('es6-promise').Promise;
    let _ = {
        isObject: require('lodash.isobject'),
        extend: require('lodash.assign')
    };

    /**
     * Generate an HTTP request.
     * @param  {Object} request   Configuration object
     * @return {HttpPromise}      Future object
     */
    let http = (requestConfig) => {
        if (!_.isObject(requestConfig)) {
            throw 'Http request configuration must be an object.  Received: ' + requestConfig;
        }
        return {
            then: function() {
                return requestConfig;
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
                return http(_.extend({}, config || {}, {
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
                return http(_.extend({}, config || {}, {
                    method: name,
                    url: url,
                    data: data
                }));
            };
        });
    }

    window.$http = http;

})();
