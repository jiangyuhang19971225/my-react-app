import React, { Component } from 'react';

class MyComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
    };
  }

  static getDerivedStateFromProps(props, state) {
    // 根据新的 props 更新 state
    return null;
  }

  componentDidMount() {
    // 组件挂载后执行
    console.log('Component did mount');
  }

  shouldComponentUpdate(nextProps, nextState) {
    // 决定组件是否需要重新渲染
    return true;
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    // 获取 DOM 更新前的信息
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // 组件更新后执行
    console.log('Component did update');
  }

  componentWillUnmount() {
    // 组件卸载前执行
    console.log('Component will unmount');
  }

  render() {
    return (
      <div>
        <p>Count: {this.state.count}</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Increment
        </button>
        <div></div>
      </div>
    );
  }
}

export default MyComponent;
