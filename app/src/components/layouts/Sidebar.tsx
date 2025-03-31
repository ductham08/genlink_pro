import React, { useState, useEffect } from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    DashboardOutlined,
    LinkOutlined,
    MenuOutlined,
    CloseOutlined,
    AppstoreAddOutlined,
    ContainerOutlined,
    DotChartOutlined,
    UserOutlined
} from '@ant-design/icons';

const { Sider } = Layout;

const Sidebar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
            if (window.innerWidth > 768) {
                setIsMobileMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const menuItems = [
        {
            key: '/',
            icon: <AppstoreAddOutlined />,
            label: 'Dashboard'
        },
        {
            key: '/create-link',
            icon: <ContainerOutlined />,
            label: 'Tạo Link'
        },
        {
            key: '/analytics',
            icon: <DotChartOutlined />,
            label: 'Thống kê'
        },
        {
            key: '/account',
            icon: <UserOutlined />,
            label: 'Tài khoản'
        }
    ];

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <>
            {isMobile && (
                <>
                    <div className="mobile-header">
                        <div className="logo-placeholder" />
                        <button className="mobile-menu-button" onClick={toggleMobileMenu}>
                            {isMobileMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
                        </button>
                    </div>
                    <div 
                        className={`mobile-menu-overlay ${isMobileMenuOpen ? 'visible' : ''}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                </>
            )}
            <Sider 
                theme='light' 
                className={`main-sider ${isMobileMenuOpen ? 'mobile-sidebar-open' : ''}`}
                style={{
                    height: isMobile ? 'calc(100vh - 60px)' : '100vh',
                    overflow: 'auto',
                    position: 'fixed',
                    ...(isMobile ? {
                        right: 0,
                        top: '60px',
                        padding: '1rem'
                    } : {
                        left: 0,
                        top: 0,
                        bottom: 0,
                        padding: '1.5rem 1.5rem 1.5rem 2rem'
                    }),
                    zIndex: 1000
                }}
                width={isMobile ? 250 : 250}
            >
                <Menu
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    items={menuItems}
                    onClick={({ key }) => {
                        navigate(key);
                        if (isMobile) {
                            setIsMobileMenuOpen(false);
                        }
                    }}
                    style={{
                        border: 'none',
                        height: '100%'
                    }}
                    className="sidebar-menu"
                />
            </Sider>
        </>
    );
};

export default Sidebar; 