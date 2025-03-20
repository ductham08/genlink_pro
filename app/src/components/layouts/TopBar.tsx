import React from 'react';
import { Layout, Avatar, Dropdown, Badge } from 'antd';
import { UserOutlined, BellOutlined, LogoutOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';

const { Header } = Layout;

const TopBar: React.FC = () => {
    const userMenuItems: MenuProps['items'] = [
        {
            key: 'profile',
            label: 'Thông tin cá nhân',
            icon: <UserOutlined />
        },
        {
            type: 'divider'
        },
        {
            key: 'logout',
            label: 'Đăng xuất',
            icon: <LogoutOutlined />,
            danger: true
        }
    ];

    return (
        <Header className="top-bar">
            <div className="top-bar-left">
                
            </div>
            <div className="top-bar-right">
                <Badge count={5} className="notification-badge">
                    <BellOutlined className="notification-icon" />
                </Badge>
                <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                    <div className="user-info">
                        <span className="username">John Doe</span>
                        <Avatar icon={<UserOutlined />} />
                    </div>
                </Dropdown>
            </div>
        </Header>
    );
};

export default TopBar; 