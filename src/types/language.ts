// 🔥 【类型定义】- 定义语言相关的TypeScript类型
export type Language = 'zh' | 'en';

export interface LanguageState {
  currentLanguage: Language;
}

export interface MenuItem {
  key: string;
  label: string;
  path?: string;
  children?: MenuItem[];
}
