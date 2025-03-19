import React, { useState } from 'react';
import { Form, Input, Button, message, Modal } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const LoginForm: React.FC = () => {
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            if (response.ok) {
                const data = await response.json();
                message.success(data.message);
                // Lưu token vào sessionStorage để gửi kèm khi call API
                sessionStorage.setItem('token', data.token);
                // Chuyển hướng qua trang tạo link sau 3s
                setTimeout(() => {
                    window.location.href = '/';
                }, 3000);
            } else {
                const error = await response.json();
                message.error(error.message);
            }
        } catch (error) {
            message.error('Có lỗi xảy ra, vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Đăng nhập"
            open={true}
            footer={null}
            closable={false}
            maskClosable={false}
            width={450}
            centered
        >
            <Form
                name="normal_login"
                className="login-form"
                initialValues={{ remember: true }}
                onFinish={onFinish}
            >
                <Form.Item
                    name="username"
                    rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Tên đăng nhập" />
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                >
                    <Input.Password
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="Mật khẩu"
                    />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button" loading={loading} block>
                        Đăng nhập
                    </Button>
                </Form.Item>

                <div style={{ textAlign: 'center' }}>
                    Chưa có tài khoản? <Link to="/register" style={{textDecoration: 'none'}}>Đăng ký ngay</Link>
                </div>
            </Form>
        </Modal>
    );
};

export default LoginForm; 