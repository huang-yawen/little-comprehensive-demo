import { useState } from "react";
import { Modal, Form, Input } from "antd";
import { useEffect } from "react";

// 受控弹窗：显示与否由父组件通过 open 控制，
// 表单校验通过后把数据通过 onSubmit 交回父组件处理，自己不再持有业务数据
function Dialog({ open, onSubmit, onClose, transferData }) {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  // 【思路】Dialog 不关心是新增还是编辑，只看 transferData：
  //   有值 -> setFieldsValue 回填（knowledge 数组转成逗号字符串）；没有值 -> resetFields 清空。
  //   每次 open 变为 true 时执行，保证打开弹窗时表单内容总是和当前模式一致。
  useEffect(() => {
    if(open){
      if (transferData) {
      // 【复盘】曾误写成 setFieldValue(name, value)：它只设置单个字段；
      // 批量回填整个对象要用 setFieldsValue（带 s）。
      form.setFieldsValue({
        ...transferData,
        knowledge: Array.isArray(transferData.knowledge)
          ? transferData.knowledge.join(",")
          : transferData.knowledge,
      });
    } else {
      form.resetFields({})  // resetFields 的参数是"字段名数组"，传 {} 没有意义，直接 resetFields() 即可
    }
    }
  }, [open,transferData]);
  const handleOk = () => {
    setConfirmLoading(true);
    // 只有校验通过才会触发 onFinish，否则走 onFinishFailed
    form.submit();
  };

  const handleCancel = () => {
    form.resetFields();
    setConfirmLoading(false);
    onClose();
  };

  const onFinish = (values) => {
    onSubmit(values);
    // 模拟请求耗时，两秒后关闭弹窗
    setTimeout(() => {
      setConfirmLoading(false);
      form.resetFields();
      onClose();
    }, 2000);
  };

  const onFinishFailed = () => {
    // 校验不通过时把 loading 复位，否则确定按钮会一直转圈
    setConfirmLoading(false);
  };

  return (
    <Modal
      title="新增知识点"
      open={open}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        style={{ maxWidth: 600 }}
      >
        <Form.Item
          label="题目详细"
          name="name"
          rules={[{ required: true, message: "请输入题目详细" }]}
        >
          <Input placeholder="input placeholder" />
        </Form.Item>
        <Form.Item
          label="题目类型"
          name="category"
          rules={[{ required: true, message: "请输入题目类型" }]}
        >
          <Input placeholder="input placeholder" />
        </Form.Item>
        <Form.Item
          label="题目等级"
          name="level"
          rules={[{ required: true, message: "请输入题目等级" }]}
        >
          <Input placeholder="input placeholder" />
        </Form.Item>
        <Form.Item
          label="知识点"
          name="knowledge"
          rules={[{ required: true, message: "请输入知识点，多个用逗号分隔" }]}
        >
          <Input placeholder="input placeholder" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
export default Dialog;
