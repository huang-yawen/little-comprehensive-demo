import { useState } from "react";
import { useReducer } from "react";
const initialTodos = [
  { id: 1, text: "学习 useReducer", done: false },
  { id: 2, text: "复习 useContext", done: true },
  { id: 3, text: "写复盘", done: false },
];
function TodoListReducer(state, action) {
  switch (action.type) {
    case "add": {
      const largestID =
        state.find((item) => item.id >= Math.max(...state.map((el) => el.id))).id +
        1;
      return [
        ...state,
        { id: largestID, text: action.payload, done: false },
      ];
    }
    case "delete": {
      return state.filter((item) => item.id != action.payload);
    }
    case "clear": {
        return state.filter(item=>item.done==false)
    }
    case "toggle": {
      return state.map((item) => {
        return item.id == action.payload ? { ...item, done: !item.done } : item;
      });
    }
  }
}
function TodoList() {
  const [state, dispatch] = useReducer(TodoListReducer, initialTodos);
  const [newVal, setNewVal] = useState('');
  return (
    <>
      <div>
        <p>
          新增任务：
          <input
            type="text"
            value={newVal}
            onChange={(e) => setNewVal(e.target.value)}
          />
          <button onClick={() => dispatch({ type: "add", payload: newVal })}>
            新增
          </button>
          <button onClick={()=>dispatch({type:'clear'})}>清空已做</button>
        </p>
        <ul>
          {state.map((item) => (
            <li key={item.id}>
              {item.text}{" "}
              <button
                onClick={() => dispatch({ type: "toggle", payload: item.id })}
              >
                切换
              </button>
              <button
                onClick={() => dispatch({ type: "delete", payload: item.id })}
              >
                删除
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
export default TodoList;
