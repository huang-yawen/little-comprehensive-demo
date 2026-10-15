import { Button } from "antd";
import { useContext } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import {themeContext, useNameContext} from '../context/index'
// 【复盘】学习计时器：useEffect 清理函数 + useRef（只记这一阶段新出现的问题）
// 14) 计时器"开始 / 暂停 / 清零"是三个动作，每个都要想清楚会改哪个状态：
//    - 清零只写了 setTimer(0)，计时器还在走，要同时 setFlag(false)；"能改多个状态的动作"要逐个对照检查。
// 15) useEffect 的依赖数组决定"什么时候再执行"：
//    - 不写依赖数组 = 每次渲染后都执行；计时器每秒更新一次，focus() 就每秒把输入框焦点抢回来，打字被打断。
//    - 写 [] = 只在组件第一次挂载后执行一次，"只想做一次"的事（聚焦、初始化）放这里。
//    - 依赖里放"用到的、会变的值"：计时用 [timer, flag]。
// 16) 定时器必须清理：useEffect 里 return () => clearTimeout(temp)。
//    - 每次依赖变化、组件卸载前，React 会先执行上一次返回的清理函数，不清理就会残留定时器，切换页面后还在偷偷运行。
//    - 在定时器里用 setTimer((prev) => prev + 1) 的函数式更新，拿到的是最新值，不会被"闭包里的旧值"坑。
// 17) 布尔比较不能当字符串用：String(parseInt(timer / 60) < 10) 得到的是 "false" / "true"，不是数字。
//    - 要显示数字就写 String(parseInt(timer / 60))；补零更省事的写法：String(n).padStart(2, "0")。
// 18) useRef：iptBox.current 指向真实的 DOM 元素，用来调用 focus()；改它不会触发重新渲染（和 useState 的区别）。
//    - 不要在渲染阶段读写 ref.current，放进 useEffect 或事件处理函数里。
function Home() {
  const [timer, setTimer] = useState(0);
  const [flag, setFlag] = useState(false);
  const handleStart = () => {
    setFlag(true);
  };
  const handleSuspend = () => {
    setFlag(false);
  };
  const handleReset = () => {
    setTimer(0);
    setFlag(false)
  };
  const iptBox = useRef(null);
  useEffect(() => {
    let temp = null;
    if (flag) {
      temp = setTimeout(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearTimeout(temp);
  }, [timer, flag]);
  useEffect(() => {
    iptBox.current.focus();
  },[]);
  const {nameVal}=useContext(useNameContext)
  const {color,changeTheme}=useContext(themeContext)
  const showStr = `${parseInt(timer / 60) < 10 ? "0" + parseInt(timer / 60) : String(parseInt(timer / 60))}:${timer % 60 < 10 ? "0" + parseInt(timer % 60) : String(timer % 60)}`;
  return (
    <>
      <div>
        <p>{nameVal}你好！欢迎回家</p>
        今天学习什么：
        <input type="text" ref={iptBox} />
        <p>已经学习{showStr}</p>
        <p>
          <Button
            color="primary"
            variant="solid"
            onClick={handleStart}
            disabled={flag ? true : false}
          >
            开始
          </Button>
          <Button
            color="pink"
            variant="solid"
            onClick={handleSuspend}
            disabled={flag ? false : true}
          >
            暂停
          </Button>
          <Button color="danger" variant="solid" onClick={handleReset}>
            清零
          </Button>
        </p>
        <div>现在的主题颜色是:{color} <button onClick={()=>changeTheme(color)}>切换颜色</button></div>
      </div>
    </>
  );
}
export default Home;
