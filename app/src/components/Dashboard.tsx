import React, { useState, useEffect } from 'react';
import { Line } from '@ant-design/plots';
import '../styles/Dashboard.scss';
import MainLayout from './layouts/MainLayout';
import { AppstoreOutlined, BlockOutlined, ProductOutlined, TeamOutlined} from '@ant-design/icons';
import SearchBox from './common/SearchBox';

const Dashboard: React.FC = () => {
    const [searchText, setSearchText] = useState('');

    // Mock data - replace with actual API calls
    const clickData = [
        { date: '2024-03-01', clicks: 120 },
        { date: '2024-03-02', clicks: 150 },
        { date: '2024-03-03', clicks: 180 },
        { date: '2024-03-04', clicks: 220 },
        { date: '2024-03-05', clicks: 190 },
        { date: '2024-03-06', clicks: 250 },
        { date: '2024-03-07', clicks: 280 },
        // ... add more data points
    ];

    const linkCreationData = [
        { date: '2024-03-01', links: 5 },
        { date: '2024-03-02', links: 8 },
        { date: '2024-03-03', links: 12 },
        { date: '2024-03-04', links: 7 },
        { date: '2024-03-05', links: 10 },
        { date: '2024-03-06', links: 15 },
        { date: '2024-03-07', links: 9 },
        // ... add more data points
    ];

    const clickConfig = {
        data: clickData,
        xField: 'date',
        yField: 'clicks',
        smooth: true,
        color: '#1890ff',
        point: {
            size: 4,
            shape: 'circle',
            style: {
                fill: 'white',
                stroke: '#1890ff',
                lineWidth: 2,
            },
        },
        tooltip: {
            showMarkers: false,
        },
        state: {
            active: {
                style: {
                    shadowBlur: 4,
                    stroke: '#000',
                    fill: 'red',
                },
            },
        },
        interactions: [{ type: 'marker-active' }],
    };

    const linkConfig = {
        data: linkCreationData,
        xField: 'date',
        yField: 'links',
        smooth: true,
        color: '#52c41a',
        point: {
            size: 4,
            shape: 'circle',
            style: {
                fill: 'white',
                stroke: '#52c41a',
                lineWidth: 2,
            },
        },
        tooltip: {
            showMarkers: false,
        },
        state: {
            active: {
                style: {
                    shadowBlur: 4,
                    stroke: '#000',
                    fill: 'red',
                },
            },
        },
        interactions: [{ type: 'marker-active' }],
    };

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
                                        <AppstoreOutlined />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="stat-card col-md-3 col-6">
                            <div className="stat-content">
                                <div className="stat-header">
                                    <div className="stat-info">
                                        <span>Link tạo trong ngày</span>
                                        <div className="desc">
                                            <h2>16</h2>
                                            <span className="change positive">+30%</span>
                                        </div>
                                    </div>
                                    <div className="stat-icon sales">
                                        <BlockOutlined />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="stat-card col-md-3 col-6">
                            <div className="stat-content">
                                <div className="stat-header">
                                    <div className="stat-info">
                                        <span>Số lượt click</span>
                                        <div className="desc">
                                            <h2>16</h2>
                                            <span className="change positive">+30%</span>
                                        </div>
                                    </div>
                                    <div className="stat-icon sales">
                                        <TeamOutlined />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="stat-card col-md-3 col-6">
                            <div className="stat-content">
                                <div className="stat-header">
                                    <div className="stat-info">
                                        <span>Lượt tạo link còn lại</span>
                                        <div className="desc">
                                            <h2>16</h2>
                                            <span className="change positive">+30%</span>
                                        </div>
                                    </div>
                                    <div className="stat-icon sales">
                                        <ProductOutlined />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="content-chart">
                        <div className="statistics-charts">
                            <div className="chart-card">
                                <div className="chart-header">
                                    <h2>Clicks</h2>
                                    <p className="subtitle">Số lượt click trong 7 ngày gần nhất</p>
                                </div>
                                <div className="chart-content">
                                    <Line {...clickConfig} />
                                </div>
                                <hr />
                                <div className="chart-footer">
                                    <div className="item-chart">
                                        <h2>3.6k</h2>
                                        <p className="subtitle">Clicks</p>
                                    </div>
                                    <div className="item-chart">
                                        <h2>46</h2>
                                        <p className="subtitle">Links</p>
                                    </div>
                                </div>
                            </div>

                            <div className="chart-card">
                                <div className="chart-header">
                                    <h2>Links</h2>
                                    <p className="subtitle">Số link được tạo trong 7 ngày gần nhất</p>
                                </div>
                                <div className="chart-content">
                                    <Line {...linkConfig} />
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