export default function Input({ label, id, ...props }) {
  return (
    <p className="control">
      <label htmlFor={id}>{label}</label>
      <input id={id} name={id} {...props} required />
    </p>
  );
}

//  在标签上, 我们还可以将htmlFor prop设置为id, 以告知浏览器此标签连接到哪个输入｡
