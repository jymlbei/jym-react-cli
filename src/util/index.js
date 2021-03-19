/** 将url的search部分转化为json
 *  @param url:String -- url地址
 *  @param codeURI:Boolean -- 是否解码
 */
export const searchToJson = (url = window.location.href, codeURI = false) => {
  url = url || '';
  const search = url.split('?');
  let result = {};
  search.forEach((item, index) => {
    if (index !== 0) {
      result = item.split('&').reduce((obj, item) => {
        const arr = item.split('=');
        return { ...obj, [arr[0]]: codeURI ? decodeURIComponent(arr[1]) : arr[1] };
      }, result);
    }
  });
  return result;
};

// 获取cookie
export const getCookie = (name) => {
  const strCookie = document.cookie;
  const arrCookie = strCookie.split('; ');
  for (let i = 0; i < arrCookie.length; i++) {
    const arr = arrCookie[i].split('=');
    if (arr[0] === name) {
      return arr[1];
    }
  }
  return '';
};

// time秒 默认30天
export const setCookie = (name, value, time) => {
  time = time || 30 * 24 * 3600;
  const exp = new Date();
  exp.setTime(exp.getTime() + time * 1000);
  // 注意 这里一定要写path=/ 让cookie写在根路径/下面(也就是域名下)
  // 如果不指定path，由于测试服的访问地址是https://test.qtrade.com.cn/xx_admin
  // 在setCookie 'xx_user'的时path默认是xx_admin
  // 之后clearCookieByKey 'xx_key'就只能清除xx_admin下的xx_key，而cookie xx_key是后端写到前端的，path是 /
  document.cookie = name + '=' + value + ';expires=' + exp.toGMTString() + ';path=/';
};

// 清除cookie
export const clearCookieByKey = (name) => {
  setCookie(name, '', -1);
};

// 获取url参数
export const getUrlQueryString = (search, name) => {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
  const r = search.substr(1).match(reg);
  if (r != null) {
    return r[2];
  }
  return '';
};

/** 将json转换为url的search部分
 *  @param json:Object
 *  @param codeURI:Boolean -- 是否编码
 */
export const jsonToSearch = (json = {}, codeURI = false) => {
  const result = Object.keys(json)
    .reduce((result, item) => `${result}${item}=${codeURI ? encodeURIComponent(json[item]) : json[item]}&`, '?')
    .slice(0, -1);
  return result;
};

// 判断IE
export const isIE = () => {
  if (!!window.ActiveXobject || 'ActiveXObject' in window) {
    return true;
  } else {
    return false;
  }
};

// 判断IE11
export const isIE11 = () => {
  if (/Trident\/7\./.test(navigator.userAgent)) {
    return true;
  } else {
    return false;
  }
};

// 上拉滚动事件，调用回调函数
export const windowScrollHandle = (scrollDom, callback, time) => {
  let timer;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      // scrollHeight内容总高 scrollTop是卷去的高度 innerHeight屏幕总高
      const scrollHeight = scrollDom.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      const innerHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
      if (innerHeight + scrollTop + 20 > scrollHeight) {
        callback();
      }
    }, time);
  };
};

// 将数字转换为千分位
export const dieTausendstel = (num) => {
  return ((Number(num) || 0) + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
};

// 将数字转换为万单位和亿单位
export const dieTausendstelUnit = (num) => {
  if (num === '' || num === null || num === undefined) {
    return '--';
  }
  const moneyUnits = ['元', '万', '亿', '万亿'];
  const dividend = 10000;
  let curentNum = num;
  // 转换数字
  let curentUnit = moneyUnits[0];
  // 转换单位
  for (let i = 0; i < 4; i++) {
    curentUnit = moneyUnits[i];
    const stringNum = curentNum.toString();
    const index = stringNum.indexOf('.');
    let newNum = stringNum;
    if (index !== -1) {
      newNum = stringNum.substring(0, index);
    }
    if (newNum.length < 5) {
      break;
    }
    curentNum = curentNum / dividend;
  }
  const m = { num: 0, unit: '' };
  m.num = curentNum.toFixed(2);
  m.unit = curentUnit;
  return m.num + m.unit;
};

// 数值转换保留小数位
export const changeFundNumber = (num, length = 2, hasPercent = true) => {
  const type = typeof num === 'number' || typeof num === 'string';
  return type && num + '' ? `${(num - 0).toFixed(length)}${hasPercent ? '%' : ''}` : '--';
};

// 数值颜色class名  up  红  down  绿  grey  灰
export const getNumberClassName = (num) => {
  const type = typeof num === 'number' || typeof num === 'string';
  return type && num + '' ? (num - 0 >= 0 ? 'fund-up' : 'fund-down') : 'grey';
};

// 向下兼容IOS滚动
export const scrollSmoothTo = (position) => {
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function (callback, element) {
      return setTimeout(callback, 17);
    };
  }
  // 当前滚动高度
  let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  // 滚动step方法
  const step = function () {
    // 距离目标滚动距离
    const distance = position - scrollTop;
    // 目标滚动位置
    scrollTop = scrollTop + distance / 3;
    if (Math.abs(distance) < 1) {
      window.scrollTo(0, position);
    } else {
      window.scrollTo(0, scrollTop);
      window.requestAnimationFrame(step);
    }
  };
  step();
};

// 深拷贝
export const deepCopyObj = (obj) => {
  // 只拷贝对象
  if (typeof obj !== 'object') return;
  // 根据obj的类型判断是新建一个数组还是一个对象
  const newObj = obj instanceof Array ? [] : {};
  for (const key in obj) {
    // 遍历obj,并且判断是obj的属性才拷贝
    // eslint-disable-next-line
    if (obj.hasOwnProperty(key)) {
      // 判断属性值的类型，如果是对象递归调用深拷贝
      newObj[key] = typeof obj[key] === 'object' ? deepCopyObj(obj[key]) : obj[key];
    }
  }
  return newObj;
};

// promise.allSettled  polyfill
export const promiseFun = () => {
  Promise.allSettled =
    Promise.allSettled ||
    function (arr) {
      const P = this;
      return new P(function (resolve, reject) {
        if (Object.prototype.toString.call(arr) !== '[object Array]') {
          return reject(
            new TypeError(
              typeof arr + ' ' + arr + ' ' + ' is not iterable(cannot read property Symbol(Symbol.iterator))'
            )
          );
        }
        const args = Array.prototype.slice.call(arr);
        if (args.length === 0) return resolve([]);
        let arrCount = args.length;

        function resolvePromise(index, value) {
          if (typeof value === 'object') {
            const then = value.then;
            if (typeof then === 'function') {
              then.call(
                value,
                function (val) {
                  args[index] = { status: 'fulfilled', value: val };
                  if (--arrCount === 0) {
                    resolve(args);
                  }
                },
                function (e) {
                  args[index] = { status: 'rejected', reason: e };
                  if (--arrCount === 0) {
                    resolve(args);
                  }
                }
              );
            }
          }
        }

        for (let i = 0; i < args.length; i++) {
          resolvePromise(i, args[i]);
        }
      });
    };
};