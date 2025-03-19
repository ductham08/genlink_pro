import React, { useState } from 'react';
import { Form, Input, Button, message, Modal } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const RegisterForm: React.FC = () => {
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            if (response.ok) {
                const data = await response.json();
                message.success(data.message);
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
            title="Đăng ký tài khoản"
            open={true}
            footer={null}
            closable={false}
            maskClosable={false}
            width={450}
            centered
        >
            <Form
                name="normal_register"
                className="register-form"
                onFinish={onFinish}
            >
                <Form.Item
                    name="fullName"
                    rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Họ và tên" />
                </Form.Item>

                <Form.Item
                    name="telegram"
                    rules={[{ required: true, message: 'Vui lòng nhập tài khoản telegram!' }]}
                >
                    <Input 
                        prefix={<UserOutlined className="site-form-item-icon" />} 
                        placeholder="Telegram"
                    />
                </Form.Item>

                <Form.Item
                    name="username"
                    rules={[
                        { required: true, message: 'Vui lòng nhập tên đăng nhập!' },
                        { pattern: /^[a-zA-Z0-9]+$/, message: 'Tên đăng nhập không được chứa dấu, khoảng trắng hoặc ký tự đặc biệt!' }
                    ]}
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Tên đăng nhập" />
                </Form.Item>
                
                <Form.Item
                    name="password"
                    rules={[
                        { required: true, message: 'Vui lòng nhập mật khẩu!' },
                        { pattern: /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9]).{8,}$/, message: 'Mật khẩu phải có ít nhất 8 ký tự, 1 chữ hoa và 1 ký tự đặc biệt' }
                    ]}
                >
                    <Input.Password
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password" 
                        placeholder="Mật khẩu"
                    />
                </Form.Item>

                <Form.Item
                    name="confirmPassword"
                    dependencies={['password']}
                    rules={[
                        { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="Xác nhận mật khẩu"
                    />
                </Form.Item>

                <div style={{ marginBottom: 16 }}>
                    <i>* Telegram có tác dụng để xác nhận tài khoản khi liên hệ hỗ trợ</i>
                </div>

                <Form.Item>
                    <Button type="primary" htmlType="submit" className="register-form-button" loading={loading} block>
                        Đăng ký
                    </Button>
                </Form.Item>

                <div style={{ textAlign: 'center' }}>
                    Đã có tài khoản? <Link style={{textDecoration: 'none'}} to="/login">Đăng nhập ngay</Link>
                </div>
            </Form>
        </Modal>
    );
};

export default RegisterForm; 