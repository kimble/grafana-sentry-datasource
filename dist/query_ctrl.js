///<reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />
System.register(['lodash', 'app/plugins/sdk'], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var lodash_1, sdk_1;
    var SentryQueryCtrl;
    return {
        setters:[
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (sdk_1_1) {
                sdk_1 = sdk_1_1;
            }],
        execute: function() {
            //import './css/query_editor.css!';
            SentryQueryCtrl = (function (_super) {
                __extends(SentryQueryCtrl, _super);
                /** @ngInject **/
                function SentryQueryCtrl($scope, $injector, templateSrv) {
                    _super.call(this, $scope, $injector);
                    this.templateSrv = templateSrv;
                    this.defaults = {};
                    lodash_1.default.defaultsDeep(this.target, this.defaults);
                    this.target.projectName = this.target.projectName || 'Select project..';
                }
                SentryQueryCtrl.prototype.getProjects = function () {
                    return this.datasource.getProjects();
                };
                SentryQueryCtrl.prototype.onChangeInternal = function () {
                    this.panelCtrl.refresh(); // Asks the panel to refresh data.
                };
                SentryQueryCtrl.templateUrl = 'partials/query.editor.html';
                return SentryQueryCtrl;
            })(sdk_1.QueryCtrl);
            exports_1("SentryQueryCtrl", SentryQueryCtrl);
        }
    }
});
//# sourceMappingURL=query_ctrl.js.map