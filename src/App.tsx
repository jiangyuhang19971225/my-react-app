// 导入 React 库
import React from 'react';
// 从 react-router-dom 库中导入路由相关的组件和钩子
import { Route, Routes, Link, useLocation, useNavigate } from 'react-router-dom';
// 从 antd 库中导入布局和菜单组件
import { Layout, Menu, Breadcrumb } from 'antd';
// 导入路由配置文件
import routes from './routes';
// 导入菜单配置文件
import menuConfig from './menuConfig.ts';

// 解构赋值，从 Layout 中提取 Header, Sider 和 Content 组件
const { Header, Sider, Content } = Layout;

interface MenuItem {
  key: string;
  label: string;
  path?: string;
  children?: MenuItem[];
}

/**
 * RouteGuard 组件，用于实现导航守卫逻辑。
 *
 * @param {Object} props - 组件的属性对象。
 * @param {React.ReactNode} props.children - 组件的子元素。
 * @returns {React.ReactNode} 渲染的组件内容。
 */
const RouteGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 获取当前的路由位置
  const location = useLocation();
  // 获取导航函数
  const navigate = useNavigate();
  // 打印当前的路由位置
  console.log('location', location);
  // 打印导航函数
  console.log('navigate', navigate);

  // 在这里添加你的导航守卫逻辑
  React.useEffect(() => {
    // 替换为实际的认证逻辑，这里暂时设为 true
    const isAuthenticated = true;
    // 如果用户未认证且当前路径不是根路径，则导航到根路径
    if (!isAuthenticated && location.pathname !== '/') {
      navigate('/');
    }
  }, [location, navigate]);

  // 返回子元素
  return <>{children}</>;
};

/**
 * App 组件，应用的根组件。
 *
 * @returns {React.ReactNode} 渲染的组件内容。
 */
const App: React.FC = () => {
  // 获取导航函数
  const navigate = useNavigate();
  // 获取当前的路径
  const currentPath = useLocation().pathname;
  // 处理路径为 / 的情况，提取选中的菜单键
  const selectedKey = currentPath === '/' ? '' : currentPath.split('/')[1];
  console.log('jyhselectedKey', selectedKey, currentPath);

  const findPathByKey = (targetKey: string, menuConfig: MenuItem[]): string | undefined => {
    for (const item of menuConfig) {
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
  /**
   * 处理菜单点击事件的函数。
   *
   * @param {string} key - 被点击菜单项的键。
   */
  const onClick = (key: string) => {
    const path = findPathByKey(key, menuConfig);
    if (!path) {
      console.error(`No path found for key: ${key}`);
      navigate('/'); // 跳转到默认路径
      return;
    }
    navigate(path);
  };

  return (
    <Layout style={{ height: '100vh' }}>
      {/* 侧边栏菜单 */}
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
          <h2 style={{ margin: 0 }}>系统菜单</h2>
        </div>
        <Menu
          mode="inline" // 改为垂直模式
          theme="light"
          items={menuConfig.map((item) => ({
            ...item,
            label: item.label,
          }))}
          selectedKeys={[selectedKey]}
          onClick={({ key }) => onClick(key)}
          style={{ borderRight: 0 }}
        />
      </Sider>

      {/* 右侧内容区域 */}
      <Layout
        style={{
          marginLeft: 200, // 与侧边栏宽度一致
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
          <Breadcrumb>
            {currentPath
              .split('/')
              .filter(Boolean)
              .map((segment, index, arr) => {
                const path = `/${arr.slice(0, index + 1).join('/')}`;
                const route = routes.find((r) => r.path === path);
                const label = (route as { label?: string })?.label || segment;
                console.log('jyh', path, route, label);

                // 首页特殊处理
                if (index === 0 && path === '/') {
                  return (
                    <Breadcrumb.Item key="/">
                      <Link to="/">首页</Link>
                    </Breadcrumb.Item>
                  );
                }

                // 非最后一项可点击
                if (index !== arr.length - 1) {
                  return (
                    <Breadcrumb.Item key={path}>
                      <Link to={path}>{label}</Link>
                    </Breadcrumb.Item>
                  );
                }

                // 最后一项不可点击
                return <Breadcrumb.Item key={path}>{label}</Breadcrumb.Item>;
              })}
          </Breadcrumb>
        </Header>

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
      </Layout>
    </Layout>
  );
};

// 导出 App 组件
export default App;
