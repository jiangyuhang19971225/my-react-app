export interface FormComponent {
  id: string;
  type: string; // 组件类型，例如 'input', 'select', 'checkbox' 等
  props: Record<string, any>; // 组件的属性，例如 placeholder, options 等
  children?: FormComponent[]; // 如果是容器组件，可以包含子组件
}
// 定义表单构建器的状态类型
export interface FormBuilderState {
  components: FormComponent[]; // 存储表单组件的数组
}
