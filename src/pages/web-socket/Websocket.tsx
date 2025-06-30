import React, { useState, useEffect, useRef } from 'react';
import { Card, Input, Button } from 'antd';
import SocketIo from './SocketIo.tsx';

// 定义 WebSocket 消息的接口
interface WebSocketMessage {
  type: string;
  payload: unknown; // 使用 `unknown` 表示不确定的类型
}

const WebSocketClient: React.FC = () => {
  // 存储接收到的消息
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  // 存储用户输入的消息类型
  const [messageType, setMessageType] = useState('');
  // 存储用户输入的消息内容
  const [messagePayload, setMessagePayload] = useState('');
  // 使用 useRef 存储 WebSocket 实例
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // 创建 WebSocket 连接
    const socket = new WebSocket('ws://localhost:8080');
    socketRef.current = socket;

    // 当接收到消息时触发
    socket.onmessage = async (event: MessageEvent) => {
      let dataText: string;
      try {
        if (event.data instanceof Blob) {
          // Convert Blob to text
          dataText = await event.data.text();
        } else {
          dataText = event.data.toString();
        }
        // Parse the received message
        const data: WebSocketMessage = JSON.parse(dataText);
        // Update the message list
        setMessages((prevMessages) => [...prevMessages, data]);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    // 当连接出错时触发
    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // 当连接关闭时触发
    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    // 组件卸载时关闭 WebSocket 连接
    return () => {
      socket.close();
    };
  }, []);

  // 处理消息发送的函数
  const handleSendMessage = () => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      try {
        // 构建要发送的消息对象
        const message: WebSocketMessage = {
          type: messageType,
          payload: JSON.parse(messagePayload),
        };
        // 发送消息
        socketRef.current.send(JSON.stringify(message));
        // 清空输入框
        setMessageType('');
        setMessagePayload('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  return (
    <>
      <div>
        <Card title={'WebSocket'}>
          <div>
            <h1>WebSocket Messages</h1>
            <ul>
              {/* 遍历消息列表并展示 */}
              {messages.map((message, index) => (
                <li key={index}>
                  Type: {message.type}, Payload: {JSON.stringify(message.payload)}
                </li>
              ))}
            </ul>
            {/* 输入消息类型 */}
            <Input
              placeholder="Message Type"
              value={messageType}
              onChange={(e) => setMessageType(e.target.value)}
              style={{ marginBottom: 10 }}
            />
            {/* 输入消息内容 */}
            <Input
              placeholder="Message Payload (JSON format)"
              value={messagePayload}
              onChange={(e) => setMessagePayload(e.target.value)}
              style={{ marginBottom: 10 }}
            />
            {/* 发送消息按钮 */}
            <Button onClick={handleSendMessage}>Send Message</Button>
          </div>
        </Card>
        <Card title={'socketIo'} style={{ marginTop: 10 }}>
          <SocketIo />
        </Card>
      </div>
    </>
  );
};

export default WebSocketClient;
