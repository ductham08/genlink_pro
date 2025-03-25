import React from 'react';
import { Layout } from 'antd';
import '../../styles/MainLayout.scss';
import Sidebar from './Sidebar';
import { Footer } from 'antd/es/layout/layout';

const { Content } = Layout;

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <Layout hasSider className='main-layout'>
            <Sidebar/>
            <Layout>
                <Content className='main-content'>
                    <Content className="main-content" style={{ margin: '24px 16px 0', overflow: 'initial' }}>
                        <div className="scrollable-content">
                            {children}
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                        Ant Design ©{new Date().getFullYear()} Created by Ant UED
                    </Footer>
                </Content>
            </Layout>
        </Layout>
    );
};

export default MainLayout; 