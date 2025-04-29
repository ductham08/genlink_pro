import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/LoginForm.scss';
import { useLoginMutation } from '../app/slices/authenticate';

const LoginForm: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [login] = useLoginMutation();
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
            navigate('/');
        }
    }, [navigate]);

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const response = await login(values).unwrap();
            
            if (response.token) {
                message.success('Đăng nhập thành công!');
                sessionStorage.setItem('token', response.token);
                navigate('/');
            } else {
                message.error(response.message || 'Đăng nhập thất bại!');
            }
        } catch (error: any) {
            message.error(error.data?.message || 'Có lỗi xảy ra, vui lòng thử lại!');
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
                            autoComplete="off"
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
            </div>
        </div>
    );
};

export default LoginForm; 