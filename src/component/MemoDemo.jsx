import { useCallback } from "react";
import { useState } from "react";

function MemoDemo() {
  const bigList = Array.from({ length: 5000 }, (_, i) => i + 1)
  const [iptVal, setIptVal] = useState("");
  const [dataSource, setDataSource] = useState(bigList.slice(0, 20).join(","));
  const handleChange = useCallback(
    (newVal) => {
      setIptVal(newVal);
      console.log(newVal);
      setDataSource(
        bigList
          .map((item) => String(item))
          .filter((item) => item.includes(newVal))
          .sort((a, b) => a - b)
          .slice(0, 20)
          .join(","),
      );
      console.log(dataSource);
    },
    [iptVal],
  );
  return (
    <>
      <button>计数器</button>
      <input
        type="text"
        value={iptVal}
        onChange={(e) => handleChange(e.target.value)}
      />
      <p>数字：</p>
      <div>{dataSource}</div>
    </>
  );
}
export default MemoDemo;
