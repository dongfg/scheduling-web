import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  layout: {
    name: 'Scheduling',
    locale: false,
  },
  locale: {
    baseNavigator: false,
  },
  routes: [
    { path: '/', redirect: '/task' },
    { path: '/callback', redirect: '/task' },
    {
      path: '/task',
      name: '任务管理',
      component: '@/pages/index',
      icon: 'ProfileOutlined',
    },
    {
      path: '/taskLog',
      name: '任务日志',
      component: '@/pages/index',
      icon: 'RobotOutlined',
    },
  ],
  fastRefresh: {},
});
