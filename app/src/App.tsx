import { useState } from 'react';
import { Layout, Form, Input, Button, Upload, message, Typography } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import './App.css';
import axios from 'axios';

const { Content } = Layout;
const { Title } = Typography;
const { TextArea } = Input;

function App() {
  const [form] = Form.useForm();
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    if (!imageFile) {
      message.error('Vui lòng chọn ảnh trước!');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('description', values.description);
      formData.append('redirectUrl', values.redirectUrl);
      formData.append('image', imageFile);

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/generate-landing`, formData);

      message.success('Đã tạo trang landing thành công! Bạn có thể truy cập tại: ' + response.data.url + '. Ảnh có thể được tải về tại: ' + response.data.imageUrl);
      form.resetFields();
      setImageFile(null);
    } catch (error) {
      message.error('Không thể tạo trang landing');
    } finally {
      setLoading(false);
    }
  };

  const uploadProps = {
    beforeUpload: (file: any) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('Bạn chỉ có thể tải lên các tệp ảnh!');
        return false;
      }
      setImageFile(file);
      return false; // Ngăn chặn tải lên tự động
    },
    maxCount: 1,
  };

  return (
    <Layout className="layout">
      <Content style={{ padding: '50px' }}>
        <div className="site-layout-content">
          <Title level={2} style={{ textAlign: 'center', marginBottom: '40px' }}>
            Tạo Trang Landing
          </Title>

          <Form
            form={form}
            name="landing-generator"
            onFinish={onFinish}
            layout="vertical"
            style={{ maxWidth: 600, margin: '0 auto' }}
          >
            <Form.Item
              name="title"
              label="Tiêu đề Trang"
              rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
            >
              <Input placeholder="Nhập tiêu đề trang web..." />
            </Form.Item>

            <Form.Item
              name="description"
              label="Mô tả"
              rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
            >
              <TextArea
                rows={4}
                placeholder="Nhập mô tả trang web..."
              />
            </Form.Item>

            <Form.Item
              name="redirectUrl"
              label="URL Chuyển Hướng"
              rules={[
                { required: true, message: 'Vui lòng nhập URL chuyển hướng!' },
                { type: 'url', message: 'Vui lòng nhập một URL hợp lệ!' }
              ]}
            >
              <Input placeholder="https://example.com" />
            </Form.Item>

            <Form.Item
              label="Tải lên Ảnh"
              required
            >
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />}>Chọn Ảnh</Button>
              </Upload>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
              >
                Tạo Trang Landing
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Content>
    </Layout>
  );
}

export default App;