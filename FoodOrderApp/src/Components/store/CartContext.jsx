import { createContext, useReducer } from "react";

const CartContext = createContext({
  items: [],
  addItem: (item) => {},
  removeItem: (id) => {},
  clearCart: () => {},
});

function cartReducer(state, action) {
  if (action.type === "ADD_ITEM") {
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.item.id
    );
    // items等于初始状态{ items: [] }
    // action.item等于dispatchCartAction里面的item
    // example: action = {type: 'ADD_ITEM', item: { id: 101, name: 'Laptop', price: 999 }, action.item.id  (这里id就是 101)

    const updatedItems = [...state.items];
    // 拷贝数组

    if (existingCartItemIndex > -1) {
      // 商品已存在 → 数量 +1
      const existingItem = state.items[existingCartItemIndex];
      const updatedItem = {
        ...existingItem,
        quantity: existingItem.quantity + 1,
      };
      updatedItems[existingCartItemIndex] = updatedItem;
    } else {
      // 商品不存在 → 添加新商品，数量为 1。quantity是value name，1是value
      updatedItems.push({ ...action.item, quantity: 1 });
    }

    return { ...state, items: updatedItems };
    // ...state → 保留原来的其他属性，如果有其它属性value的话
    // items: updatedItems → 替换成新数组引用
  }

  if (action.type === "REMOVE_ITEM") {
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.id
    );
    // action.id等于dispatchCartAction里面的id

    const existingCartItem = state.items[existingCartItemIndex];

    const updatedItems = [...state.items];

    if (existingCartItem.quantity === 1) {
      // 数量为 1 → 直接删除商品
      updatedItems.splice(existingCartItemIndex, 1);
      //   array.splice(start, deleteCount, item1, item2, ...)，第一个参数是开始的index，第二个参数是count要删掉的item
    } else {
      // 数量大于 1 → 数量 -1
      const updatedItem = {
        ...existingCartItem,
        quantity: existingCartItem.quantity - 1,
      };
      updatedItems[existingCartItemIndex] = updatedItem;
    }

    return { ...state, item: updatedItems };
  }

  if (action.type === "CLEAR-CART") {
    return {...state, items: []};
    // 复制了旧的状态
    // items: [] → 将items设为[]，意思是清空购物车
  }

  return state;
}

export function CartContextProvider({ children }) {
  const [cart, dispatchCartAction] = useReducer(cartReducer, { items: [] });

  function addItem(item) {
    dispatchCartAction({ type: "ADD_ITEM", item: item });
  }
  // type: action.type    item: item(属性名: 变量值)：需要携带的数据(传进来的那个商品对象), 比如要增加的商品或减掉的商品
  function removeItem(id) {
    dispatchCartAction({ type: "REMOVE_ITEM", id: id });
  }

  function clearCart() {
    dispatchCartAction({ type: "CLEAR-CART"});
  }

  // cartReducer：一个函数，接受 (state, action)，返回新的 state。
  // state：当前状态。
  // { items: [] }: initialState初始状态。
  // cart：当前状态。
  // dispatchCartAction：用来发送 action，触发状态更新。

  const cartContext = {
    items: cart.items,
    addItem,
    removeItem,
    clearCart,
  };

  // console.log(cartContext);

  return (
    <CartContext.Provider value={cartContext}>{children}</CartContext.Provider>
  );
}

export default CartContext;

// 工作原理：
//    ┌─────────────────────┐
//    │ 组件调用 addItem()  │
//    └─────────┬───────────┘
//              │
//              ▼
//    ┌──────────────────────────┐
//    │ dispatchCartAction(...)   │
//    │ { type: "ADD_ITEM", item }│
//    └─────────┬────────────────┘
//              │
//              ▼
//    ┌──────────────────────────┐
//    │  cartReducer(state,action)│
//    ├──────────────────────────┤
//    │ 检查 action.type          │
//    │  ├─ "ADD_ITEM" → 添加数量│
//    │  ├─ "REMOVE_ITEM" → 减数量│
//    │  └─ 其他 → 返回原 state  │
//    └─────────┬────────────────┘
//              │
//              ▼
//    ┌──────────────────────────┐
//    │ 返回新的 state（items）  │
//    └─────────┬────────────────┘
//              │
//              ▼
//    ┌──────────────────────────┐
//    │ useReducer 更新 cart      │
//    └─────────┬────────────────┘
//              │
//              ▼
//    ┌──────────────────────────┐
//    │ CartContext.Provider      │
//    │ value={items, addItem...} │
//    └─────────┬────────────────┘
//              │
//              ▼
//    ┌──────────────────────────┐
//    │ 任何 useContext(CartContext)│
//    │ 的组件都会重新渲染           │
//    └──────────────────────────┘

// useReducer 工作流程图
//       ┌────────────────────┐
//       │   初始状态 (cart)   │
//       │ { items: [] }       │
//       └────────┬───────────┘
//                │
//                ▼
//      ┌─────────────────────┐
//      │ dispatch(action)    │
//      │ 例:                 │
//      │ { type: "ADD_ITEM", │
//      │   item: {...} }     │
//      └────────┬───────────┘
//               │  action 传给
//               ▼
//       ┌────────────────────┐
//       │   cartReducer      │
//       │ (state, action)    │
//       └────────┬───────────┘
//                │
//   ┌────────────┴─────────────────┐
//   │ 根据 action.type 判断         │
//   │                               │
//   │ ADD_ITEM:                     │
//   │   1. 找到 item 是否已存在     │
//   │   2. 更新 updatedItems 数组   │
//   │   3. 返回新 state:            │
//   │      { ...state,              │
//   │        items: updatedItems }  │
//   │                               │
//   │ REMOVE_ITEM:                  │
//   │   同理处理...                 │
//   └────────────┬─────────────────┘
//                │
//                ▼
//       ┌────────────────────┐
//       │ useReducer 更新     │
//       │ cart = 新的 state   │
//       └────────┬───────────┘
//                │
//                ▼
//    ┌─────────────────────────┐
//    │ UI 重新渲染，使用        │
//    │ cart.items 展示购物车   │
//    └─────────────────────────┘


// Meal component用map()展示每个商品的Component，MealItem({meal}) component是在Meal的map()里面执行的。
// 购物车items一开始（初始化）是空的MealItem，在MealItem component里有一个执行addItem()的button。
// 执行addItem()会触发dispatchCartAction({ type: "ADD_ITEM", item: meal })，
// 这会调用cartReducer(state, action)，根据action.type来判断是添加还是删除商品。
// 如果添加商品：
// state.items.findIndex((item) => item.id === action.item.id);意思是在state.items数组中查找是否有与action.item.id相同的商品id。
// 如果找到，说明商品已存在，更新数量existingItem.quantity + 1。如果没有找到，说明是新商品，用push()添加到updatedItems数组中，设置数量为1（quantity: 1）。

// 删除商品也是同样的逻辑！