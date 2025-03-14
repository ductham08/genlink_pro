import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const RegisterForm: React.FC = () => {
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            if (response.ok) {
                const data = await response.json();
                message.success(data.message);
                // Xử lý sau khi đăng ký thành công, ví dụ: chuyển hướng...
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
        <div className="container">
            <div className="col-md-5 col-12 content-form login-form">
                <Form
                    name="normal_register"
                    className="register-form"
                    onFinish={onFinish}
                >
                    <div className="item-form">
                        <Form.Item
                            name="fullName"
                            rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Họ và tên" />
                        </Form.Item>
                    </div>
                    <div className="item-form">
                        <Form.Item
                            name="telegram"
                            rules={[{ required: true, message: 'Vui lòng nhập tài khoản telegram!' }]}
                        >
                            <Input 
                                prefix={<UserOutlined className="site-form-item-icon" />} 
                                placeholder="Telegram"
                            />
                        </Form.Item>
                    </div>

                    <div className="item-form">
                        <Form.Item
                            name="username"
                            rules={[
                                { required: true, message: 'Vui lòng nhập tên đăng nhập!' },
                                { pattern: /^[a-zA-Z0-9]+$/, message: 'Tên đăng nhập không được chứa dấu, khoảng trắng hoặc ký tự đặc biệt!' }
                            ]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Tên đăng nhập" />
                        </Form.Item>
                    </div>
                    
                    <div className="item-form">
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

                    </div>

                    <div className="item-form">
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
                    </div>

                    <div className="item-form">
                        <i>* Telegram có tác dụng để xác nhận tài khoản khi liên hệ hỗ trợ</i>
                    </div>

                    <div className="item-form-submit">
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="register-form-button" loading={loading}>
                                Đăng ký
                            </Button>
                        </Form.Item>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default RegisterForm; 