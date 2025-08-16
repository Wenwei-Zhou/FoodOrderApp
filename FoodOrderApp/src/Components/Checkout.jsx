import { useContext } from "react";
import CartContext from "./store/CartContext";
import Modal from "./UI/Modal.jsx";
import { currencyFormatter } from "../util/formatting";
import Input from "./UI/Input.jsx";
import Button from "./UI/Button.jsx";
import UserProgressContext from "./store/UserProgressContext.jsx";

export default function Checkout() {
  const cartCtx = useContext(CartContext);
  const userProgressCtx = useContext(UserProgressContext);
  const cartTotal = cartCtx.items.reduce(
    (totalProce, item) => totalProce + item.quantity * item.price,
    0
  );

  function handleClose() {
    userProgressCtx.hideCheckout();
  }

  function handleSubmit(event) {
    event.preventDefault();
    // event.preventDefault()是阻止表单的默认提交行为

    const fd = new FormData(event.target);
    // 获取Input里面的所有输入值

    const customerData = Object.fromEntries(fd.entries());
    // Object.fromEntries 转成普通对象，注意：每个 input 必须有 name 或者id 属性，否则不会包含在 customerData 中
    // 转成对象 example：{ "street": "street 5" }

    console.log(customerData)

    fetch("http://localhost:3000/orders", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'      // 告诉后端是以JSON格式提交一些数据
      },
      body: JSON.stringify({                    // bodys是请求主体，也就是要发送的数据。是以json形式发过去
        order: {
          items: cartCtx.items,
          customer: customerData
        }
      })
    });
  }

  return (
    <Modal open={userProgressCtx.progress === "checkout"} onClose={handleClose}>
      <form onSubmit={handleSubmit}>
        <h2>Checkout</h2>
        <p>Total Amount: {currencyFormatter.format(cartTotal)}</p>
        {/* <Input id=/> id是传到后端时的数据名字。example："name": "ww" */}
        <Input label="Full Name" type="text" id="name" />
        <Input label="E-Mail Address" type="email" id="email" />
        <Input label="Street" type="text" id="street" />
        <div className="control-row">
          <Input label="Postal Code" type="text" id="postal-code" />
          <Input label="City" type="text" id="city" />
        </div>

        <p className="modal-actions">
          <Button type="button" textOnly onClick={handleClose}>
            Close
          </Button>
          <Button>Submit Order</Button>
        </p>
      </form>
    </Modal>
  );
}


// type="button"：防止它成为表单的默认提交按钮
// <Button>Submit Order</Button> 没有指定 type，在 <form> 里，默认就是 type="submit"，或者也可以指定type，<Button type="submit">Submit Order</Button>