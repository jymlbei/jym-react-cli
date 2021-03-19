import '@babel/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import App from '@view/app';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { createStore } from 'redux';
import store from '@store';
import '@util/setup.js'; // 此文件放入主动执行的js代码
import '@asset/css/base.less';

ReactDOM.render(
  <BrowserRouter basename="/">
    <Provider store={createStore(store)}>
      <App />
    </Provider>
  </BrowserRouter>,
  document.getElementById('root')
);
