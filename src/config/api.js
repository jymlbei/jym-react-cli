const api = {
  // 获取参数数据
  getAuthInfo: {
    url: 'index/h5/get_auth_info',
  },
  // 授权登录
  login: {
    url: 'index/h5/auth.do',
    method: 'GET',
  },
  // 任务类型列表
  taskListType: {
    url: 'api/list_type.do',
    serviceName: 'task',
  },
};

// 组合api域名
for (const key in api) {
  // 区分服务名
  const serviceName = api[key].serviceName || api[key].serviceName === '' ? api[key].serviceName : 'xxxxxxxxx';
  api[key].url = `/${serviceName}/${api[key].url}`;
}

export default api;
