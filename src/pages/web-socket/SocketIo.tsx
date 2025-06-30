import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

interface Message {
  user: string;
  text: string;
}

const SocketApp: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [user] = useState<string>(`User-${Math.floor(Math.random() * 1000)}`);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io('http://localhost:3001');

    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('receive_message', (data: Message) => {
      console.log('receive_message', data);
      setMessages((prev) => [...prev, data]);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;

    const msg: Message = { user, text: message };

    socketRef.current?.emit('send_message', msg);
    // setMessages((prev) => [...prev, msg]);

    setMessage('');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Socket.IO 聊天室 - {user}</h2>
      <ul style={{ maxHeight: '300px', overflowY: 'auto', listStyle: 'none', paddingLeft: 0 }}>
        {messages.map((msg, idx) => (
          <li key={idx}>
            <strong>{msg.user}:</strong> {msg.text}
          </li>
        ))}
      </ul>
      <div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="输入消息..."
        />
        <button onClick={sendMessage}>发送</button>
      </div>
    </div>
  );
};

export default SocketApp;
