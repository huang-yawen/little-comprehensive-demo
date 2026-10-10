import { useState } from "react";
import { Flex, Table, Tag, Space } from "antd";
import { Button } from "antd";
import Dialog from "./Dialog";
const data = [
  {
    key: "1",
    id: 1,
    name: "JavaScript 变量与作用域",
    category: "单选题",
    level: "简单",
    knowledge: ["JavaScript", "ES6", "作用域"],
  },
  {
    key: "2",
    id: 2,
    name: "React Hooks 使用",
    category: "多选题",
    level: "中等",
    knowledge: ["React", "Hooks", "State"],
  },
  {
    key: "3",
    id: 3,
    name: "CSS Flex 布局",
    category: "判断题",
    level: "简单",
    knowledge: ["CSS", "Flex", "HTML"],
  },
  {
    key: "4",
    id: 4,
    name: "TypeScript 泛型约束",
    category: "填空题",
    level: "困难",
    knowledge: ["TypeScript", "泛型", "JavaScript"],
  },
  {
    key: "5",
    id: 5,
    name: "TCP 三次握手",
    category: "简答题",
    level: "中等",
    knowledge: ["计算机网络", "TCP", "HTTP"],
  },
  {
    key: "6",
    id: 6,
    name: "二分查找",
    category: "编程题",
    level: "困难",
    knowledge: ["算法", "数据结构"],
  },
];
const QuestionManage = () => {
  const columns = [
    {
      title: "题目id",
      dataIndex: "id",
      key: "id",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "题型",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "难度",
      dataIndex: "level",
      key: "level",
    },
    {
      title: "所属知识点",
      key: "knowledge",
      dataIndex: "knowledge",
      render: (_, { knowledge }) => (
        <Flex gap="small" align="center" wrap>
          {knowledge.map((tag) => {
            let color = tag.length > 5 ? "geekblue" : "green";
            if (tag === "kawaii") {
              color = "volcano";
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </Flex>
      ),
    },
    {
      title: "题目详细",
      key: "detail",
      render: (_, record) => (
        <Space size="medium">
          <a>Invite {record.name}</a>
        </Space>
      ),
      // // 第二个参数 record 就是当前行的数据对象！
    },
    {
      title: "操作",
      dataIndex: "action",
      key: "action",
      render: (_, record) => (
        <>
        <Button color="pink" variant="text" onClick={() => handleEdit(record)}>
          编辑数据
        </Button>
        <Button color="red" variant="text" onClick={() => handleDelete(record)}>
          删除数据
        </Button>
        </>
      ),
    },
  ];
  const [keyWord, setKeyword] = useState("");
  const [optionValue, setOptionValue] = useState("allOption");
  //   受控组件写法，注意默认值直接写成初始值，不然筛选一直失效
  const [dataSource, setDataSource] = useState(data);
  const [open, setOpen] = useState(false);
  // 【思路】新增/编辑共用一个弹窗，只用 transferData 一个状态区分模式：
  //   transferData === null  -> 新增模式；有一行数据 -> 编辑模式（不需要再加 mode 变量，避免两个状态不同步）。
  // 数据流向：点编辑 -> 父组件 setTransferData(该行) 并打开弹窗 -> Dialog 回填表单 -> 用户点确定
  //   -> Dialog 只通过 onSubmit(values) 把表单数据交回 -> 父组件的 onFinish 根据 transferData 决定：
  //      新增 = 追加到数组末尾；编辑 = 用 map 按 id 找到原数据并替换（返回新数组，不能直接改 state）。
  // 分工：Dialog 只负责"收集数据"，数据存哪、新增还是修改，都由持有数据的父组件决定。
  // 【复盘】初始值曾写成 {}：空对象是真值，if(transferData) 永远成立，永远判成"编辑"。
  // 用 null 表示新增模式，有数据表示编辑模式，不需要额外的 mode 变量。
  const [transferData, setTransferData] = useState(null);
  // const [receivedData, setReceivedData] = useState({});
  const showModal = () => {
    // 【复盘】新增前必须清空，否则会残留上一次编辑的那行数据。
    setTransferData(null);
    setOpen(true);
  };
  const handleEdit = (val) => {
    // 【复盘】曾经只设置了数据，忘了 setOpen(true)，所以点编辑弹窗不出现。
    setTransferData({ ...val });
    setOpen(true);
    console.log(transferData);  // setState 是异步的，这里打印的是更新前的旧值，调试请看渲染里或 useEffect 里的值
  };
  const handleInput = (val) => {
    setKeyword(val);
  };
  const handleSelect = (val) => {
    setOptionValue(val);
  };
  // 不依赖旧值 那么就不用给函数写依赖

  const handleSearch = () => {
    setDataSource((prev) => {
      let filterData =
        keyWord === ""
          ? dataSource
          : dataSource.filter((item) => item.name.includes(keyWord));
      console.log(prev);
      if (optionValue == "allOption") {
        return filterData;
      } else {
        return filterData.filter((item) => item.category == optionValue);
      }
    });
  };
  const handleDelete=(val)=>{
    console.log(val)
    setDataSource(prev=>{
      console.log(prev.filter(item=>item.id!==val.id))
      return prev.filter(item=>item.id!==val.id)
    })
  }
  const onFinish = (values) => {
    console.log("收集到的表单数据：", values);
    // setReceivedData(values);
    // console.log("receivedData" + receivedData.level);
    if (transferData) {
      // 【复盘】编辑分支曾犯的 3 个错：
      // 1) setDataSource(prev=>{ ... }) 带花括号却没写 return，dataSource 变成 undefined，表格消失
      // 2) 用 values.id 匹配，但表单里没有 id 字段，永远是 undefined；应使用 transferData.id
      // 3) 替换时只写 {...values}，丢掉了原有的 key / id；应先 {...item} 再 ...values 覆盖
      // 编辑模式
      setDataSource(prev=>{
        return prev.map(item=>item.id==transferData.id?{...item,...values,knowledge:values.knowledge.split(",")}:item)
        // !!!!!!!!!
      })
    } else {
      // 新增模式
      const largestID = dataSource.find(
        (item) => item.id >= Math.max(...data.map((el) => el.id)),
      ).id;
      setDataSource((prev) => [
        ...prev,
        {
          key: String(largestID + 1),
          id: largestID + 1,
          name: values.name,
          category: values.category,
          level: values.level,
          knowledge: values.knowledge.split(","),
        },
      ]);
      // 状态是对象/数组 就必须给它新的引用。状态是原始类型的话，只要值不一样就会更新
      // !!！！！永远不要直接修改state,要先复制一份，该复制品，然后把复制品传给setter
    }
  };
  //   const handleAdd = () => {};
  return (
    <>
      <input
        type="text"
        value={keyWord}
        onChange={(e) => handleInput(e.target.value)}
      />
      <select
        name="category"
        value={optionValue}
        onChange={(e) => handleSelect(e.target.value)}
      >
        <option value="allOption">全部</option>
        <option value="单选题">单选题</option>
        <option value="多选题">多选题</option>
        <option value="判断题">判断题</option>
      </select>
      <button onClick={handleSearch}>开始查找</button>
      <Button type="primary" onClick={showModal}>
        新增数据
      </Button>
      <Dialog
        open={open}
        onSubmit={onFinish}
        onClose={() => setOpen(false)}
        transferData={transferData}
      />
      <Table columns={columns} dataSource={dataSource} />
    </>
  );
};
export default QuestionManage;
