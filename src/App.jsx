import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useNameContext } from "./context";
import { themeContext } from "./context";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, theme } from "antd";
const { Header, Content, Footer, Sider } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}
const items = [
  getItem("首页", "/", <PieChartOutlined />),
  getItem("题目管理", "/question-manage", <DesktopOutlined />),
  getItem("练习中心", "/practise-center", <UserOutlined />),
  getItem("错题本", "/mistake-notebook", <TeamOutlined />),
  getItem("我的", "/profile", <FileOutlined />),
];
// 【复盘】useContext：跨页面共享用户名 / 主题（只记这一阶段新出现的问题）
// 19) Context 三步：createContext 创建 → Provider 包住需要的组件并通过 value 传值 → 子组件 useContext 读取。
//    - Provider 只对它"里面包着的子孙组件"生效；Provider 放在 Profile 内部，Home 和 Profile 是平级页面，Home 读到的就是默认值 undefined。
//    - 共享数据的 useState 要放在"共同的上层"（这里是 App），放在某个页面里，一切换页面就丢了。
// 20) 报错 "Cannot destructure property ... of undefined" 的排查顺序：
//    - ① 组件外面有没有 Provider？② Provider 的属性是不是 value（不是 values，拼错 React 不报语法错，只是读到 undefined）？
//    - ③ value 里的名字和 useContext 解构的名字是否一致（changeTheme 对 changeColor）？④ 解构的结构和传的结构是否一致（传字符串却按对象解构）？
// 21) import 的相对路径是"相对当前文件"：App.jsx 在 src/ 下，要写 ./context；component/ 下的文件要写 ../context。
// 22) 函数的参数要和调用处对应：changeTheme(nowColorr) 需要传参，调用 changeTheme() 时参数是 undefined，条件永远不成立。
//    - 要么调用时传入 changeTheme(color)；要么在函数里用 setColor((prev) => ...)，调用方就不用管参数。
// 23) 命名习惯：Context 对象不要用 use 开头（use 开头是 Hook 的约定），可以叫 NameContext / ThemeContext。
//    - 也要避免和库里的名字冲突：antd 已经导出了 theme，所以主题 Context 叫 themeContext/ThemeContext 比 theme 安全。
// 24) 知道就行：value={{ ... }} 每次渲染都会生成新对象，所有 useContext 的组件都会跟着重新渲染；数据量小不用管。
// 25) 本阶段没做完的部分（有意略过）：主题还没影响页面的背景色和文字色；用户名和主题刷新后不保留（可用 useLocalStorage 自定义 Hook 补上）。
const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const currentYear = new Date().getFullYear();
  const [nameVal, setNameVal] = useState("张三");
  const changeName = (newVal) => {
    setNameVal(newVal);
  };
  const [color, setColor] = useState("暗黑");
  const changeTheme = (nowColorr) => {
    nowColorr == "暗黑" ? setColor("光亮") : setColor("暗黑");
  };
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname]}
          items={items}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <useNameContext.Provider value={{ nameVal, changeName }}>
          <themeContext.Provider value={{ color, changeTheme }}>
            <Content style={{ margin: "0 16px" }}>
              <Breadcrumb
                style={{ margin: "16px 0" }}
                items={[{ title: "User" }, { title: "Bill" }]}
              />
              <div
                style={{
                  padding: 24,
                  minHeight: 360,
                  background: colorBgContainer,
                  borderRadius: borderRadiusLG,
                }}
              >
                <Outlet />
              </div>
            </Content>
          </themeContext.Provider>
        </useNameContext.Provider>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©{currentYear} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};
export default App;
