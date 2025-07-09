import React from 'react';
import { DatePicker } from 'antd';
import { DatePickerProps } from 'antd/es/date-picker';
import dayjs, { Dayjs } from 'dayjs';

interface ExtendedDatePickerProps extends Omit<DatePickerProps, 'onChange' | 'value'> {
  label?: string;
  name?: string;
  onChange?: (value: string | null) => void; // 🔥 对外：返回字符串
  value?: string | Dayjs | null | number; // 🔥 对外：接收字符串或 dayjs 对象
}

const DatePickerComponent: React.FC<ExtendedDatePickerProps> = (props) => {
  const { label, name, onChange, value, ...restProps } = props;

  // 🔥 【内部转换：确保 DatePicker 接收到正确的 dayjs 对象】
  const dayjsValue = React.useMemo(() => {
    console.log('dayjs.isDayjs(value)', dayjs.isDayjs(value));

    if (!value) return null;
    if (typeof value === 'string') {
      const parsed = dayjs(value);
      return parsed.isValid() ? parsed : null;
    }
    if (typeof value === 'number') {
      return dayjs(value);
    }
    if (dayjs.isDayjs(value)) {
      return value.isValid() ? value : null;
    }
    return null;
  }, [value]);

  // 🔥 【对外返回字符串格式】
  const handleChange = (date: Dayjs | null, dateString: string | string[]) => {
    const formattedDate = date ? date.format('YYYY-MM-DD') : null;
    // 这里返回时间戳怎么处理
    const timestamp = date ? date.valueOf() : null;
    console.log(`📅 DatePickerComponent ${name} 值变化:`, formattedDate);

    if (onChange) {
      onChange(timestamp); // 返回字符串格式
    }
  };

  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ display: 'block', marginBottom: 4 }}>{label}</label>}
      <DatePicker
        {...restProps}
        value={dayjsValue} // 🔥 确保传递正确的 dayjs 对象
        onChange={handleChange}
        placeholder={restProps.placeholder || '请选择日期'}
        style={{ width: '100%', ...restProps.style }}
        data-name={name}
      />
    </div>
  );
};

export default DatePickerComponent;
