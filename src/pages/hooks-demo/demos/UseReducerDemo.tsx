import React, { useReducer } from 'react';
import { CartState, CartAction } from '../types';
import styles from '../index.module.css';

// ================================
// Reducer 函数 - 状态更新的核心逻辑
// ================================
/**
 * 购物车 Reducer 函数
 * @param state 当前状态 (购物车状态)
 * @param action 要执行的动作 (包含类型和数据)
 * @returns 新的状态
 *
 * 🔥 核心原则：纯函数，不修改原状态，返回新状态
 */
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    // ================================
    // 添加商品到购物车
    // ================================
    case 'ADD_ITEM': {
      // 检查商品是否已存在于购物车中
      const existingItem = state.items.find((item) => item.id === action.payload.id);

      if (existingItem) {
        // 👆 商品已存在：数量 +1
        const updatedItems = state.items.map(
          (item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 } // 增加数量
              : item, // 其他商品保持不变
        );
        return {
          items: updatedItems,
          // 重新计算总价
          total: updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
        };
      } else {
        // 👆 商品不存在：添加新商品，初始数量为1
        const newItems = [...state.items, { ...action.payload, quantity: 1 }];
        return {
          items: newItems,
          // 重新计算总价
          total: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
        };
      }
    }

    // ================================
    // 从购物车移除商品
    // ================================
    case 'REMOVE_ITEM': {
      // 过滤掉指定ID的商品
      const filteredItems = state.items.filter((item) => item.id !== action.payload);
      return {
        items: filteredItems,
        // 重新计算总价
        total: filteredItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
      };
    }

    // ================================
    // 更新商品数量
    // ================================
    case 'UPDATE_QUANTITY': {
      // 更新指定商品的数量
      const updatedItems = state.items.map(
        (item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity } // 更新数量
            : item, // 其他商品保持不变
      );
      return {
        items: updatedItems,
        // 重新计算总价
        total: updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
      };
    }

    // ================================
    // 清空购物车
    // ================================
    case 'CLEAR_CART':
      return { items: [], total: 0 }; // 重置为初始状态

    // ================================
    // 默认情况：返回当前状态
    // ================================
    default:
      return state;
  }
};

// ================================
// 主组件 - useReducer 的使用示例
// ================================
export const UseReducerDemo: React.FC = () => {
  // 🎯 useReducer Hook 的使用
  // cartState: 当前状态 (购物车数据)
  // dispatch: 派发动作的函数
  // cartReducer: 状态更新逻辑
  // { items: [], total: 0 }: 初始状态
  const [cartState, dispatch] = useReducer(cartReducer, { items: [], total: 0 });

  // 模拟商品数据
  const sampleProducts = [
    { id: 1, name: 'iPhone', price: 999 },
    { id: 2, name: 'MacBook', price: 1999 },
    { id: 3, name: 'iPad', price: 599 },
  ];

  return (
    <section className={styles.section}>
      <h2>5. useReducer - 复杂状态管理</h2>
      <div className={styles.cart}>
        <h3>购物车示例:</h3>

        {/* ================================ */}
        {/* 商品列表区域 */}
        {/* ================================ */}
        <div className={styles.products}>
          <h4>商品:</h4>
          {sampleProducts.map((product) => (
            <div key={product.id} className={styles.product}>
              <span>
                {product.name} - ¥{product.price}
              </span>
              {/* 🛒 添加到购物车按钮 */}
              <button
                onClick={() =>
                  // 派发 ADD_ITEM 动作
                  dispatch({
                    type: 'ADD_ITEM',
                    payload: product, // 传递商品数据
                  })
                }
                className={styles.button}
              >
                添加到购物车
              </button>
            </div>
          ))}
        </div>

        {/* ================================ */}
        {/* 购物车内容区域 */}
        {/* ================================ */}
        <div className={styles.cartItems}>
          <h4>购物车 (总计: ¥{cartState.total}):</h4>

          {/* 购物车为空的情况 */}
          {cartState.items.length === 0 ? (
            <p>购物车为空</p>
          ) : (
            <>
              {/* 购物车商品列表 */}
              {cartState.items.map((item) => (
                <div key={item.id} className={styles.cartItem}>
                  <span>
                    {item.name} x {item.quantity} = ¥{item.price * item.quantity}
                  </span>

                  {/* 商品操作按钮组 */}
                  <div>
                    {/* ➖ 减少数量按钮 */}
                    <button
                      onClick={() =>
                        dispatch({
                          type: 'UPDATE_QUANTITY',
                          payload: {
                            id: item.id,
                            quantity: Math.max(1, item.quantity - 1), // 最小数量为1
                          },
                        })
                      }
                      className={styles.smallButton}
                    >
                      -
                    </button>

                    {/* ➕ 增加数量按钮 */}
                    <button
                      onClick={() =>
                        dispatch({
                          type: 'UPDATE_QUANTITY',
                          payload: {
                            id: item.id,
                            quantity: item.quantity + 1,
                          },
                        })
                      }
                      className={styles.smallButton}
                    >
                      +
                    </button>

                    {/* 🗑️ 删除商品按钮 */}
                    <button
                      onClick={() =>
                        dispatch({
                          type: 'REMOVE_ITEM',
                          payload: item.id, // 只需要传递商品ID
                        })
                      }
                      className={styles.dangerButton}
                    >
                      删除
                    </button>
                  </div>
                </div>
              ))}

              {/* 🧹 清空购物车按钮 */}
              <button
                onClick={() => dispatch({ type: 'CLEAR_CART' })}
                className={styles.dangerButton}
              >
                清空购物车
              </button>
            </>
          )}
        </div>
      </div>

      {/* ================================ */}
      {/* 使用说明 */}
      {/* ================================ */}
      <div className={styles.tip}>
        <h4>💡 useReducer 的优势:</h4>
        <ul>
          <li>
            <strong>集中管理</strong>: 所有状态更新逻辑都在 reducer 中
          </li>
          <li>
            <strong>可预测</strong>: 纯函数，相同输入产生相同输出
          </li>
          <li>
            <strong>易测试</strong>: reducer 是独立的纯函数
          </li>
          <li>
            <strong>复杂状态</strong>: 适合管理多个相关的状态值
          </li>
          <li>
            <strong>动作追踪</strong>: 每个状态变化都有明确的动作类型
          </li>
        </ul>
      </div>
    </section>
  );
};
