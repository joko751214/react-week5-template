import { login } from '@/api/server/login';
import { useNavigate } from 'react-router';
import { rules } from '@/utils/formRules';

export const Login = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [btnLoading, setBtnLoading] = useState(false);

  // 登入表單提交
  const handleSubmit = async (values) => {
    try {
      setBtnLoading(true);
      const {
        data: { token, expired },
      } = await login(values);
      message.success('登入成功');
      setTimeout(() => {
        navigate('/admin');
      }, 1000);
      if (token) {
        document.cookie = `hexschoolToken=${token}; expires=${new Date(expired)};`;
      }
    } catch (error) {
      message.error(error.response?.data?.message || '未知錯誤');
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <Flex justify="center" align="center" vertical className="min-h-screen">
      <Card title="請先登入" className="w-full max-w-100">
        <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off">
          <Form.Item label="Email" name="username" rules={[...rules.required('請輸入 Email'), ...rules.email]}>
            <Input type="email" placeholder="name@example.com" autoFocus />
          </Form.Item>

          <Form.Item label="密碼" name="password" rules={[...rules.required('請輸入密碼')]}>
            <Input.Password placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={btnLoading}>
              登入
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <p className="mt-12 text-gray-400 mb-4">&copy; 2024~∞ - 六角學院</p>
    </Flex>
  );
};
