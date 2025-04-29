import React, { useState } from 'react';
import { Table, Space, Button, Modal, message, Input } from 'antd';
import { useDeleteLinkMutation, useEditLinkMutation } from '../../app/slices/link';
import { LinkOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
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
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [selectedLink, setSelectedLink] = useState<LinkData | null>(null);
    const [newSuffix, setNewSuffix] = useState('');
    const [deleteLink] = useDeleteLinkMutation();
    const [editLink] = useEditLinkMutation();

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

    const handleEdit = async () => {
        if (!selectedLink || !newSuffix) return;

        try {
            await editLink({ id: selectedLink._id, customSuffix: newSuffix }).unwrap();
            message.success('Cập nhật link thành công!');
            setEditModalVisible(false);
            setSelectedLink(null);
            setNewSuffix('');
        } catch (error: any) {
            message.error(error.data?.message || 'Có lỗi xảy ra khi cập nhật link!');
        }
    };

    const showDeleteModal = (record: LinkData) => {
        setSelectedLink(record);
        setDeleteModalVisible(true);
    };

    const showEditModal = (record: LinkData) => {
        setSelectedLink(record);
        setNewSuffix(record.url.split('/').pop() || '');
        setEditModalVisible(true);
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
                    <span 
                        className="link-text"
                        onClick={() => handleCopyLink(text)}
                    >
                        {text}
                    </span>
                    <div className="link-actions">
                        <Button 
                            type="text" 
                            icon={<LinkOutlined />} 
                            onClick={() => window.open(text, '_blank')}
                        />
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
                    <span 
                        className="link-text"
                        onClick={() => handleCopyLink(text)}
                    >
                        {text}
                    </span>
                    <div className="link-actions">
                        <Button 
                            type="text" 
                            icon={<LinkOutlined />} 
                            onClick={() => window.open(text, '_blank')}
                        />
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
                    <Button 
                        type="link" 
                        icon={<EditOutlined />} 
                        onClick={() => showEditModal(record)}
                        />
                    <Button 
                        type="link" 
                        icon={<DeleteOutlined />} 
                        danger 
                        onClick={() => showDeleteModal(record)}
                    />
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

            <Modal
                title="Chỉnh sửa đuôi link"
                open={editModalVisible}
                onOk={handleEdit}
                onCancel={() => {
                    setEditModalVisible(false);
                    setSelectedLink(null);
                    setNewSuffix('');
                }}
                okText="Cập nhật"
                cancelText="Hủy"
            >
                <Input
                    value={newSuffix}
                    onChange={(e) => setNewSuffix(e.target.value)}
                    placeholder="Nhập đuôi link mới"
                />
                <p style={{ marginTop: 8, color: '#666' }}>
                    Chỉ được phép sử dụng chữ, số và dấu gạch ngang (-), từ 4-35 ký tự
                </p>
            </Modal>
        </div>
    );
};

export default LinksData;