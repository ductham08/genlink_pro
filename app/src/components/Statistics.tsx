import React, { useState } from 'react';
import MainLayout from './layouts/MainLayout';
import '../styles/Statistics.scss';
import SearchBox from './common/SearchBox';
import { useGetLinksQuery } from '../app/slices/link';
import LinksData from './common/LinksData';

const Statistics: React.FC = () => {
    const [searchText, setSearchText] = useState('');
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });

    const { data: linksData, isLoading } = useGetLinksQuery({ limit: pagination.pageSize });

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
                    <LinksData
                        data={linksData?.data || []}
                        loading={isLoading}
                        pagination={{
                            ...pagination,
                            total: linksData?.data?.length || 0
                        }}
                        onPaginationChange={handleTableChange}
                    />
                </div>
            </div>
        </MainLayout>
    );
};

export default Statistics; 