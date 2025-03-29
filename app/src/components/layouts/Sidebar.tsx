import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    DashboardOutlined,
    LinkOutlined,
    SettingOutlined
} from '@ant-design/icons';
import '../../styles/Sidebar.scss';

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
        }
    ];

    return (
        <Sider 
            theme='light' 
            className="main-sider" 
            style={{
                height: '100vh',
                overflow: 'auto',
                position: 'fixed',
                left: 0,
                top: 0,
                bottom: 0,
                padding: '1.5rem 1.5rem 1.5rem 2rem',
            }}
            width={250}
        >
            <Menu
                mode="inline"
                selectedKeys={[location.pathname]}
                items={menuItems}
                onClick={({ key }) => navigate(key)}
                style={{
                    border: 'none',
                }}
                className="sidebar-menu"
            />
        </Sider>
    );
};

export default Sidebar; 