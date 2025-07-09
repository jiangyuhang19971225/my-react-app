// 🔥 【APP根组件】- 集成Redux Store和i18n国际化的应用入口
import React, { useEffect } from 'react';
import { Route, Routes, Link, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu, Breadcrumb } from 'antd';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from './store';
import { fetchUser } from './store/slices/userSlice';

// 🔥 【导入配置】
import './i18n'; // 初始化i18n配置
import routes from './routes';
import { getMenuConfig } from './utils/menuConfig';

const { Header, Sider, Content } = Layout;

// 🔥 【类型定义】
interface MenuItem {
  key: string;
  label: string;
  path?: string;
  children?: MenuItem[];
}

// 🔥 【API上下文】- 保持原有的API配置上下文
export const ApiConfigContext = React.createContext({
  baseUrl: 'http://localhost:3000',
  authToken: '',
});

/**
 * 🔥 【路由守卫组件】- 导航守卫逻辑
 */
const RouteGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    const isAuthenticated = true; // 实际项目中替换为真实的认证逻辑
    if (!isAuthenticated && location.pathname !== '/') {
      navigate('/');
    }
  }, [location, navigate]);

  return <>{children}</>;
};

/**
 * 🔥 【应用布局组件】- 包含菜单和内容区域，支持多语言
 */
const AppLayout: React.FC = () => {
  // 🔥 【使用i18n】- 获取翻译函数
  const { t } = useTranslation();

  const navigate = useNavigate();
  const currentPath = useLocation().pathname;
  const selectedKey = currentPath === '/' ? 'home' : currentPath.split('/')[1];

  // 🔥 【多语言菜单配置】- 根据当前语言动态生成菜单
  const menuConfig = React.useMemo(() => getMenuConfig(t), [t]);

  // 🔥 【查找路径函数】
  const findPathByKey = (targetKey: string, menuItems: MenuItem[]): string | undefined => {
    for (const item of menuItems) {
      if (item.key === targetKey) {
        return item.path;
      }
      if (item.children?.length) {
        const nestedPath = findPathByKey(targetKey, item.children);
        if (nestedPath) return nestedPath;
      }
    }
    return undefined;
  };

  // 🔥 【菜单点击处理】
  const onClick = (key: string) => {
    const path = findPathByKey(key, menuConfig);
    if (!path) {
      console.error(`No path found for key: ${key}`);
      navigate('/');
      return;
    }
    navigate(path);
  };

  // 🔥 【API上下文值】
  const contextValue = React.useMemo(
    () => ({
      baseUrl: 'http://localhost:3000',
      authToken: localStorage.getItem('token') ?? '',
    }),
    [],
  );

  return (
    <Layout style={{ height: '100vh' }}>
      {/* 🔥 【侧边栏菜单】- 支持多语言 */}
      <Sider
        width={200}
        theme="light"
        collapsible
        breakpoint="lg"
        collapsedWidth="0"
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
        }}
      >
        <div
          style={{
            height: 64,
            padding: '12px 16px',
            borderBottom: '1px solid rgba(5, 5, 5, 0.06)',
          }}
        >
          {/* 🎯 菜单标题 - 使用i18n翻译 */}
          <h2 style={{ margin: 0 }}>
            {t('common.language') === '语言' ? '系统菜单' : 'System Menu'}
          </h2>
        </div>
        <Menu
          mode="inline"
          theme="light"
          items={menuConfig.map((item) => ({
            ...item,
            label: item.label, // 已经通过t()函数翻译过了
          }))}
          selectedKeys={[selectedKey]}
          onClick={({ key }) => onClick(key)}
          style={{ borderRight: 0 }}
        />
      </Sider>

      {/* 🔥 【右侧内容区域】 */}
      <Layout
        style={{
          marginLeft: 200,
          minHeight: '100vh',
        }}
      >
        <Header
          style={{
            padding: 0,
            background: '#fff',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            zIndex: 1,
            position: 'sticky',
            top: 0,
            display: 'flex',
            alignItems: 'center',
            height: 64,
            paddingLeft: 24,
          }}
        >
          {/* 🔥 【面包屑导航】- 支持多语言，使用新版 items 属性 */}
          <Breadcrumb
            items={React.useMemo(() => {
              const breadcrumbItems: Array<{
                key: string;
                title: React.ReactNode;
              }> = [];

              // 添加首页
              breadcrumbItems.push({
                key: 'home',
                title: <Link to="/">{t('menu.home')}</Link>,
              });

              // 处理当前路径
              const pathSegments = currentPath.split('/').filter(Boolean);

              if (pathSegments.length > 0 && currentPath !== '/') {
                pathSegments.forEach((segment, index) => {
                  const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
                  const route = routes.find((r) => r.path === path);
                  const label = (route as { label?: string })?.label || segment;

                  // 非最后一项可点击
                  if (index !== pathSegments.length - 1) {
                    breadcrumbItems.push({
                      key: path,
                      title: <Link to={path}>{label}</Link>,
                    });
                  } else {
                    // 最后一项不可点击
                    breadcrumbItems.push({
                      key: path,
                      title: label,
                    });
                  }
                });
              }

              return breadcrumbItems;
            }, [currentPath, t])}
          />
        </Header>

        {/* 🔥 【内容区域】- 包含API上下文和路由 */}
        <ApiConfigContext.Provider value={contextValue}>
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              background: '#fff',
              borderRadius: 8,
              overflow: 'auto',
            }}
          >
            <RouteGuard>
              <Routes>
                {routes.map((route, index) => (
                  <Route key={index} path={route.path} element={route.element} />
                ))}
              </Routes>
            </RouteGuard>
          </Content>
        </ApiConfigContext.Provider>
      </Layout>
    </Layout>
  );
};

/**
 * 🔥 【根App组件】- 提供Redux Store和i18n支持
 */
const App: React.FC = () => {
  const dispatch = useAppDispatch();

  // 🔥 应用初始化时自动获取用户数据
  useEffect(() => {
    console.log('🚀 App初始化，自动获取用户数据');
    dispatch(fetchUser(1)); // 获取ID为1的用户数据
  }, [dispatch]);

  return <AppLayout />;
};

export default App;
