System.register(["lodash"], function(exports_1) {
    var lodash_1;
    var SentryDatasource;
    return {
        setters:[
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            }],
        execute: function() {
            SentryDatasource = (function () {
                /** @ngInject */
                function SentryDatasource(instanceSettings, $q, backendSrv, templateSrv) {
                    this.$q = $q;
                    this.backendSrv = backendSrv;
                    this.templateSrv = templateSrv;
                    this.type = instanceSettings.type;
                    this.url = instanceSettings.url;
                    this.name = instanceSettings.name;
                    this.authToken = instanceSettings.jsonData.AuthToken;
                    this.organization = instanceSettings.jsonData.organization;
                }
                SentryDatasource.prototype.query = function (options) {
                    var _this = this;
                    var params = {
                        'since': options.range.from._d.getTime() / 1000,
                        'until': options.range.to._d.getTime() / 1000,
                        'stat': 'received',
                    };
                    var requests = [];
                    options.targets.forEach(function (target) {
                        var url = '/api/0/projects/' + _this.organization + '/' + target.projectName + '/stats//';
                        var request = _this.doRequest({
                            url: url,
                            params: params,
                            method: 'GET'
                        }).then(function (data) {
                            return {
                                "target": target.projectName,
                                "datapoints": data.data.map(function (item) { return ([item[1], item[0] * 1000]); })
                            };
                        });
                        requests.push(request);
                    });
                    return Promise.all(requests).then(function (values) {
                        return {
                            'data': values
                        };
                    });
                };
                SentryDatasource.prototype.getProjects = function () {
                    return this.doRequest({
                        url: '/api/0/organizations/' + this.organization + '/projects//',
                        method: 'GET',
                    }).then(function (result) {
                        var items = result.data.map(function (item) { return ({ text: item.name, value: item.slug }); });
                        return lodash_1.default.orderBy(items, ['text'], ['asc']);
                    });
                };
                SentryDatasource.prototype.annotationQuery = function (options) {
                    console.error("Ignoring annotation query", options);
                };
                SentryDatasource.prototype.metricFindQuery = function (query) {
                    return this.doRequest({
                        url: '/api/0/organizations/' + this.organization + '/projects//',
                        method: 'GET',
                    }).then(function (result) {
                        var items = result.data.map(function (item) { return ({ text: item.name, value: item.slug }); });
                        items = lodash_1.default.orderBy(items, ['text'], ['asc']);
                        return items;
                    });
                };
                SentryDatasource.prototype.doRequest = function (options) {
                    options.headers = {
                        'Authorization': 'bearer ' + this.authToken
                    };
                    options.url = this.url + options.url;
                    return this.backendSrv.datasourceRequest(options);
                };
                SentryDatasource.prototype.testDatasource = function () {
                    return this.doRequest({
                        url: '/api/0/organizations/' + this.organization + "//",
                        method: 'GET',
                    }).then(function (response) {
                        if (response.status === 200) {
                            return { status: "success", message: "Data source is working", title: "Success" };
                        }
                        else {
                            return { status: "error", message: "Non-successful status code " + response.status, title: "Error" };
                        }
                    })
                        .catch(function (err) {
                        return { status: "error", message: "Error: " + JSON.stringify(err), title: "Error" };
                    });
                };
                return SentryDatasource;
            })();
            exports_1("SentryDatasource", SentryDatasource);
        }
    }
});
//# sourceMappingURL=datasource.js.map