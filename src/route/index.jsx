import { createBrowserRouter } from "react-router-dom";
import Home from "../component/Home";
import MistakeNotebook from "../component/MistakeNotebook";
import PractiseCenter from "../component/PractiseCenter";
import Profile from "../component/Profile";
import QuestionManage from "../component/QuestionManage";
import TodoList from "../component/TodoList";
import MemoDemo  from "../component/MemoDemo";
import App from "../App";
const router = createBrowserRouter([
  { path: "/", element: <App />, children: [
    { index: true ,element:<Home/>},
    {path:'question-manage',element:<QuestionManage/>},
    {path:'mistake-notebook',element:<MistakeNotebook/>},
    {path:'practise-center',element:<PractiseCenter/>},
    {path:'profile',element:<Profile/>},
    {path:'todolist',element:<TodoList/>},
    {path:'memotest',element:<MemoDemo/>},
] },
]);
export default router;
