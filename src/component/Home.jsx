import { Button } from "antd";
import { useContext } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import {useNameContext} from '../context/index'
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
      </div>
    </>
  );
}
export default Home;
