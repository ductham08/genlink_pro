import React from 'react';
import { Table, Space, Button, Modal, message, Tooltip } from 'antd';
import { useDeleteLinkMutation } from '../../app/slices/link';
import { CopyOutlined, LinkOutlined } from '@ant-design/icons';
import '../../styles/LinksData.scss';

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
    hideActionsOnMobile?: boolean;
}

const LinksData: React.FC<LinksDataProps> = ({ 
    data, 
    loading, 
    pagination, 
    onPaginationChange,
    showActions = true,
    hideActionsOnMobile = false
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

    const handleCopyLink = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            message.success('Đã sao chép liên kết!');
        }).catch(() => {
            message.error('Không thể sao chép liên kết');
        });
    };

    const columns = [
        {
            title: 'Link gốc',
            dataIndex: 'redirectUrl',
            key: 'redirectUrl',
            render: (text: string) => (
                <div className="link-cell">
                    <a href={text} target="_blank" rel="noopener noreferrer">
                        {text}
                    </a>
                    <div className="link-actions">
                        <Tooltip title="Sao chép">
                            <Button 
                                type="text" 
                                icon={<CopyOutlined />} 
                                onClick={() => handleCopyLink(text)}
                            />
                        </Tooltip>
                        <Tooltip title="Mở">
                            <Button 
                                type="text" 
                                icon={<LinkOutlined />} 
                                onClick={() => window.open(text, '_blank')}
                            />
                        </Tooltip>
                    </div>
                </div>
            )
        },
        {
            title: 'Link bọc',
            dataIndex: 'url',
            key: 'url',
            render: (text: string) => (
                <div className="link-cell">
                    <a href={text} target="_blank" rel="noopener noreferrer">
                        {text}
                    </a>
                    <div className="link-actions">
                        <Tooltip title="Sao chép">
                            <Button 
                                type="text" 
                                icon={<CopyOutlined />} 
                                onClick={() => handleCopyLink(text)}
                            />
                        </Tooltip>
                        <Tooltip title="Mở">
                            <Button 
                                type="text" 
                                icon={<LinkOutlined />} 
                                onClick={() => window.open(text, '_blank')}
                            />
                        </Tooltip>
                    </div>
                </div>
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
        <div className={`links-data ${hideActionsOnMobile ? 'hide-actions-mobile' : ''}`}>
            <Table
                columns={columns}
                dataSource={data.map(item => ({
                    ...item,
                    'data-label': columns.find(col => col.dataIndex === item._id)?.title
                }))}
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
        </div>
    );
};

export default LinksData;