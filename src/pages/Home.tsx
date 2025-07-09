// 🔥 【HOME页面】- 集成Redux状态管理和i18n国际化
import React, { useEffect } from 'react';
import { Button, Select, Space, Card, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../store';
import { switchLanguage, selectCurrentLanguage } from '../store/slices/languageSlice';
import { Language } from '../types/language';
import { fetchUser, setUser } from '../store/slices/userSlice';

const { Title, Paragraph } = Typography;
const { Option } = Select;

const Home: React.FC = () => {
  useEffect(() => {
    fetchUserData();
  }, []);
  const fetchUserData = async () => {
    const res = await fetch('http://localhost:3000/api/users');
    console.log('自己的res', res);
  };
  // 🔥 【使用i18n Hook】- 获取翻译函数
  const { t, i18n } = useTranslation();

  // 🔥 【使用Redux Hooks】- 获取当前语言状态和dispatch函数
  const dispatch = useAppDispatch(); // 📝 这是dispatch函数，用于发送actions
  const currentLanguage = useAppSelector(selectCurrentLanguage); // 📝 这是selector，用于获取state数据

  // 🔥 获取用户状态
  const { user, status, error } = useAppSelector((state) => state.user);
  // → reducer更新store
  // → useSelector检测到变化
  // → 组件自动重新渲染

  // 🔥 语言切换处理函数
  const handleLanguageChange = (language: Language) => {
    // 📝 发送action到store，触发reducer更新状态
    dispatch(switchLanguage(language));
    // 📝 同时更新i18n的语言设置
    i18n.changeLanguage(language);
  };

  // 🔥 手动刷新用户数据
  const handleRefreshUser = async () => {
    const resultAction = await dispatch(fetchUser(1));
    console.log('resultAction', resultAction);

    // 特殊逻辑处理下name
    if (fetchUser.fulfilled.match(resultAction) && resultAction.payload) {
      dispatch(
        setUser({
          ...resultAction.payload,
          name: `${resultAction.payload.name} 这是我的姓名`,
        }),
      );
    }
  };

  // const inputComponent = () => {
  //   return <input type="text" placeholder="这是一个input组件" />;
  // };

  // // 新模块动态渲染组件
  // const renderDynamicComponent: React.FC = () => {
  //   const DynamicComponent = React.lazy(() => import('./dynamicComponent'));
  //   return (
  //     <Suspense fallback={<div>Loading...</div>}>
  //       <DynamicComponent />
  //     </Suspense>
  //   );
  // };
  return (
    <div className="home-container">
      <h1>{t('welcome')}</h1>

      {/* 🔥 用户数据展示区域 */}
      <div
        className="user-section"
        style={{
          margin: '20px 0',
          padding: '20px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          backgroundColor: '#f9f9f9',
        }}
      >
        <h2>用户信息测试 redux</h2>

        {/* 刷新按钮 */}
        <button
          onClick={handleRefreshUser}
          disabled={status === 'loading'}
          style={{
            padding: '8px 16px',
            margin: '10px 0',
            backgroundColor: status === 'loading' ? '#ccc' : '#1890ff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: status === 'loading' ? 'not-allowed' : 'pointer',
          }}
        >
          {status === 'loading' ? '刷新中...' : '刷新用户数据'}
        </button>

        {/* 加载状态 */}
        {status === 'loading' && (
          <div style={{ color: '#1890ff', margin: '10px 0' }}>🔄 正在加载用户数据...</div>
        )}

        {/* 错误状态 */}
        {status === 'failed' && error && (
          <div style={{ color: '#ff4d4f', margin: '10px 0' }}>❌ 加载失败: {error}</div>
        )}

        {/* 用户数据展示 */}
        {user && (
          <div style={{ marginTop: '15px' }}>
            <h3>👤 用户详情：</h3>
            <div
              style={{
                backgroundColor: 'white',
                padding: '15px',
                borderRadius: '6px',
                border: '1px solid #e8e8e8',
              }}
            >
              <p>
                <strong>ID:</strong> {user.id}
              </p>
              <p>
                <strong>姓名:</strong> {user.name}
              </p>
              <p>
                <strong>邮箱:</strong> {user.email}
              </p>
              {user.phone && (
                <p>
                  <strong>电话:</strong> {user.phone}
                </p>
              )}
              {user.job && (
                <p>
                  <strong>职业:</strong> {user.job}
                </p>
              )}
              {user.company && (
                <p>
                  <strong>公司:</strong> {user.company}
                </p>
              )}
              {user.address && (
                <p>
                  <strong>地址:</strong> {user.address}
                </p>
              )}
              {user.lastLogin && (
                <p>
                  <strong>最后登录:</strong> {user.lastLogin}
                </p>
              )}
            </div>
          </div>
        )}

        {/* 当前状态指示器 */}
        <div style={{ marginTop: '15px', fontSize: '12px', color: '#666' }}>
          <strong>当前状态:</strong>
          <span
            style={{
              marginLeft: '8px',
              padding: '2px 8px',
              borderRadius: '12px',
              backgroundColor:
                status === 'loading' ? '#e6f7ff' : status === 'failed' ? '#fff2f0' : '#f6ffed',
              color: status === 'loading' ? '#1890ff' : status === 'failed' ? '#ff4d4f' : '#52c41a',
            }}
          >
            {status === 'loading' ? '加载中' : status === 'failed' ? '失败' : '空闲'}
          </span>
        </div>
      </div>

      <div style={{ padding: '24px' }}>
        <Card>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* 🎯 页面标题 - 使用i18n翻译 */}
            <Title level={1}>{t('pages.homeTitle')}</Title>

            {/* 🎯 欢迎信息 */}
            <Paragraph style={{ fontSize: '16px' }}>{t('pages.welcomeMessage')}</Paragraph>

            {/* 🔥 【语言切换下拉框】- 核心功能 */}
            <Space>
              <span>{t('common.selectLanguage')}:</span>
              <Select
                value={currentLanguage}
                onChange={handleLanguageChange}
                style={{ width: 120 }}
                size="middle"
              >
                <Option value="zh">{t('common.chinese')}</Option>
                <Option value="en">{t('common.english')}</Option>
              </Select>
            </Space>

            {/* 🎯 示例按钮 */}
            <Button type="primary" size="large">
              Ant Design Button
            </Button>

            {/* 🔥 【调试信息】- 显示当前Redux状态 */}
            <Card size="small" style={{ backgroundColor: '#f5f5f5' }}>
              <Title level={4}>🔍 Debug Info (Redux State):</Title>
              <Paragraph code>Current Language in Redux Store: {currentLanguage}</Paragraph>
              <Paragraph code>Current i18n Language: {i18n.language}</Paragraph>
            </Card>
          </Space>
        </Card>
      </div>
    </div>
  );
};

export default Home;
