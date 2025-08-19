import { useContext } from "react";
import CartContext from "./store/CartContext";
import Modal from "./UI/Modal.jsx";
import { currencyFormatter } from "../util/formatting";
import Input from "./UI/Input.jsx";
import Button from "./UI/Button.jsx";
import UserProgressContext from "./store/UserProgressContext.jsx";
import useHttp from "./hooks/useHttp.js";

const requestConfig = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    // 告诉后端是以JSON格式提交一些数据
  },
};
// 这个requestConfig是用来发送POST请求的配置。因为Checkout component就是用于把新的order POST到数据库里面，这个requestConfig运行后定义了一次就不需要改变了，所以放在外面。

export default function Checkout() {
  const cartCtx = useContext(CartContext);
  const userProgressCtx = useContext(UserProgressContext);

  const {
    success: success,
    data,
    isLoading: isSending,
    error,
    sendRequest,
    clearData,
  } = useHttp("https://foodorderapp-14xl.onrender.com/orders", requestConfig);

  const cartTotal = cartCtx.items.reduce(
    (totalProce, item) => totalProce + item.quantity * item.price,
    0
  );

  function handleClose() {
    userProgressCtx.hideCheckout();
  }

  function handleFinish() {
    userProgressCtx.hideCheckout();
    cartCtx.clearCart();
    setTimeout(() => clearData(), 3000);
    // clearData();
  }

  function handleSubmit(event) {
    event.preventDefault();
    // event.preventDefault()是阻止表单的默认提交行为

    const fd = new FormData(event.target);
    // 获取Input里面的所有输入值

    const customerData = Object.fromEntries(fd.entries());
    // Object.fromEntries 转成普通对象，注意：每个 input 必须有 name 或者id 属性，否则不会包含在 customerData 中
    // 转成对象 example：{ "street": "street 5" }

    // console.log(customerData);

    sendRequest(
      JSON.stringify({
        order: {
          items: cartCtx.items,
          customer: customerData,
        },
      })
    );

    // 这个一开始的方法，但创建了useHttp.js之后，这个部分就放在了useHttp.js里面了。
    // fetch("http://localhost:3000/orders", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json", // 告诉后端是以JSON格式提交一些数据
    //   },
    //   body: JSON.stringify({
    //     // bodys是请求主体，也就是要发送的数据。是以json形式发过去
    //     order: {
    //       items: cartCtx.items,
    //       customer: customerData,
    //     },
    //   }),
    // });
  }

  let actions = (
    <>
      <Button type="button" textOnly onClick={handleClose}>
        Close
      </Button>
      <Button>Submit Order</Button>
    </>
  );

  if (isSending) {
    return (actions = <span>Sending order data...</span>);
  }

//   console.log("return data!!!!!!", data);
//   console.log("success", success);
    // if (data && !error) {
    //   return (
    //     <Modal
    //       open={userProgressCtx.progress === "checkout"}
    //       onClose={handleFinish}
    //     >
    //       <h2>Success!</h2>
    //       <p>Order submitted successfully</p>
    //       <p className="modal-actions">
    //         <Button onClick={handleFinish}>OK</Button>
    //       </p>
    //     </Modal>
    //   );
    // }
  // 这是网课里面的写法，但不工作。因为当执行Modal时，onClose会触发handleFinish，清空cartCtx.items，导致data变成空数组，所以success变成false。
  // 所以Modal不工作

  if (success && !error) {
    return (
      <Modal open={true} onClose={handleFinish}>
        <h2>Success!</h2>
        <p>Order submitted successfully</p>
      </Modal>
    );
  }
  // 这是自己的写法，不要button了，因为onClose已经触发了handleFinish，所以不需要button了。handlefinish的clearDate()会在3秒后执行，清空data和success变成false，然后Modal会停止工作（不再显示）。

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
        {error && <Error title="Failed to submit order" message={error} />}
        <p className="modal-actions">{actions}</p>
      </form>
    </Modal>
  );
}

// type="button"：防止它成为表单的默认提交按钮
// <Button>Submit Order</Button> 没有指定 type，在 <form> 里，默认就是 type="submit"，或者也可以指定type，<Button type="submit">Submit Order</Button>
