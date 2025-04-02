import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { Link } from 'react-router-dom';
import '../styles/LoginForm.scss';
import { useLoginMutation } from '../app/slices/authenticate';

const LoginForm: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [ login ] = useLoginMutation()

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const response = await login(values)
            
            if (response.data?.error_code === 200) {
                message.success(response.data.message);
                sessionStorage.setItem('token', response.data.token);

                setTimeout(() => {
                    window.location.href = '/';
                }, 1500);
            } else {
                message.error(response.data.message);
            }
        } catch (error) {
            message.error('Có lỗi xảy ra, vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-content">
                <div className="login-form-section">
                    <div className="login-form-content">
                        <h1>Đăng nhập</h1>
                        <p className="subtitle">Nhập tên đăng nhập và mật khẩu để đăng nhập hệ thống</p>
                        
                        <Form
                            name="login_form"
                            className="login-form"
                            initialValues={{ remember: false }}
                            onFinish={onFinish}
                            layout="vertical"
                        >
                            <Form.Item
                                label="Tên đăng nhập"
                                name="username"
                                rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
                            >
                                <Input placeholder="Tên đăng nhập" />
                            </Form.Item>

                            <Form.Item
                                label="Mật khẩu"
                                name="password"
                                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                            >
                                <Input.Password placeholder="Mật khẩu" />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={loading} block>
                                    Đăng nhập
                                </Button>
                            </Form.Item>

                            <div className="signup-link">
                                Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
                            </div>
                        </Form>
                    </div>
                </div>
                <div className="login-image-section">
                    <img src="/images/bunny.jpg" alt="Bunny" />
                </div>
            </div>
        </div>
    );
};

export default LoginForm; 