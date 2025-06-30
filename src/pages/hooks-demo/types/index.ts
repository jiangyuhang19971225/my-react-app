// ================================
// 共享类型定义
// ================================

// Theme Context 类型
export interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

// 购物车相关类型
export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  total: number;
}
// Omit排除属性
export type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' };

// 自定义输入组件ref类型
export interface CustomInputRef {
  focus: () => void;
  clear: () => void;
  getValue: () => string;
  setValue: (value: string) => void;
}

// 用户数据类型
export interface User {
  id: number;
  name: string;
  email: string;
  company: { name: string };
}

// 列表项组件Props类型
export interface ItemComponentProps {
  item: string;
  onClick: (item: string) => void;
}
