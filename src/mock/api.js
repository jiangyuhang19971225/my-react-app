import Mock from 'mockjs';

// vite-plugin-mock 格式
export default [
  {
    url: '/api/tableData',
    method: 'get',
    response: () => {
      console.log('Mock 拦截到请求: /api/tableData');
      // 生成十条随机数据，增加更多字段
      const dataSource = Mock.mock({
        'list|10': [
          {
            'key|+1': 1,
            name: '@cname', // 随机中文姓名
            'age|18-60': 1, // 随机年龄，范围 18 - 60
            address: '@county(true)', // 随机地址
            email: '@email', // 随机邮箱
            phone: /^1[3-9]\d{9}$/, // 随机手机号
            job: '@job', // 随机职业
            company: '@company', // 随机公司名称
            'salary|3000-20000': 1, // 随机薪资，范围 5000 - 50000
          },
        ],
      }).list;

      return {
        code: 200,
        message: 'success',
        data: dataSource,
      };
    },
  },
  // 🔥【新增】用户数据接口
  {
    url: '/api/users/:id',
    method: 'get',
    timeout: 1000, // 直接使用 Mock.js 的 timeout 配置
    response: (req) => {
      console.log('Mock 拦截到请求: /api/users/' + req.query.id);

      // 模拟用户数据，每次请求生成不同的数据
      const userData = Mock.mock({
        id: +req.query.id || 1,
        name: '@cname', // 随机中文姓名
        email: '@email', // 随机邮箱
        phone: /^1[3-9]\d{9}$/, // 随机手机号
        avatar: '@image("200x200", "@color", "@name")', // 随机头像
        job: '@job', // 随机职业
        company: '@company', // 随机公司
        address: '@county(true)', // 随机地址
        lastLogin: '@datetime("yyyy-MM-dd HH:mm:ss")', // 随机最后登录时间
      });

      return {
        code: 200,
        message: 'success',
        data: userData,
      };
    },
  },
];
