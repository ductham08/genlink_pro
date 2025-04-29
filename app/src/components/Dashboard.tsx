import React, { useState } from 'react';
import '../styles/Dashboard.scss';
import MainLayout from './layouts/MainLayout';
import { BarChartOutlined } from '@ant-design/icons';
import SearchBox from './common/SearchBox';
import { useGetCurrentUserQuery } from '../app/slices/userSlice';
import LinksData from './common/LinksData';
import { useGetLinksQuery } from '../app/slices/link';

const Dashboard: React.FC = () => {
    const [searchText, setSearchText] = useState('');

    const { data: linksData, isLoading } = useGetLinksQuery({ limit: 10 });
    const { data: user } = useGetCurrentUserQuery();

    return (
        <MainLayout>
            <div className="dashboard">
                <div className="heading-page">
                    <h5>Trang chủ</h5>
                </div>
                <div className="dashboard-page">
                    <SearchBox
                        placeholder="Tìm kiếm link..."
                        value={searchText}
                        onChange={setSearchText}
                    />
                    <div className="content-dashboard">
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-content">
                                    <div className="stat-icon ">
                                        <BarChartOutlined />
                                        <span>Đã sử dụng</span>
                                    </div>
                                    <div className="desc">
                                        <h2>{user?.plan.usedLinks}/{user?.plan.totalLinks}</h2> 
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="links-data">
                            <LinksData
                                data={linksData?.data || []}
                                loading={isLoading}
                                showActions={false}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Dashboard; 