import { Button, Radio } from "antd";
import { useMemo } from "react";
import { useState } from "react";
const questions = [
  {
    id: 1,
    title: "React 中哪个 Hook 用来保存状态?",
    options: ["useRef", "useState", "useMemo", "useId"],
    answer: 1,
  },
  {
    id: 2,
    title: "更新数组 state 时应该怎么做?",
    options: ["直接 push", "返回新数组", "直接改下标", "用 delete"],
    answer: 1,
  },
  {
    id: 3,
    title: "受控组件的值由谁决定?",
    options: ["DOM", "浏览器", "React state", "CSS"],
    answer: 2,
  },
];
// 【复盘】反复出错的 4 类问题（遇到类似情况先对照这里）
// 1) 真假值判断：把"有没有值"写成 if(x) / x ? a : b。
//    - 项目里 useState({}) 的 {} 是真值，if(transferData) 永远成立；这里选项下标 0 是假值，选第一个选项会被当成"没选"。
//    - 判断"有没有"，要明确和 null / undefined 比较（x === undefined、x !== null），别靠真假值。
// 2) 搞混"标识"和"数据"：存进去的、读出来的，不是你以为的那个东西。
//    - 存题号却没存选项；用 values.id 但表单里没有 id；用点击顺序 index 当题号；对象里写 id: val 而不是 [id]: val。
//    - 写之前先问一句：这个变量里装的到底是"哪一个"（题号 / 下标 / 选项值）？不确定就 console.log 看一眼。
// 3) 写了函数或状态，却没接上线：
//    - handleEdit 忘了 setOpen(true)；提交按钮没有 onClick；箭头函数带 {} 却没写 return。
//    - 每写完一个功能，自己点一遍"从点击到界面变化"的整条链路，哪一环没触发就接哪一环。
// 4) 条件写反（尤其是 disabled 这类"否定"属性）：
//    - disabled={x==undefined ? false : true} 的意思是"没选反而能点、选了反而禁用"，把语义说反了。
//    - disabled 的值 = "什么情况下要禁用"。先用中文写出这句话（没选 -> 禁用），再翻译成代码：
//      disabled={x === undefined}；能直接写成布尔表达式，就别再套 ? true : false。
//    - 改完条件后，把"没选 / 选了 / 选了下标 0"三种情况各点一遍，确认按钮状态。
function PractiseCenter() {
  // 已经做了的题目
  const [isRequiredArray, setIsRequiredArray] = useState({});
  // 选择正确的题目
  const rightArray = useMemo(() => {
    return Object.keys(isRequiredArray)
      .map((item) => Number(item))
      .map((item) => {
        let temp = questions.find((el) => el.id == item);
        if (temp && temp.answer == isRequiredArray[item]) {
          return item;
        }
      });
  }, [isRequiredArray]);
  const handleChange = (id, val) => {
    setIsRequiredArray((prev) => {
      return { ...prev, [id]: val };
      // !!!!!!!
    });
  };
  const [ifShow, setIfShow] = useState([]);
  const handleClick = (id) => {
    setIfShow((prev) => [...prev, id]);
  };
  const rightNum = rightArray.filter(
    (item) => item && ifShow.includes(item),
  ).length;
  const str = `已提交 ${ifShow.length}/${questions.length} 题,答对 ${rightNum} 题`;
  return (
    <>
      <div>
        {questions.map((item) => {
          return (
            <div key={item.id}>
              <div
                style={{
                  border: "1px solid black",
                  width: "800px",
                  height: "150px",
                }}
              >
                <p>
                  {item.id}:{item.title}
                  <Button
                    type="primary"
                    disabled={
                      (isRequiredArray[item.id] == undefined ? true : false) ||
                      ifShow.includes(item.id)
                    }
                    onClick={() => handleClick(item.id)}
                  >
                    提交
                  </Button>
                  <span
                    style={{
                      display: ifShow.includes(item.id) ? "block" : "none",
                    }}
                  >
                    {rightArray.includes(item.id) ? "回答正确" : "回答错误"}
                  </span>
                </p>
                <div>
                  <Radio.Group
                    value={isRequiredArray[item.id]}
                    onChange={(e) => handleChange(item.id, e.target.value)}
                    disabled={ifShow.includes(item.id)}
                  >
                    {item.options.map((el, index) => (
                      <span key={index}>
                        <Radio value={index}>{el}</Radio>
                      </span>
                    ))}
                  </Radio.Group>
                </div>
              </div>
            </div>
          );
        })}
        <p>{str}</p>
      </div>
    </>
  );
}
export default PractiseCenter;
