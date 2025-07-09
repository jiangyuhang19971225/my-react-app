// 🔥 【I18N 配置】- 国际化配置中心
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// 导入翻译文件
import zhTranslations from './locales/zh.json';
import enTranslations from './locales/en.json';

// 🎯 i18n配置
i18n
  .use(initReactI18next) // 集成React
  .init({
    // 🔥 【翻译资源】
    resources: {
      zh: {
        translation: zhTranslations,
      },
      en: {
        translation: enTranslations,
      },
    },

    // 🔥 【默认语言】
    lng: 'zh', // 默认中文
    fallbackLng: 'zh', // 回退语言

    // 🔥 【调试模式】
    debug: import.meta.env.DEV,

    // 🔥 【插值配置】
    interpolation: {
      escapeValue: false, // React已经默认转义
    },

    // 🔥 【键值分隔符】
    keySeparator: '.',
    nsSeparator: false,
  });

export default i18n;
