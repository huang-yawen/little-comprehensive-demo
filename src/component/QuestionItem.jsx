import { Button, Radio } from "antd";
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
