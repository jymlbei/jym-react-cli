import React from 'react';
import sensors from 'sa-sdk-javascript'; // 神策埋点
import { getEnv } from '@util';

// 基础配置
const sensorsConfig = {
  name: 'sensors',
  server_url: process.env.SC_SERVER_URL,
  show_log: false,
  heatmap: {
    // 是否开启点击图，default 表示开启，自动采集 $WebClick 事件，可以设置 'not_collect' 表示关闭。
    clickmap: 'default',
    // 是否开启 div 的全埋点采集，默认不采集
    collect_tags: {
      div: {
        ignore_tags: ['mark', 'strong', 'b', 'em', 'i', 'u', 'abbr', 'ins', 'del', 's', 'sup', 'span', 'img'], // 接收数组形式参数，如配置 span 则 div 中只包含 span 时也会采集 div 的点击。
      },
    },
    // 是否开启触达注意力图，not_collect 表示关闭，不会自动采集 $WebStay 事件，可以设置 'default' 表示开启。
    scroll_notice_map: 'default',
  },
  // SDK 默认优先以元素 ID 作为选择器采集点击事件，若不想以 ID 作为选择器，可以设置该参数为 'not_use_id'。
  element_selector: 'not_use_id',
};

// 初始化
sensors.init(sensorsConfig);

// 注册公共属性
sensors.registerPage({
  application_name: 'H5', // 应用名称
  application_environment: getEnv() === 1 ? '企业微信' : getEnv() === 2 ? '微信' : '', // 运行环境：企业微信、微信
});

// 绑定全局神策实例
React.$sensors = sensors;
