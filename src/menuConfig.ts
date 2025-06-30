// menuConfig.ts
const menuConfig = [
  {
    key: 'home',
    label: 'Home',
    path: '/',
  },
  {
    key: 'about',
    label: 'About',
    path: '/about',
  },
  {
    key: 'table',
    label: 'Table',
    path: '/table',
  },
  {
    key: 'table2',
    label: 'Table2',
    path: '/table2',
  },
  {
    key: 'form',
    label: '表单',
    children: [
      {
        key: 'form1',
        label: '基础表单和校验表单',
        path: '/form/form1',
      },
      {
        key: 'form2',
        label: '动态表单',
        path: '/form/form2',
      },
      {
        key: 'form3',
        label: '表单高级用法',
        path: '/form/form3',
      },
    ],
  },
  {
    key: 'echarts',
    label: '图表',
    path: '/echarts',
  },
  {
    key: 'classComponent',
    label: 'ClassComponent',
    path: '/classComponent',
  },
  {
    key: 'imgList',
    label: 'imgList',
    path: '/imgList',
  },
  {
    key: 'perInfo',
    label: 'perInfo',
    path: '/perInfo',
  },
  {
    key: 'web-socket',
    label: 'web-socket',
    path: '/web-socket',
  },
  {
    key: 'form-table',
    label: 'form-table',
    path: '/form-table',
  },
  {
    key: 'hooks-demo',
    label: 'Hooks 综合练习',
    path: '/hooks-demo',
  },
];

export default menuConfig;
