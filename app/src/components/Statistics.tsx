import React, { useState, useEffect } from 'react';
import { Table, Space, Button } from 'antd';
import MainLayout from './layouts/MainLayout';
import '../styles/Statistics.scss';
import SearchBox from './common/SearchBox';
import { useGetLinksQuery } from '../app/slices/link';

interface LinkData {
    _id: string;
    redirectUrl: string;
    url: string;
    createdAt: string;
    clicks: number;
}

const Statistics: React.FC = () => {
    const [searchText, setSearchText] = useState('');
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });

    const { data: linksData, isLoading } = useGetLinksQuery();
    
    const columns = [
        {
            title: 'Link gốc',
            dataIndex: 'redirectUrl',
            key: 'redirectUrl',
            render: (text: string) => (
                <a href={text} target="_blank" rel="noopener noreferrer">
                    {text}
                </a>
            )
        },
        {
            title: 'Link bọc',
            dataIndex: 'url',
            key: 'url',
            render: (text: string) => (
                <a href={text} target="_blank" rel="noopener noreferrer">
                    {text}
                </a>
            )
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) => new Date(date).toLocaleDateString('vi-VN')
        },
        {
            title: 'Số lượt click',
            dataIndex: 'clicks',
            key: 'clicks',
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_: any, record: LinkData) => (
                <Space size="middle">
                    <Button type="link" onClick={() => window.open(record.url, '_blank')}>
                        Mở
                    </Button>
                    <Button type="link" danger>
                        Xóa
                    </Button>
                </Space>
            )
        }
    ];

    const handleTableChange = (newPagination: any) => {
        setPagination({
            ...pagination,
            current: newPagination.current,
            pageSize: newPagination.pageSize
        });
    };

    return (
        <MainLayout>
            <div className="statistics">
                <div className="heading-page">
                    <h5>Thống kê</h5>
                </div>
                <div className="statistics-content">
                    <SearchBox
                        placeholder="Tìm kiếm link..."
                        value={searchText}
                        onChange={setSearchText}
                    />
                    <Table
                        columns={columns}
                        dataSource={linksData?.data}
                        rowKey="_id"
                        pagination={{
                            ...pagination,
                            total: linksData?.data?.length || 0
                        }}
                        loading={isLoading}
                        onChange={handleTableChange}
                    />
                </div>
            </div>
        </MainLayout>
    );
};

export default Statistics; 