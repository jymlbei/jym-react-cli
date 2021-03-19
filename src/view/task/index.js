import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import CacheRoute, { CacheSwitch } from 'react-router-cache-route';
import './index.less';

class Task extends Component {
  state = {};

  render = () => {
    const { children } = this.props;
    let firstRoute = '';
    return (
      <CacheSwitch>
        {children.map((item, index) => {
          if (!index) {
            firstRoute = item;
          }
          return item.KeepAlive ? (
            <CacheRoute
              cacheKey={item.name}
              when={item.when ? item.when : 'forward'}
              path={item.path}
              key={item.path}
              component={item.component}
            />
          ) : (
            <Route path={item.path} key={item.path} component={item.component} />
          );
        })}
        <Redirect from="/task" to={firstRoute.path} />
      </CacheSwitch>
    );
  };
}

export default Task;
