import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/RegisterForm.scss';
import { useRegisterMutation } from '../app/slices/authenticate';

const RegisterForm: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [register] = useRegisterMutation();
    const navigate = useNavigate();

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const response = await register(values).unwrap();
            
            if (response.error_code === 200) {
                message.success(response.message, 2, () => {
                    navigate('/login');
                });
            } else {
                message.error(response.message || 'Đăng ký thất bại!');
            }
        } catch (error: any) {
            message.error(error?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-content">
                <div className="register-form-section">
                    <div className="register-form-content">
                        <h1>Đăng ký tài khoản</h1>
                        <p className="subtitle">Điền thông tin để tạo tài khoản mới</p>
                        
                        <Form
                            name="register_form"
                            className="register-form"
                            onFinish={onFinish}
                            autoComplete="off"
                            layout="vertical"
                        >
                            <Form.Item
                                label="Họ và tên"
                                name="fullName"
                                rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                            >
                                <Input placeholder="Nguyễn Văn A" />
                            </Form.Item>

                            <Form.Item
                                label="Tài khoản Telegram"
                                name="telegram"
                            >
                                <Input placeholder="@username" />
                            </Form.Item>

                            <Form.Item
                                label="Tên đăng nhập"
                                name="username"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập tên đăng nhập!' },
                                    { pattern: /^[a-zA-Z0-9]+$/, message: 'Tên đăng nhập không được chứa dấu, khoảng trắng hoặc ký tự đặc biệt!' }
                                ]}
                            >
                                <Input placeholder="admin" />
                            </Form.Item>
                            
                            <Form.Item
                                label="Mật khẩu"
                                name="password"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập mật khẩu!' },
                                    { pattern: /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9]).{8,}$/, message: 'Mật khẩu phải có ít nhất 8 ký tự, 1 chữ hoa và 1 ký tự đặc biệt' }
                                ]}
                            >
                                <Input.Password placeholder="Mật khẩu" />
                            </Form.Item>

                            <Form.Item
                                label="Xác nhận mật khẩu"
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
                                <Input.Password placeholder="Xác nhận mật khẩu" />
                            </Form.Item>

                            <div className="telegram-note">
                                <i>* Telegram có tác dụng để xác nhận tài khoản khi liên hệ hỗ trợ</i>
                            </div>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={loading} block>
                                    Đăng ký
                                </Button>
                            </Form.Item>

                            <div className="login-link">
                                Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm; 