import React from 'react';
import { Route, Switch } from 'react-router-dom';
import CacheRoute, { CacheSwitch } from 'react-router-cache-route';
import { baseRoutes, businessRoutes } from '@config/router';
import './index.less';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // 渲染路由内容
  renderRouteContent(item, props) {
    return (
      <div className="main">
        {/* eslint-disable-next-line react/no-children-prop */}
        <item.component {...props} children={item.children} />
      </div>
    );
  }

  render() {
    return (
      <div id="app">
        {
          <Switch>
            {baseRoutes.map((item, index) => (
              <Route path={item.path} key={item.path} render={(props) => this.renderRouteContent(item, props)} />
            ))}
          </Switch>
        }
        <CacheSwitch>
          {businessRoutes.map((item, index) =>
            item.KeepAlive ? (
              <CacheRoute
                when={item.when ? item.when : 'forward'}
                path={item.path}
                key={item.path}
                multiple={item.multiple}
                render={(props) => this.renderRouteContent(item, props)}
              />
            ) : (
              <Route path={item.path} key={item.path} render={(props) => this.renderRouteContent(item, props)} />
            )
          )}
        </CacheSwitch>
      </div>
    );
  }
}

export default App;
