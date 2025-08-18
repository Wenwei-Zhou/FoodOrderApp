import { useCallback, useEffect, useState } from "react";

async function sendHttpRequest(url, config) {
  const response = await fetch(url, config);

  const resData = await response.json();

  if (!response.ok) {
    throw new Error(
      resData.message || "Something went wrong, failed to send request."
    );
  }
  
  return resData;
}
// url: 请求的地址
// config 就是传给 fetch 的配置对象。它决定请求的 method / headers / body 等等。

export default function useHttp(url, config, initidalData) {
  const [data, setData] = useState(initidalData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [success, setSuccess] = useState(false);

  function clearData() {
    setData(initidalData);
    setSuccess(false);
  }

  const sendRequest = useCallback(
    async function sendRequest(requestBody) {
      setIsLoading(true);
      try {
        const resData = await sendHttpRequest(url, {...config, body: requestBody});
        setData(resData);
        setSuccess(true);
      } catch (error) {
        setError(error.message || "Something went wrong!");
      }
      setIsLoading(false);
    },
    [url, config]
    // sendRequest 需要知道要请求的 url 和请求配置 config。
    // 所以 当 url 或 config 改变时，React 会重新生成一个新的 sendRequest。
    // setData(resData); 把data设置为请求到的数据。
    // setSuccess(true); 把success设置为true，表示请求成功。
  );

  useEffect(() => {
    if ((config && (config.method === "GET" || !config.method)) || !config) {
      sendRequest();
      
    }
  }, [sendRequest, config]);
  // useEffect 需要在 sendRequest 改变时执行。
  // config 也需要作为依赖项，因为如果 config 改变了（比如 method 从 GET 改成 POST），我们需要重新发送请求。

  return {
    success,
    data,
    isLoading,
    error,
    sendRequest,
    clearData,
  };
}

// 为什么要用useCallback？
// useCallback 可以缓存 sendRequest 函数，避免每次组件重新渲染时都创建一个新的函数实例。
// 如果 sendRequest 每次都是新函数，useEffect 会以为依赖变了 → 每次渲染都再次执行 → 无限循环请求！！！！！

// 为什么要用useEffect？
// 避免无限循环，你在组件 render 里直接调用 sendRequest() 会导致：
// render → sendRequest → setState → re-render → sendRequest …（无限循环请求）
