import Cart from "./Components/Cart.jsx";
import Header from "./Components/Header.jsx";
import Meals from "./Components/Meals.jsx";
import { CartContextProvider } from "./Components/store/CartContext.jsx";
import { UserProgressContextProvider } from "./Components/store/UserProgressContext.jsx";

function App() {
  return (
    <>
      <UserProgressContextProvider>
        <CartContextProvider>
          <Header />
          <Meals />
          <Cart />
        </CartContextProvider>
      </UserProgressContextProvider>
    </>
  );
}

export default App;


// <UserProgressContextProvider><CartContextProvider>为什么要放在 App.jsx
// React Context 的状态只能被 Provider 包裹的组件树 使用。

// 如果你把 Provider 放在某个子组件里，只有它的子组件可以用 useContext 访问，而 App 其它部分就访问不到。

// 购物车、结账页、Header 按钮这些组件都可能需要 UserProgressContext，所以 Provider 必须放在它们的公共祖先位置。