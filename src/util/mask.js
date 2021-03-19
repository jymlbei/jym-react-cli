// mask.js
import React from 'react';
import ReactDOM from 'react-dom';
import { isIE, isIE11 } from '@util';

export default {
  dom: null, // 被append的元素
  show() {
    this.hide();
    this.dom = document.createElement('div');
    this.dom.setAttribute('class', 'load-content');

    // JSX代码
    const JSXdom = (
      <div>
        <img src={require('@asset/image/empty/loading1.png')} className="img1" />
        <div className="img2-box">
          <img src={require('@asset/image/empty/loading2.png')} className="img2" />
        </div>
        <p>内容即将奉上，请稍候…</p>
      </div>
    );
    ReactDOM.render(JSXdom, this.dom);
    document.body.appendChild(this.dom);
  },
  hide() {
    if (this.dom) {
      if (isIE() || isIE11()) {
        this.dom.removeNode(true);
      } else {
        this.dom.remove();
      }
    }
  },
};
