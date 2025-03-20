import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Statistic } from 'antd';
import { LinkOutlined, BarChartOutlined, EyeOutlined } from '@ant-design/icons';
import axios from 'axios';
import '../styles/Dashboard.scss';
import MainLayout from './layouts/MainLayout';

interface LinkData {
    url: string;
    redirectUrl: string;
    clicks: number;
    createdAt: string;
}

const Dashboard: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalLinks: 0,
        totalClicks: 0,
        remainingLinks: 0
    });
    const [links, setLinks] = useState<LinkData[]>([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [statsResponse, linksResponse] = await Promise.all([
                axios.get('/api/stats', {
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                    }
                }),
                axios.get('/api/links', {
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                    }
                })
            ]);

            setStats(statsResponse.data);
            setLinks(linksResponse.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: 'Link đã tạo',
            dataIndex: 'url',
            key: 'url',
            render: (text: string) => (
                <a href={text} target="_blank" rel="noopener noreferrer">
                    {text}
                </a>
            )
        },
        {
            title: 'Link chuyển hướng',
            dataIndex: 'redirectUrl',
            key: 'redirectUrl',
            render: (text: string) => (
                <a href={text} target="_blank" rel="noopener noreferrer">
                    {text}
                </a>
            )
        },
        {
            title: 'Lượt click',
            dataIndex: 'clicks',
            key: 'clicks',
            sorter: (a: LinkData, b: LinkData) => a.clicks - b.clicks
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text: string) => new Date(text).toLocaleDateString('vi-VN')
        }
    ];

    return (
        <MainLayout>
            <div className="dashboard">
                {/* Statistics Cards */}
                <Row gutter={[16, 16]} className="stats-row">
                    <Col xs={24} sm={8}>
                        <Card loading={loading}>
                            <Statistic
                                title="Tổng số link đã tạo"
                                value={stats.totalLinks}
                                prefix={<LinkOutlined />}
                                valueStyle={{ color: '#1890ff' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card loading={loading}>
                            <Statistic
                                title="Tổng lượt click"
                                value={stats.totalClicks}
                                prefix={<BarChartOutlined />}
                                valueStyle={{ color: '#52c41a' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card loading={loading}>
                            <Statistic
                                title="Số lượt tạo link"
                                value={`${stats.remainingLinks}/10`}
                                prefix={<EyeOutlined />}
                                valueStyle={{ color: '#faad14' }}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Links Table */}
                <Card 
                    title="Danh sách link" 
                    className="links-table"
                    loading={loading}
                >
                    <Table
                        columns={columns}
                        dataSource={links}
                        rowKey="url"
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showTotal: (total) => `Tổng số ${total} link`
                        }}
                    />
                </Card>
            </div>
        </MainLayout>
    );
};

export default Dashboard; 