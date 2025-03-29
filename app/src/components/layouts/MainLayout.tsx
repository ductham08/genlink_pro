import React from 'react';
import { Layout } from 'antd';
import '../../styles/MainLayout.scss';
import Sidebar from './Sidebar';

const { Content } = Layout;

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <Layout className='main-layout'>
            <Sidebar/>
            <Layout className='main-content'>
                <Content >
                    <Content>
                        <div className="scrollable-content">
                            {children}
                        </div>
                    </Content>
                </Content>
            </Layout>
        </Layout>
    );
};

export default MainLayout; 