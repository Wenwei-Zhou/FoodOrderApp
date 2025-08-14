import { useContext } from "react";
import Modal from "./UI/Modal.jsx";
import CartContext from "./store/CartContext.jsx";
import { currencyFormatter } from "../util/formatting.js";
import Button from "./UI/Button.jsx";
import UserProgressContext from "./store/UserProgressContext.jsx";
import CartItem from "./CartItem.jsx";
import Checkout from "./Checkout.jsx";

export default function Cart() {
  const cartCtx = useContext(CartContext);
  const userProgressCtx = useContext(UserProgressContext);

  const cartTotal = cartCtx.items.reduce(
    (totalProce, item) => totalProce + item.quantity * item.price,
    0
  );

  function handleCloseCart() {
    userProgressCtx.hideCart();
  }
  // hideCart() 只是告诉 React “不要显示 Cart 组件”。还要在Modal component里面设置modal.close()。

  function handleGoToCheckout() {
    userProgressCtx.showCheckout();
  }

  

  return (
    <Modal className="cart" open={userProgressCtx.progress === "cart"} onClose={userProgressCtx.progress === "cart" ? handleCloseCart : null}> 
    {/* 触发Modal component里面的<dialog onClose>：用户操作（按钮 或者 ESC 或者 代码调用 close()） */}
    {/* onClose 属性 是 <dialog> 元素，当onClose触发后就会执行参数{onClose}，然后就会执行这个if statement{userProgressCtx.progress === "cart" ? handleCloseCart : null}。如果userProgressCtx.progress === "cart"，就执行handleCloseCart。else is null(什么也不做) */}

      <h2>Yout Cart</h2>
      <ul>
        {cartCtx.items.map((item) => (
          <CartItem
            key={item.id}
            name={item.name}
            quantity={item.quantity}
            price={item.price}
            onIncrease={() => cartCtx.addItem(item)}
            onDecrease={() => cartCtx.removeItem(item.id)}
          />
        ))}
      </ul>
      <p className="cart-total">{currencyFormatter.format(cartTotal)}</p>
      <p className="modal-actions">
        <Button textOnly={true} onClick={handleCloseCart}>
          Close
        </Button>

        {cartCtx.items.length > 0 ? (
          <Button onClick={handleGoToCheckout}>Go to Checkout</Button>
        ) : null}
        {/* if(cartCtx.items.length > 0), and show checkout button, otherwise is null */}
      </p>
    </Modal>
  );
}

// cartCtx.items.reduce计算 example：

// cartCtx.items = [
//   { id: 1, price: 10, quantity: 2 },
//   { id: 2, price: 5, quantity: 3 },
//   { id: 3, price: 7, quantity: 1 }
// ];

// 初始值
// totalPrice = 0

// 第1次迭代（item: { price: 10, quantity: 2 }）
// totalPrice = 0 + 2 * 10 = 20

// 第2次迭代（item: { price: 5, quantity: 3 }）
// totalPrice = 20 + 3 * 5 = 35

// 第3次迭代（item: { price: 7, quantity: 1 }）
// totalPrice = 35 + 1 * 7 = 42





// <dialog onClose>
//     触发
// {onClose}
//     触发
// {userProgressCtx.progress === "cart" ? handleCloseCart : null}
//     同时检查
// 如果userProgressCtx.progress === "cart"，就执行handleCloseCart。把userProgressCtx.progress改回''。else is null（什么也不做）



// 为什么要有userProgressCtx.progress === "cart" ? handleCloseCart : null ！！！！！！！！！！！！！！！！！！

// userProgressCtx.progress从cart变成checkout后，useEffect的dependency [open] 会改变，从而重新执行useEffect，重新执行之前cleanup function会先执行一遍
// useEffect cleanup 执行 → modal.close()，onClose 触发 → handleCloseCart()，所以要有if statement，if: progress !== "cart"，就不执行（null）

// [初始状态]
// userProgressCtx.progress = "cart"
// Cart Modal open = true
// Checkout Modal open = false

//        │
//        ▼
// [点击 Go to Checkout 按钮]
// handleGoToCheckout() → setProgress("checkout")
//        │
//        ▼
// [React 渲染阶段]
// 1️⃣ Cart Modal: open 从 true → false
//    └─ useEffect cleanup 执行 → modal.close()
//       └─ onClose 触发 → handleCloseCart()?
//          ├─ 如果有 if: progress !== "cart" → 不执行
//          └─ 如果无 if: 执行 → progress = ""（覆盖 checkout）
// 2️⃣ Checkout Modal: open 从 false → true
//    └─ useEffect 执行 → modal.showModal()

//        │
//        ▼
// [最终状态]
// userProgressCtx.progress = "checkout"
// Cart Modal 卸载
// Checkout Modal 显示
