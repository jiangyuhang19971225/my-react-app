import React from 'react';
import { Form, Input, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const onFinish = async (values: any) => {
    console.log('Received values:', values);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token); // 假设返回包含token
        navigate('/');
        // 这里可以添加跳转逻辑，例如：navigate('/');
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div>
      <h1>Login Page</h1>
      <Form onFinish={onFinish}>
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please enter your username!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please enter your password!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;
