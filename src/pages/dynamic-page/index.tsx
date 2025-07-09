/**
 * 动态组件测试
 */

import React, { useState, useEffect, lazy, Suspense, useMemo } from 'react';
import dayjs from 'dayjs';
// 定义数据项的类型
type DataItem = {
  id: string;
  type: string;
  label: string;
  name: string;
  defaultValue?: dayjs.Dayjs | string;
  options?: { value: string; label: string }[];
};

// 定义组件的 props 类型
type ComponentProps = {
  label: string;
  name: string;
  onChange?: (value: string) => void; // 🔥 统一的 onChange 类型
  defaultValue?: dayjs.Dayjs | string | number;
  options?: { value: string; label: string }[];
};

const DynamicPage: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const fetchData = async (): Promise<DataItem[]> => {
    const data: DataItem[] = [
      {
        id: '1',
        type: 'Input',
        label: '用户名',
        name: 'username',
        defaultValue: 'user',
      },
      {
        id: '2',
        type: 'Select',
        label: '性别',
        name: 'gender',
        options: [
          { value: 'male', label: '男' },
          { value: 'female', label: '女' },
        ],
        defaultValue: 'male',
      },
      {
        id: '3',
        type: 'DatePicker',
        label: '出生日期',
        name: 'birthday',
        defaultValue: '2000-01-01',
      },
    ];
    // 模拟异步加载数据
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(data);
      }, 1000);
    });
  };

  useEffect(() => {
    // 模拟异步加载数据
    const fetchDataAsync = async () => {
      const fetchedData = await fetchData();
      const processedData = fetchedData.map((item) => {
        if (item.type === 'DatePicker' && item.defaultValue) {
          return {
            ...item,
            defaultValue: dayjs(item.defaultValue), // 转换为Day.js对象
          };
        }
        return item;
      });
      setData(processedData);
      // 🔥 【初始化表单值】
      const initialValues = processedData.reduce(
        (acc, item) => {
          acc[item.name] = item.defaultValue;
          return acc;
        },
        {} as Record<string, any>,
      );

      setFormValues(initialValues);
    };
    fetchDataAsync();
  }, []);

  // 使用 useMemo 缓存 componentMap，确保只创建一次
  const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
  const componentMap = useMemo(
    () => ({
      Input: lazy(() =>
        // 🔥 【最简洁的写法】：直接返回延迟的 import 链
        new Promise<void>((resolve) => setTimeout(resolve, 2000)).then(
          () => import('./component/InputComponent'),
        ),
      ),
      // Input: lazy(() =>
      //   new Promise(resolve =>
      //     setTimeout(() => {
      //       import('./component/InputComponent').then(resolve);
      //     }, 2000)
      //   ) as Promise<{ default: React.ComponentType<any> }>
      // ),
      Select: lazy(async () => {
        await delay(1000);
        return import('./component/SelectComponent');
      }),
      DatePicker: lazy(() => import('./component/DatePickerComponent')),
    }),
    [],
  );
  // 🔥 【受控模式核心：统一的值更新处理】
  const handleValueChange = (name: string, value: any) => {
    console.log(`🔥 ${name} 值变化:`, value);

    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const renderComponent = (componentType: string, props: ComponentProps) => {
    const Component = componentMap[componentType];
    if (!Component) {
      throw new Error(`Unknown component type: ${componentType}`);
    }
    const controlledProps = {
      ...props,
      value: formValues[props.name],
      onChange: (value: string) => {
        handleValueChange(props.name, value);
      },
    };
    return <Component {...controlledProps} />;
  };

  // 🔥 【实时监听表单值变化】
  useEffect(() => {
    console.log('📊 表单值实时更新:', formValues);
  }, [formValues]);

  return (
    <div>
      <h1>Dynamic Page</h1>
      <p>This is a dynamically rendered page.</p>
      <div>{JSON.stringify(data)}</div>

      {data.length > 0 &&
        data.map((ele) => {
          return (
            <div key={ele.id} style={{ marginBottom: 16 }}>
              <Suspense fallback={<div>组件Loading...11111</div>}>
                {renderComponent(ele.type, {
                  label: ele.label,
                  name: ele.name,
                  defaultValue: ele.defaultValue,
                  options: ele.options,
                })}
              </Suspense>
            </div>
          );
        })}
      <div>
        <h3>动态加载组件使用ant组件，使用Suspense和lazy</h3>
      </div>
    </div>
  );
};

export default DynamicPage;
