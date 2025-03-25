import React from 'react';
import { Layout, Avatar, Dropdown, Button } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Header } = Layout;

const TopBar: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // TODO: Implement logout logic
        navigate('/login');
    };

    const userMenuItems = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: 'Thông tin cá nhân'
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Đăng xuất',
            onClick: handleLogout
        }
    ];

    return (
        <Header className="main-header">
            <div className="header-right">
                <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                    <div className="user-info">
                        <Avatar icon={<UserOutlined />} />
                        <span className="username">Admin</span>
                    </div>
                </Dropdown>
            </div>
        </Header>
    );
};

export default TopBar; 