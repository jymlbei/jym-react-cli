import axios from 'axios';
import { Toast } from 'antd-mobile';
import apiConfig from '@config/api';

const NODE_ENV = process.env.NODE_ENV;
let loadingCount = 0; // 统计需要loading的请求，还没返回的数量
/**
 * api: ajax请求路径
 * params: ajax请求体
 * isError：是否显示默认错误信息
 * isLoading：是否显示默认loading
 */
export default function ajax(api, params = {}, isError = true, isLoading = false, loadingMsg = '加载中...') {
  const { url = '', method = 'POST', isJson = true, serviceName, timeout } = apiConfig[api];
  const headers = {
    'Content-Type': isJson ? 'application/json' : 'multipart/form-data',
  };
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    if (isLoading) {
      loadingCount++;
      loadingCount === 1 && Toast.loading(loadingMsg, 0); // Toast.loading需要加loadingCount === 1
    }
    const obj = {
      url,
      method,
      headers,
    };
    // 群发确认页面添加超时配置
    if (timeout) {
      obj.timeout = timeout;
    }
    if (method === 'GET') {
      obj.params = params;
    } else if (!isJson) {
      const formData = new FormData();
      for (const [key, value] of Object.entries(params)) {
        formData.append(key, value);
      }
      obj.data = formData;
    }
    try {
      const { status, data, statusText } = await axios(obj);
      if (status === 200) {
        const { ret, retmsg } = data;
        switch (ret) {
          case 0:
            resolve(data);
            break;
          case 1000001:
            // 登录失效
            // isError && showError(retmsg)
            // reject(new Error(data ? `${JSON.stringify(data)}` : `未知错误 [from axios 拦截器]`))
            break;
          default:
            isError && showError(retmsg);
            reject(new Error(data ? `${JSON.stringify(data)}` : '未知错误 [from axios 拦截器]'));
        }
      } else {
        isError && showError(statusText);
        reject(new Error(statusText ? `${JSON.stringify(statusText)}` : '未知错误 [from axios 拦截器]'));
      }
    } catch (e) {
      isError && showError();
      reject(e);
    } finally {
      if (isLoading) {
        loadingCount--;
        loadingCount === 0 && Toast.hide();
      }
    }
  });
}

function showError(msg = '服务异常，请稍后重试') {
  setTimeout(() => {
    // 关闭页面loading
    Toast.fail(msg);
  }, 600);
}
