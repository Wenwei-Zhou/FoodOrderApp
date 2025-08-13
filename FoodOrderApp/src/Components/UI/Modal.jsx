import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export default function Modal({ children, open, className = "" }) {
  const dialog = useRef();
  useEffect(() => {
    const modal = dialog.current;
    if (open) {
      modal.showModal();
    }

    return () => modal.close();
  }, [open]);
  // 当 progress 等于 "cart" 时，open 就会变成 true，（因为代表在Modal component执行时，open有被使用，所以就是等于true）
  // 当 progress 不是 "cart"（比如空字符串 "" 或 "checkout"），open 就会是 false

  // useEffect运行：
  // 当 open 从 true → false，或者 false → true 时，React 会先运行上一次 effect 的 cleanup，再运行新的 effect。
  // 第一次 open = true → 运行 modal.showModal()（不会立刻调用 modal.close()）
  // 当 open 变成 false → cleanup 运行 → modal.close()
  // 如果再次 open = true → 又会调用 modal.showModal()

  return createPortal(
    <dialog ref={dialog} className={`modal ${className}`}>
      {children}
    </dialog>,
    document.getElementById("modal")
  );
}
// <dialog>是弹出窗口

// 为什么要 同时有 Cart 组件 + 原生 <dialog> 元素？
// React 组件 (Cart)：用来控制数据逻辑（Cart 里显示哪些商品、按钮点了要干嘛）和渲染 JSX。
// 原生 <dialog> 元素：这是浏览器提供的 UI 容器，它自带模态效果（阻止背景点击、自动加半透明遮罩、ESC 关闭等）。
// React 只是帮我们把 <dialog> 插入 DOM，而 浏览器原生 <dialog> API 才能真正让它“弹出来”或“消失”。

// 换句话说：
// Cart 是“内容和逻辑”，<dialog> 是“外壳和模态行为”。！！！！！！！

// ┌────────────────────────────┐
// │ 1. 用户点击 "Show Cart" 按钮 │
// └──────────────┬─────────────┘
//                │ 调用
//                ▼
//      userProgressCtx.showCart()
//                │
//                ▼
//   setUserProgress("cart")   ← React Context 状态更新
//                │
//                ▼
// progress === "cart" → open = true
//                │
//                ▼
// ┌────────────────────────────────┐
// │  Cart 组件接收 open={true}      │
// │  内部包含 <dialog ref={dialog}> │
// └──────────────┬─────────────────┘
//                │
//                ▼
//    useEffect 监听 [open]
//     if (open === true):
//         modal.showModal()  ← 浏览器原生 API 显示模态框
//                │
//                ▼
//     <dialog> 显示在屏幕上
//     (背景变灰、阻止点击、ESC 可关闭)

// -----------------------------------------
// 关闭流程：
// -----------------------------------------

// 用户点击 "Close" 按钮
//                │
//                ▼
// userProgressCtx.hideCart()
//                │
//                ▼
// setUserProgress("")  → open = false
//                │
//                ▼
// useEffect cleanup 触发：
//     return () => modal.close()
//                │
//                ▼
// <dialog> 被关闭，回到初始状态
