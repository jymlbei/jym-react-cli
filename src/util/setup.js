import fastclick from 'fastclick';
import vconsole from 'vconsole';
const NODE_ENV = process.env.NODE_ENV;

/* eslint-disable */

// 解决点击延迟300ms的问题
fastclick.attach(document.body);

if (NODE_ENV !== 'development') {
  // 线上调试工具
  new vconsole();
  let timer2 = setInterval(() => {
    let consoleDom = document.querySelector('#__vconsole');
    if (consoleDom) {
      clearInterval(timer2);
      localStorage.setItem('vConsole_switch_y', 300);
      timer2 = null;
      const { origin } = window.location;
      if (
        origin.indexOf('dev.tengmoney.com') !== -1 ||
        origin.indexOf('test.tengmoney.com') !== -1 ||
        origin.indexOf('uat.tengmoney.com') !== -1
      ) {
        consoleDom.style.display = 'block';
        consoleDom = null;
      } else {
        // 点击页面12下后调出调试工具
        let count = 0;
        let timer = null;
        const showVconsole = () => {
          count++;
          if (count >= 15) {
            consoleDom.style.display = 'block';
            consoleDom = null;
            clearTimeout(timer);
            timer = null;
            document.body.removeEventListener('click', showVconsole);
            count = null;
            return;
          }
          clearTimeout(timer);
          timer = setTimeout(() => {
            count = 0;
          }, 400);
        };
        document.body.addEventListener('click', showVconsole);
      }
    }
  }, 1000);
}

// 解决ios下输入框点击不唤起软键盘的bug
document.body.addEventListener('click', (e) => {
  const dom = e.target;
  const { tagName } = dom;
  if (tagName === 'INPUT' || tagName === 'TEXTAREA' || dom.getAttribute('contenteditable') === 'true') {
    dom.focus();
  }
});

/** 拓展 Date 原型方法 */
/**
 * 对 Date 的扩展，将 Date 转化为指定格式的 String
 * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 *
 * e.g : (new Date()).format("yyyy-MM-dd hh:mm:ss.S") => 2006-07-02 08:09:04.423
 *       (new Date()).format("yyyy-M-d h:m:s.S")      => 2006-7-2 8:9:4.18
 *
 *  @param fmt 格式化公式
 */
// TODO: 尽量不要直接拓展js原生对象，以免造成不必要的问题
Date.prototype.format = function (fmt) {
  let o = {
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'h+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
    'q+': Math.floor((this.getMonth() + 3) / 3),
    S: this.getMilliseconds(),
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt))
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
  }
  return fmt;
};

// 设置图表的颜色备选
window.colors = [
  '#F871CF',
  '#B14DEB',
  '#1A68E8',
  '#50A3FF',
  '#51D8FF',
  '#31BC8D',
  '#9AD658',
  '#FFC751',
  '#FF9751',
  '#FF5951',
  '#B3B3B3',
];
// 获取相对UI稿，屏幕的缩放比例，主要echarts中用
window.scale = document.documentElement.clientWidth / 750;
// 动态设置html的font-size
document.querySelector('html').style.fontSize = 100 * window.scale + 'px';
window.onresize = function () {
  // 获取相对UI稿，屏幕的缩放比例，主要echarts中用
  window.scale = document.documentElement.clientWidth / 750;
  // 动态设置html的font-size
  document.querySelector('html').style.fontSize = 100 * window.scale + 'px';
};
// 设置主题颜色
window.themeColor = '#3078db';
