import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    DashboardOutlined,
    LinkOutlined,
    SettingOutlined
} from '@ant-design/icons';

const { Sider } = Layout;

const Sidebar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        {
            key: '/dashboard',
            icon: <DashboardOutlined />,
            label: 'Dashboard'
        },
        {
            key: '/create-link',
            icon: <LinkOutlined />,
            label: 'Tạo Link'
        },
        {
            key: '/settings',
            icon: <SettingOutlined />,
            label: 'Cài đặt'
        }
    ];

    return (
        <Sider className="main-sider" >
            <Menu
                mode="inline"
                selectedKeys={[location.pathname]}
                items={menuItems}
                onClick={({ key }) => navigate(key)}
            />
        </Sider>
    );
};

export default Sidebar; 