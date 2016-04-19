((global) => {

    let Promise = require('es6-promise').Promise;
    let _ = {
        isObject: require('lodash.isobject'),
        isString: require('lodash.isstring'),
        extend: require('lodash.assign')
    };

    let defaults = {
        headers: {
            common: {
                'Accept': 'application/json, text/plain, */*'
            },
            post: {
                'Content-Type': 'application/json'
            },
            put: {
                'Content-Type': 'application/json'
            }
        }
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

        if (!_.isString(requestConfig.url) || requestConfig.url === "") {
            throw 'Http request configuration url must be a string.  Received: ' + requestConfig.url;
        }

        let config = _.extend({
            method: 'get',
        }, requestConfig);

        config.headers = _.extend({}, defaults.headers.common, requestConfig.headers);
        config.method = config.method.toUpperCase();

        return sendRequest(config);

        // console.log(config);

        // let serverRequest = function(config) {
        //     let headers = config.headers;
        //     let reqData = transformData(config.data, headersGetter(headers), undefined, config.transformRequest);

        //     // strip content-type if data is undefined
        //     if (isUndefined(reqData)) {
        //         forEach(headers, (value, header) => {
        //             if (lowercase(header) === 'content-type') {
        //                 delete headers[header];
        //             }
        //         });
        //     }

        //     // send request
        //     return sendReq(config, reqData).then(transformResponse, transformResponse);
        // };

        // let chain = [serverRequest, undefined];
        // let promise = $q.when(config);

        // while (chain.length) {
        //     let thenFn = chain.shift();
        //     let rejectFn = chain.shift();

        //     promise = promise.then(thenFn, rejectFn);
        // }

        // return promise;


        // function mergeHeaders(config) {
        //     let defHeaders = defaults.headers,
        //         reqHeaders = _.extend({}, config.headers),
        //         defHeaderName, lowercaseDefHeaderName, reqHeaderName;

        //     defHeaders = _.extend({}, defHeaders.common, defHeaders[config.method.toLowerCase()]);

        //     // using for-in instead of forEach to avoid unnecessary iteration after header has been found
        //     defaultHeadersIteration:
        //         for (defHeaderName in defHeaders) {
        //             lowercaseDefHeaderName = defHeaderName.toLowerCase();

        //             for (reqHeaderName in reqHeaders) {
        //                 if (lowercase(reqHeaderName) === lowercaseDefHeaderName) {
        //                     continue defaultHeadersIteration;
        //                 }
        //             }

        //             reqHeaders[defHeaderName] = defHeaders[defHeaderName];
        //         }

        //     // execute if header value is a function for merged headers
        //     return executeHeaderFns(reqHeaders, shallowCopy(config));
        // }
    };

    function sendRequest(config) {
        let request = new XMLHttpRequest();
        let headers = config.headers;
        let response = {};

        request.open(
            config.method,
            config.url,
            true
        );

        for (let header in headers) {
            if (headers.hasOwnProperty(header)) {
                request.setRequestHeader(header, headers[header]);
            }
        }

        let promise = new Promise(function(resolve, reject) {
            request.onreadystatechange = function() {
                if (this.readyState === 4) {
                    if (this.status >= 200 && this.status < 400) {
                        response['data'] = this.responseText;
                        response['status'] = this.status;
                        resolve(this);
                    } else {
                        reject(Error(this));
                    }
                }
            };
        });

        request.send();
        request = null;

        return promise;
    }

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

    global.$http = http;

})(window);
