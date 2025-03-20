import React from 'react';
import { Layout, Menu } from 'antd';
import {
    HomeOutlined,
    LinkOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Sider } = Layout;

interface SidebarProps {
    collapsed: boolean;
    onCollapse: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onCollapse }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        {
            key: '/',
            icon: <HomeOutlined />,
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
            collapsible 
            collapsed={collapsed} 
            onCollapse={onCollapse}
            trigger={null}
            theme="light"
            className="main-sidebar"
            width={250}
            collapsedWidth={80}
        >
            <div className="logo">
                {!collapsed ? 'GenLink Pro' : 'GL'}
            </div>
            <div className="sidebar-content">
                <Menu
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    items={menuItems}
                    onClick={({ key }) => navigate(key)}
                />
                <div className="collapse-button" onClick={() => onCollapse(!collapsed)}>
                    {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                </div>
            </div>
        </Sider>
    );
};

export default Sidebar; 