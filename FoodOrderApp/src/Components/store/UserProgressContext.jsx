import { createContext, useState } from "react";

const UserProgressContext = createContext({
  progress: "",
  showCart: () => {},
  hideCart: () => {},
  showCheckout: () => {},
});

export function UserProgressContextProvider({ children }) {
  const [userProgress, setUserProgress] = useState("");

  function showCart() {
    setUserProgress("cart");
  }

  function hideCart() {
    setUserProgress("");
  }

  function showCheckout() {
    setUserProgress("checkout");
  }

  function hideCheckout() {
    setUserProgress("");
  }

  const userProgressCtx = {
    progress: userProgress,
    showCart,
    hideCart,
    showCheckout,
    hideCheckout,
  };

  return (
    <UserProgressContext.Provider value={userProgressCtx}>
      {children}
    </UserProgressContext.Provider>
  );
}

export default UserProgressContext;

// 工作原理：
// createContext：创建一个 Context 对象，用来在组件树里共享数据，而不用一层层传 props。
// value={userProgressCtx}：把UserProgressContextProvider()所有value, function都传给UserProgressContext.Provider
// UserProgressContext.Provider 会把 progress 和操作方法传递给所有子组件。这样，任何子组件都能通过 useContext(UserProgressContext) 拿到这些值。

// 最后UserProgressContext可以在其它component里面执行
// UserProgressContextProvider 放在 App.jsx 或者根组件附近，这样它管理的状态可以全局共享给整个应用的所有子组件。


// 对其它component的影响：
// +------------------------------------------+
// | UserProgressContextProvider              |
// |------------------------------------------|
// | State: progress = ""                     |
// | Methods: showCart(), hideCart()          |
// | Provide: { progress, showCart, hideCart }|
// +------------------------------------------+
//                     │
//         Context value 向下传给子组件
//                     │
//    ┌────────────────┴─────────────────┐
//    │                                    │
// [HeaderCartButton]               [CartModal]
//    │                                    │
//    │ onClick → showCart()               │
//    │    │                               │
//    │    ▼                               │
//    │ setProgress("cart")                │
//    │    │                               │
//    └────┴──────────────┐                │
//                        │                │
//              progress 更新为 "cart"      │
//                        │                │
//          所有 useContext 的组件重新渲染    │
//                        │                │
//                        ▼                ▼
//                [HeaderCartButton]   [CartModal]
//                (无直接变化)         检查 progress
//                                    progress === "cart" ?
//                                           │
//                                          是
//                                           │
//                                           ▼
//                                      显示购物车
