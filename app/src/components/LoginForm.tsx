import React, { useState } from 'react';
import { Form, Input, Button, message, Modal } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import axiosInstance from '../config/axios';

const LoginForm: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(true);

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const response = await axiosInstance.post('/login', values);
            message.success(response.data.message);
            sessionStorage.setItem('token', response.data.token);
            setIsModalVisible(false);
            setTimeout(() => {
                window.location.href = '/';
            }, 500);
        } catch (error: any) {
            message.error(error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Đăng nhập"
            open={isModalVisible}
            footer={null}
            centered
            width={400} 
            style={{ top: 20 }}
            maskClosable={false}
            closable={false}
            keyboard={false}
        >
            <Form
                name="normal_login"
                className="login-form"
                initialValues={{ remember: true }}
                onFinish={onFinish}
            >
                <div className="item-form">
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Tên đăng nhập" />
                    </Form.Item>
                </div>
                <div className="item-form">
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
                </div>

                <div className="item-form-submit">
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button" loading={loading} block>
                            Đăng nhập
                        </Button>
                    </Form.Item>
                </div>

                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                    <Link to="/register" style={{ marginRight: '15px' }}>Đăng ký tài khoản</Link>
                </div>
            </Form>
        </Modal>
    );
};

export default LoginForm; 