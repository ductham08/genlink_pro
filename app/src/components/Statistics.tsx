import React, { useState, useEffect } from 'react';
import { Table, Space, Button } from 'antd';
import MainLayout from './layouts/MainLayout';
import '../styles/Statistics.scss';
import SearchBox from './common/SearchBox';

interface LinkData {
    id: string;
    originalUrl: string;
    wrappedUrl: string;
    createdAt: string;
    clickCount: number;
}

const Statistics: React.FC = () => {
    const [links, setLinks] = useState<LinkData[]>([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });
    const [searchText, setSearchText] = useState('');

    // Fetch links data
    const fetchLinks = async (page: number, pageSize: number) => {
        setLoading(true);
        try {
            
        } catch (error) {
            console.error('Error fetching links:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLinks(pagination.current, pagination.pageSize);
    }, [pagination.current, pagination.pageSize]);

    const columns = [
        {
            title: 'Link gốc',
            dataIndex: 'originalUrl',
            key: 'originalUrl',
            render: (text: string) => (
                <a href={text} target="_blank" rel="noopener noreferrer">
                    {text}
                </a>
            )
        },
        {
            title: 'Link bọc',
            dataIndex: 'wrappedUrl',
            key: 'wrappedUrl',
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
            dataIndex: 'clickCount',
            key: 'clickCount',
            sorter: (a: LinkData, b: LinkData) => a.clickCount - b.clickCount
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_: any, record: LinkData) => (
                <Space size="middle">
                    <Button type="link" onClick={() => window.open(record.wrappedUrl, '_blank')}>
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
                        dataSource={links}
                        rowKey="id"
                        pagination={pagination}
                        loading={loading}
                        onChange={handleTableChange}
                    />
                </div>
            </div>
        </MainLayout>
    );
};

export default Statistics; 