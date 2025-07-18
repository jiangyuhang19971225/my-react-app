/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import PreviewCanvas from './components/PreviewCanvas';

interface ComponentItem {
  id: string;
  type: string;
  x: number;
  y: number;
  props: Record<string, any>;
}

const PreviewPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [components, setComponents] = useState<ComponentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 从URL参数中获取组件数据
    const dataParam = searchParams.get('data');
    if (dataParam) {
      try {
        const decodedData = JSON.parse(decodeURIComponent(dataParam));
        setComponents(decodedData);
      } catch (error) {
        console.error('解析组件数据失败:', error);
      }
    }

    // 从localStorage中获取组件数据（备用方案）
    const savedData = localStorage.getItem('draggable-components');
    if (savedData && !dataParam) {
      try {
        const parsedData = JSON.parse(savedData);
        setComponents(parsedData);
      } catch (error) {
        console.error('解析本地存储数据失败:', error);
      }
    }

    setLoading(false);
  }, [searchParams]);

  const handleClose = () => {
    navigate('/draggable');
  };

  if (loading) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f0f0f0',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', marginBottom: '16px' }}>⏳</div>
          <div>加载预览中...</div>
        </div>
      </div>
    );
  }

  return <PreviewCanvas components={components} isFullscreen={true} onClose={handleClose} />;
};

export default PreviewPage;
