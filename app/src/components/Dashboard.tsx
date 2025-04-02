import React, { useState } from 'react';
import '../styles/Dashboard.scss';
import MainLayout from './layouts/MainLayout';
import { DollarOutlined} from '@ant-design/icons';
import SearchBox from './common/SearchBox';

const Dashboard: React.FC = () => {
    const [searchText, setSearchText] = useState('');

    return (
        <MainLayout>
            <div className="dashboard">
                <div className="heading-page">
                    <h5>Dashboard</h5>
                </div>
                <div className="dashboard-page">
                    <SearchBox
                        placeholder="Tìm kiếm link..."
                        value={searchText}
                        onChange={setSearchText}
                    />
                    <div className="stats-grid">
                        <div className="stat-card col-md-3 col-6">
                            <div className="stat-content">
                                <div className="stat-header">
                                    <div className="stat-info">
                                        <span>Số link đã tạo</span>
                                        <div className="desc">
                                            <h2>16</h2>
                                            <span className="change positive">+30%</span>
                                        </div>
                                    </div>
                                    <div className="stat-icon sales">
                                        <DollarOutlined />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Dashboard; 