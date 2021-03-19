/*
用法
    let validator = new Validator();
    validator.add(title, 'isNotEmpty', '请输入早报标题');
    validator.add(summaryVoList, 'minLength:1', '请添加今日综述');
    var errorMsg = validator.start();

    validator.add(this.params.userName, [{
        strategy: 'isNotEmpty',
        errorMsg: '用户名不能为空'
    },{
        strategy: 'minLength:6',
        errorMsg: '用户名长度不能小于6位'
    }]);

    if(errorMsg){// 获得效验结果

      return false;
    }
 */
/* eslint-disable */
let strategys = {
  isNotEmpty: (value, errorMsg) => {
    if (!value || value.trim() === '') {
      return errorMsg;
    }
  },
  isUrl: (value, errorMsg) => {
    if (!/(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/.test(value)) {
      return errorMsg;
    }
  },
  min: (value, minValue, errorMsg) => {
    if (value < minValue) {
      return errorMsg;
    }
  },
  max: (value, maxValue, errorMsg) => {
    if (value > maxValue) {
      return errorMsg;
    }
  },
  minLength: (value, length, errorMsg) => {
    if (value.length < length) {
      return errorMsg;
    }
  },
  maxLength: (value, length, errorMsg) => {
    if (value.length > length) {
      return errorMsg;
    }
  },
  // 数字与字母结合，必须以字母开头
  verifyPwd: (value, errorMsg) => {
    if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[a-zA-Z][0-9A-Za-z]{5,19}$/.test(value)) {
      return errorMsg;
    }
  },
  // 值对比校验
  resivePwd: (value, oldValue, errorMsg) => {
    if (value !== oldValue) {
      return errorMsg;
    }
  },
  mobileFormat: (value, errorMsg) => {
    if (!/(^1(3|4|5|6|7|8|9)\d{9}$)/.test(value)) {
      return errorMsg;
    }
  },
};

export var Validator = function () {
  this.cache = []; // 保存效验规则
};
Validator.prototype.add = function (dom, rule, errorMsg) {
  var str = rule.split(':');
  this.cache.push(function () {
    // str 返回的是 minLength:6
    var strategy = str.shift();
    str.unshift(dom); // value添加进参数列表
    str.push(errorMsg); // 把errorMsg添加进参数列表
    return strategys[strategy].apply(dom, str);
  });
};
Validator.prototype.diff = function (dom, rule, oldDom, errorMsg) {
  var str = rule.split(':');
  this.cache.push(function () {
    // str 返回的是 minLength:6
    var strategy = str.shift();
    str.unshift(dom); // value添加进参数列表
    str.push(oldDom);
    str.push(errorMsg); // 把errorMsg添加进参数列表
    return strategys[strategy].apply(dom, str);
  });
};
Validator.prototype.start = function () {
  for (var i = 0, validatorFunc; (validatorFunc = this.cache[i++]); ) {
    var msg = validatorFunc(); // 开始效验 并取得效验后的返回信息
    if (msg) {
      return msg;
    }
  }
};
