import { useContext } from "react";
import Modal from "./UI/Modal";
import CartContext from "./store/CartContext.jsx";
import { currencyFormatter } from "../util/formatting.js";
import Button from "./UI/Button.jsx";
import UserProgressContext from "./store/UserProgressContext.jsx";
import CartItem from "./CartItem.jsx";

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

  return (
    <Modal className="cart" open={userProgressCtx.progress === "cart"}>
      <h2>Yout Cart</h2>
      <ul>
        {cartCtx.items.map((item) => (
          //   <li key={item.id}>
          //     {item.name} - {item.quantity}
          //   </li>
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
        <Button onClick={handleCloseCart}>Go to Checkout</Button>
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
