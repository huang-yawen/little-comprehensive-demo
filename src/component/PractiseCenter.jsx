import { useEffect } from "react";
import { useMemo } from "react";
import { useState } from "react";
import QuestionItem from "./QuestionItem";
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
// 【复盘】第二阶段：统计行 / 重新练习 / 刷新后保留进度（只记这一阶段新出现的问题）
// 5) 分不清"选了"和"提交了"，是两件事、两个状态：
//    - isRequiredArray 记"选了什么"（选项变化时改），ifShow 记"提交了哪些"（点提交时改）；想去改 handleChange 来判断提交，就是把两件事混在一起。
//    - 统计"答对几题"要从"已提交"出发（ifShow 里有几个在答对列表里），不能直接数全部答对的，否则没提交也会被算进去。
// 6) JSX 和字符串不一样：
//    - 把 <p>...</p> 放进反引号模板字符串，页面上显示的是标签原文；要显示成段落，直接写 JSX：<p>{str}</p>。
//    - 统计行放在 questions.map 里面会每题重复一遍，放在 map 外面才只出现一次、并且在顶部。
// 7) 条件漏写了一种情况：提交按钮只在"没选"时禁用，漏了"已提交"，所以能重复提交、已提交数被多算。
//    - disabled 要把所有该禁用的情况都列出来：没选 或 已提交。
// 9) localStorage：读和写要分开放。
//    - 读：放在 useState 的初始值函数里（惰性初始值，只在组件第一次渲染时执行）；写：放在 useEffect 里，依赖写要保存的状态。
//    - 不要在组件函数体或初始值函数里写 setItem，每次执行都会把旧数据清掉。
//    - getItem 返回字符串或 null：要 JSON.parse 变回对象/数组；没存过时是 null，用 ?? 给默认值（不用 ||，|| 会把 0、"" 也当成没有）。
//    - setItem 直接存对象/数组会变成 "[object Object]"，要先 JSON.stringify。
// 10) 概念上容易混的两处：
//    - 浏览器刷新：state 全部清空，初始值函数重新读一次存储；点击触发 set：组件重新渲染，state 保留，初始值函数不再执行。
//    - set 触发重新渲染；useEffect 在渲染完成后（依赖变化时）才执行，只负责保存，不会触发渲染。
//    - useMemo / useCallback 不阻止组件函数重新执行，只是依赖没变时复用上次的结果/函数引用；数据量小就直接写。
function PractiseCenter() {
  // 已经做了的题目
  const [isRequiredArray, setIsRequiredArray] = useState(
    () => JSON.parse(localStorage.getItem("isRequiredArray")) ?? {},
  );
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
  // 函数形式的初始值，react只在第一次渲染的时候调用它，这个是惰性初始值
  const [ifShow, setIfShow] = useState(
    () => JSON.parse(localStorage.getItem("ifShow")) ?? [],
  );
  // 使用两个问号 而不是两个或者符号
  const handleClick = (id) => {
    setIfShow((prev) => [...prev, id]);
  };
  const handleRedo = () => {
    setIsRequiredArray({});
    setIfShow([]);
  };
  const rightNum = rightArray.filter(
    (item) => item && ifShow.includes(item),
  ).length;
  const str = `已提交 ${ifShow.length}/${questions.length} 题,答对 ${rightNum} 题`;
  useEffect(() => {
    localStorage.setItem("isRequiredArray", JSON.stringify(isRequiredArray));
    localStorage.setItem("ifShow", JSON.stringify(ifShow));
  }, [isRequiredArray, ifShow]);

  return (
    <>
      <div>
        <p>
          {str} <button onClick={handleRedo}>重新练习</button>
        </p>
        {questions.map((item) => {
          return (
              <QuestionItem
                key={item.id}
                item={item}
                handleChange={handleChange}
                handleClick={handleClick}
                isRequiredArray={isRequiredArray}
                ifShow={ifShow}
                rightArray={rightArray}
              />
          );
        })}
      </div>
    </>
  );
}
export default PractiseCenter;
