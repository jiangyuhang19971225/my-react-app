declare global {
  interface Window {
    microApp: {
      getData: () => Record<string, any>;
      dispatch: (action: { type: string; payload?: any }) => void;
      router: any;
      // 若有其他方法，可继续添加
    };
  }
}

export {};
