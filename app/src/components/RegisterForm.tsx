import React, { useState } from 'react';
import { Form, Input, Button, message, Modal } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import axiosInstance from '../config/axios';

const RegisterForm: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(true);

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const response = await axiosInstance.post('/register', values);
            message.success(response.data.message);
            setIsModalVisible(false);
            setTimeout(() => {
                window.location.href = '/login';
            }, 1500);
        } catch (error: any) {
            message.error(error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Đăng ký tài khoản"
            open={isModalVisible}
            footer={null}
            centered
            width={500}
            style={{ top: 20 }}
            maskClosable={false}
            closable={false}
            keyboard={false}
        >
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
                        <Button type="primary" htmlType="submit" className="register-form-button" loading={loading} block>
                            Đăng ký
                        </Button>
                    </Form.Item>
                </div>

                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                    <Link to="/login">Đã có tài khoản? Đăng nhập</Link>
                </div>
            </Form>
        </Modal>
    );
};

export default RegisterForm; 