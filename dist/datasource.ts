import _ from "lodash";

export class SentryDatasource {
  type: string;
  url: string;
  name: string;
  authToken: string;
  organization: string;


  /** @ngInject */
  constructor(instanceSettings, private $q, private backendSrv, private templateSrv) {
    this.type = instanceSettings.type;
    this.url = instanceSettings.url;
    this.name = instanceSettings.name;
    this.authToken = instanceSettings.jsonData.AuthToken;
    this.organization = instanceSettings.jsonData.organization;
  }

  query(options) {
    const params = {
      'since': options.range.from._d.getTime() / 1000,
      'until': options.range.to._d.getTime() / 1000,
      'stat': 'received',
    };

    const requests = [];
    options.targets.forEach(target => {
      const url = '/api/0/projects/'+ this.organization +'/' + target.projectName + '/stats//';

      const request = this.doRequest({
        url: url,
        params: params,
        method: 'GET'
      }).then(data => {
        return {
          "target": target.projectName,
          "datapoints": data.data.map(item => ([item[1], item[0] * 1000]))
        }
      });

      requests.push(request);
    });

    return Promise.all(requests).then(values => {
      return {
        'data': values
      }
    });
  }

  getProjects() {
    return this.doRequest({
      url: '/api/0/organizations/' + this.organization +'/projects//',
      method: 'GET',
    }).then(result => {
      const items = result.data.map(item => ({text: item.name, value: item.slug}));
      return _.orderBy(items, ['text'], ['asc']);
    });
  }

  annotationQuery(options) {
    console.error("Ignoring annotation query", options);
  }

  metricFindQuery(query) {
    return this.doRequest({
      url: '/api/0/organizations/' + this.organization +'/projects//',
      method: 'GET',
    }).then(result => {
      var items = result.data.map(item => ({text: item.name, value: item.slug}));
      items = _.orderBy(items, ['text'], ['asc']);
      return items;
    });
  }

  doRequest(options) {
    options.headers = {
      'Authorization': 'bearer ' + this.authToken
    };
    options.url = this.url + options.url;
    return this.backendSrv.datasourceRequest(options);
  }

  testDatasource() {
    return this.doRequest({
      url: '/api/0/organizations/' + this.organization + "//", // Grafana backend seems to strip of one trailing /
      method: 'GET',
    }).then(response => {
      if (response.status === 200) {
        return { status: "success", message: "Data source is working", title: "Success" };
      }
      else {
        return { status: "error", message: "Non-successful status code " + response.status, title: "Error" };
      }
    })
    .catch(err => {
      return { status: "error", message: "Error: " + JSON.stringify(err), title: "Error" };
    });
  }
}
