import React from 'react';
import { Input } from 'antd';
import { InputProps } from 'antd/es/input';

interface ExtendedInputProps extends Omit<InputProps, 'onChange'> {
  label?: string;
  name?: string;
  onChange?: (value: string) => void;
}

const InputComponent: React.FC<ExtendedInputProps> = (props) => {
  const { label, name, onChange, ...restProps } = props;

  // 🔥 【标准化 onChange 处理】
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log(`📝 InputComponent ${name} 值变化:`, value);

    // 调用父组件的 onChange，传递处理后的值而不是事件对象
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ display: 'block', marginBottom: 4 }}>{label}</label>}
      <Input
        {...restProps}
        onChange={handleChange} // 使用我们的处理函数
        placeholder={restProps.placeholder || '请输入'}
        style={{ width: '100%', ...restProps.style }}
        data-name={name}
        // 🔥 关键：支持受控模式
        // value 和 onChange 会通过 restProps 传递
      />
    </div>
  );
};

export default InputComponent;
