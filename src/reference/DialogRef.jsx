import { useEffect } from "react";
import { Modal, Form, Input, Select } from "antd";

// 受控弹窗：显示与否、新增还是编辑，全部由父组件通过 props 决定
// Dialog 只负责「收集表单数据」，数据存在哪、怎么改，是父组件的事
function DialogRef({ open, onSubmit, onClose, transferData }) {
  const [form] = Form.useForm();

  // transferData 为 null -> 新增模式；有值 -> 编辑模式
  const isEdit = transferData !== null;

  // 每次打开弹窗，让表单内容与当前模式一致
  useEffect(() => {
    if (!open) return;
    if (isEdit) {
      // knowledge 本身就是数组，Select mode="tags" 的值也是数组，直接回填，不用转换
      form.setFieldsValue(transferData);
    } else {
      form.resetFields();
    }
  }, [open, transferData]);

  // 点「确定」：触发表单校验，通过才会进入 onFinish
  const handleOk = () => form.submit();

  const onFinish = (values) => {
    onSubmit(values); // 把数据交给父组件
    onClose();
  };

  return (
    <Modal
      title={isEdit ? "编辑题目" : "新增题目"}
      open={open}
      onOk={handleOk}
      onCancel={onClose}
    >
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item
          label="题目详细"
          name="name"
          rules={[{ required: true, message: "请输入题目详细" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="题目类型"
          name="category"
          rules={[{ required: true, message: "请输入题目类型" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="题目等级"
          name="level"
          rules={[{ required: true, message: "请输入题目等级" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="知识点"
          name="knowledge"
          rules={[{ required: true, message: "请至少输入一个知识点" }]}
        >
          {/* tags 模式：输入文字回车即生成一个标签，值是字符串数组 */}
          <Select mode="tags" placeholder="输入后回车添加" open={false} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
export default DialogRef;
