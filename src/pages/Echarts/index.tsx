import { Row, Col } from 'antd';
// ... existing code ...
import React, { useEffect, useRef, useMemo } from 'react';
import * as echarts from 'echarts';

const Echarts: React.FC = () => {
  const headerCard = useMemo(
    () => [
      { title: 'Echarts-Header0', content: 'Echarts-Header' },
      { title: 'Echarts-Header1', content: 'Echarts-Header' },
    ],
    [],
  );
  const RenderHeader = useMemo(
    () => () => (
      <div>
        <h1>Echarts-Header</h1>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          {headerCard.map((item, index) => (
            <Col key={index} className="gutter-row" span={6}>
              <div>{item.title}</div>
              <div>{item.content}</div>
            </Col>
          ))}
        </Row>
      </div>
    ),
    [headerCard],
  );
  const RenderContent = () => {
    const chartRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!chartRef.current) return;

      const chart = echarts.init(chartRef.current);

      const option = {
        title: {
          text: '示例折线图',
        },
        tooltip: {
          trigger: 'axis',
        },
        xAxis: {
          type: 'category',
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            name: '访问量',
            type: 'line',
            data: [150, 230, 224, 218, 135, 147, 260],
            smooth: true,
          },
        ],
      };

      chart.setOption(option);

      const handleResize = () => chart.resize();
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        chart.dispose();
      };
    }, []);

    return (
      <div>
        <h1>Echarts-content</h1>
        <div
          ref={chartRef}
          style={{
            width: '100%',
            height: '400px',
            marginTop: '20px',
          }}
        />
      </div>
    );
  };
  // ... existing code ...

  return (
    <div>
      {RenderHeader()}
      {RenderContent()}
    </div>
  );
};

export default Echarts;
