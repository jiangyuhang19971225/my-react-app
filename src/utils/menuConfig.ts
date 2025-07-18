// 🔥 【多语言菜单配置】- 根据当前语言返回对应的菜单配置
import { MenuItem } from '../types/language';

// 🎯 生成多语言菜单配置的函数
export const getMenuConfig = (t: (key: string) => string): MenuItem[] => [
  {
    key: 'home',
    label: t('menu.home'),
    path: '/',
  },
  {
    key: 'about',
    label: t('menu.about'),
    path: '/about',
  },
  {
    key: 'table',
    label: t('menu.table'),
    path: '/table',
  },
  {
    key: 'table2',
    label: t('menu.table2'),
    path: '/table2',
  },
  {
    key: 'form',
    label: t('menu.form'),
    children: [
      {
        key: 'form1',
        label: t('menu.form1'),
        path: '/form/form1',
      },
      {
        key: 'form2',
        label: t('menu.form2'),
        path: '/form/form2',
      },
      {
        key: 'form3',
        label: t('menu.form3'),
        path: '/form/form3',
      },
    ],
  },
  {
    key: 'echarts',
    label: t('menu.echarts'),
    path: '/echarts',
  },
  {
    key: 'classComponent',
    label: t('menu.classComponent'),
    path: '/classComponent',
  },
  {
    key: 'imgList',
    label: t('menu.imgList'),
    path: '/imgList',
  },
  {
    key: 'perInfo',
    label: t('menu.perInfo'),
    path: '/perInfo',
  },
  {
    key: 'web-socket',
    label: t('menu.webSocket'),
    path: '/web-socket',
  },
  {
    key: 'form-table',
    label: t('menu.formTable'),
    path: '/form-table',
  },
  {
    key: 'hooks-demo',
    label: t('menu.hooksDemo'),
    path: '/hooks-demo',
  },
  {
    key: 'article-list',
    label: t('menu.article'),
    path: '/article-list',
  },
  {
    key: 'dynamic-page',
    label: t('menu.dynamicPage'),
    path: '/dynamic-page',
  },
  {
    key: 'draggable',
    label: t('menu.draggable'),
    path: '/draggable',
  },
];
