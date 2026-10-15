import { Button, Radio } from "antd";
// 【复盘】组件拆分：把题目卡片从 PractiseCenter 拆成子组件（只记这一阶段的要点）
// 11) 拆分的基本规则：state 留在父组件（状态提升），子组件只通过 props 拿数据、通过回调函数把操作"报告"给父组件。
//    - 子组件自己没有 useState，这是对的：选了什么、提交了什么都要被统计行用到，必须放在父组件。
//    - props 是只读的，不能在子组件里直接改它；要改就调用父组件传下来的 handleChange / handleClick。
// 12) key 写在 map 里面最外层的那个元素上（即父组件里的 <QuestionItem key=... />）。
//    - 子组件内部的 <div key={item.id}> 没有作用（key 不会传进子组件，也不在列表里），可以删掉。
//    - 这里的 <></> 也多余，外面已经有一个 div 了。
// 13) 可以进一步优化但不是错误：现在把整个 isRequiredArray / ifShow / rightArray 都传进来，子组件只用其中当前题的那一项。
//    - 更清爽的写法是父组件算好当前题的 selected / submitted / correct 再传，子组件就不需要知道"数组"这种结构。练习阶段可忽略。
function QuestionItem({item,handleChange,handleClick,isRequiredArray,ifShow,rightArray}) {
  return (
    <>
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
    </>
  );
}
export default QuestionItem;
