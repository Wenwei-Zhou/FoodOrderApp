export default function Button({ children, textOnly, className, ...props }) {
  let cssClasses = textOnly ? "text-button" : "button";
  cssClasses += " " + className;
  return (
    <button className={cssClasses} {...props}>
      {children}
    </button>
  );
}


// let：可以重新赋值
// const：声明后不能重新赋值

// 定义className：是textOnly的话"text-button"，不是的话"button"
// {...props}包含有onClick，type等等。。。