import { useState } from "react";
import { Button, Flex, Popconfirm, Table, Tag } from "antd";
import DialogRef from "./DialogRef";

const initialData = [
  { key: "1", id: 1, name: "JavaScript 变量与作用域", category: "单选题", level: "简单", knowledge: ["JavaScript", "ES6", "作用域"] },
  { key: "2", id: 2, name: "React Hooks 使用", category: "多选题", level: "中等", knowledge: ["React", "Hooks", "State"] },
  { key: "3", id: 3, name: "CSS Flex 布局", category: "判断题", level: "简单", knowledge: ["CSS", "Flex", "HTML"] },
];

function QuestionManageRef() {
  // ① 完整数据：只有「新增 / 编辑 / 删除」才能修改它
  const [list, setList] = useState(initialData);

  // ② 搜索框里正在输入的内容（还没点查找，不影响表格）
  const [keyWord, setKeyWord] = useState("");
  const [optionValue, setOptionValue] = useState("allOption");

  // ③ 点「开始查找」后才生效的条件
  const [filter, setFilter] = useState({ keyWord: "", optionValue: "allOption" });

  // ④ 弹窗：open 控制显示；transferData 为 null 代表新增，有值代表编辑
  const [open, setOpen] = useState(false);
  const [transferData, setTransferData] = useState(null);

  // 要展示的行 = 完整数据 + 生效条件，渲染时现算，不单独存 state
  // 这样查找永远不会破坏 list
  const showData = list.filter(
    (item) =>
      item.name.includes(filter.keyWord) &&
      (filter.optionValue === "allOption" || item.category === filter.optionValue),
  );

  const handleSearch = () => setFilter({ keyWord, optionValue });

  const handleAdd = () => {
    setTransferData(null); // 清空，否则会残留上次编辑的那行
    setOpen(true);
  };

  const handleEdit = (record) => {
    setTransferData(record);
    setOpen(true);
  };

  // 不可变更新：filter 生成新数组
  const handleDelete = (record) => {
    setList((prev) => prev.filter((item) => item.id !== record.id));
  };

  // Dialog 校验通过后回调：这里决定是新增还是编辑
  const onFinish = (values) => {
    if (transferData) {
      // 编辑：map 按 id 找到那一行，用表单值覆盖，其余行原样返回
      setList((prev) =>
        prev.map((item) =>
          item.id === transferData.id ? { ...item, ...values } : item,
        ),
      );
    } else {
      // 新增：基于最新的 prev 计算 id；Math.max(0, ...) 保证列表为空时也不报错
      setList((prev) => {
        const newId = Math.max(0, ...prev.map((item) => item.id)) + 1;
        return [...prev, { key: String(newId), id: newId, ...values }];
      });
    }
  };

  const columns = [
    { title: "题目id", dataIndex: "id", key: "id" },
    { title: "题目详细", dataIndex: "name", key: "name" },
    { title: "题型", dataIndex: "category", key: "category" },
    { title: "难度", dataIndex: "level", key: "level" },
    {
      title: "所属知识点",
      dataIndex: "knowledge",
      key: "knowledge",
      render: (knowledge) => (
        <Flex gap="small" wrap>
          {knowledge.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </Flex>
      ),
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)}>编辑</Button>
          <Popconfirm title="确定删除这道题吗？" onConfirm={() => handleDelete(record)}>
            <Button type="link" danger>删除</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
      <input value={keyWord} onChange={(e) => setKeyWord(e.target.value)} />
      <select value={optionValue} onChange={(e) => setOptionValue(e.target.value)}>
        <option value="allOption">全部</option>
        <option value="单选题">单选题</option>
        <option value="多选题">多选题</option>
        <option value="判断题">判断题</option>
      </select>
      <button onClick={handleSearch}>开始查找</button>
      <Button type="primary" onClick={handleAdd}>新增数据</Button>

      <DialogRef
        open={open}
        transferData={transferData}
        onSubmit={onFinish}
        onClose={() => setOpen(false)}
      />
      <Table columns={columns} dataSource={showData} />
    </>
  );
}
export default QuestionManageRef;
