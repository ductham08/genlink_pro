import React from 'react';
import { Table, Space, Button, Modal, message } from 'antd';
import { useDeleteLinkMutation } from '../../app/slices/link';

interface LinkData {
    _id: string;
    redirectUrl: string;
    url: string;
    createdAt: string;
    clicks: number;
}

interface LinksDataProps {
    data: LinkData[];
    loading: boolean;
    pagination?: {
        current: number;
        pageSize: number;
        total: number;
    };
    onPaginationChange?: (pagination: any) => void;
    showActions?: boolean;
}

const LinksData: React.FC<LinksDataProps> = ({ 
    data, 
    loading, 
    pagination, 
    onPaginationChange,
    showActions = true 
}) => {
    const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);
    const [selectedLink, setSelectedLink] = React.useState<LinkData | null>(null);
    const [deleteLink] = useDeleteLinkMutation();

    const handleDelete = async () => {
        if (!selectedLink) return;

        try {
            await deleteLink(selectedLink._id).unwrap();
            message.success('Xóa link thành công!');
            setDeleteModalVisible(false);
            setSelectedLink(null);
        } catch (error: any) {
            message.error(error.data?.message || 'Có lỗi xảy ra khi xóa link!');
        }
    };

    const showDeleteModal = (record: LinkData) => {
        setSelectedLink(record);
        setDeleteModalVisible(true);
    };

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
        ...(showActions ? [{
            title: 'Thao tác',
            key: 'action',
            render: (_: any, record: LinkData) => (
                <Space size="middle">
                    <Button type="link" onClick={() => window.open(record.url, '_blank')}>
                        Mở
                    </Button>
                    <Button type="link" danger onClick={() => showDeleteModal(record)}>
                        Xóa
                    </Button>
                </Space>
            )
        }] : [])
    ];

    return (
        <>
            <Table
                columns={columns}
                dataSource={data}
                rowKey="_id"
                pagination={pagination ? pagination : false}
                loading={loading}
                onChange={onPaginationChange}
            />

            <Modal
                title="Xác nhận xóa"
                open={deleteModalVisible}
                onOk={handleDelete}
                onCancel={() => {
                    setDeleteModalVisible(false);
                    setSelectedLink(null);
                }}
                okText="Xóa"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
            >
                <p>Bạn có chắc chắn muốn xóa link này?</p>
            </Modal>
        </>
    );
};

export default LinksData;