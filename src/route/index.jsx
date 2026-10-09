import { createBrowserRouter } from "react-router-dom";
import Home from "../component/Home";
import MistakeNotebook from "../component/MistakeNotebook";
import PractiseCenter from "../component/PractiseCenter";
import Profile from "../component/Profile";
import QuestionManage from "../component/QuestionManage";
import App from "../App";
const router = createBrowserRouter([
  { path: "/", element: <App />, children: [
    { index: true ,element:<Home/>},
    {path:'question-manage',element:<QuestionManage/>},
    {path:'mistake-notebook',element:<MistakeNotebook/>},
    {path:'practise-center',element:<PractiseCenter/>},
    {path:'profile',element:<Profile/>}
] },
]);
export default router;
