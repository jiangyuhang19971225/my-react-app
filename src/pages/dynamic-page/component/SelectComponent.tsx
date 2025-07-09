import React from 'react';
import { Select } from 'antd';
import { SelectProps } from 'antd/es/select';

const { Option } = Select;

// 🔥 【扩展 Select 属性】
interface ExtendedSelectProps extends SelectProps {
  label?: string; // 添加标签属性
  name?: string; // 添加名称属性
  options?: { value: string; label: string }[]; // 选项数组
}

const SelectComponent: React.FC<ExtendedSelectProps> = (props) => {
  const { label, name, options = [], onChange, ...restProps } = props;
  // 🔥 【标准化 onChange 处理】
  const handleChange = (value: string) => {
    console.log(`📋 SelectComponent ${name} 值变化:`, value);

    // Select 组件已经直接传递值，无需额外处理
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ display: 'block', marginBottom: 4 }}>{label}</label>}
      <Select
        {...restProps}
        onChange={handleChange}
        placeholder={restProps.placeholder || '请选择'}
        style={{ width: '100%', ...restProps.style }}
        data-name={name}
      >
        {options.map((option) => (
          <Option key={option.value} value={option.value}>
            {option.label}
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default SelectComponent;
