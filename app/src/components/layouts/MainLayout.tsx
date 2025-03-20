import React, { useState } from 'react';
import { Layout } from 'antd';
import '../../styles/MainLayout.scss';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const { Content } = Layout;

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);

    const handleCollapse = (value: boolean) => {
        setCollapsed(value);
    };

    return (
        <Layout className="main-layout" hasSider>
            <Sidebar collapsed={collapsed} onCollapse={handleCollapse} />
            <Layout className={`site-layout ${collapsed ? 'collapsed' : ''}`}>
                <TopBar />
                <Content className="main-content">
                    <div className="scrollable-content">
                        {children}
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default MainLayout; 