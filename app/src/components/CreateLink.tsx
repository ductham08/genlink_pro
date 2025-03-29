import React, { useState } from 'react';
import { Form, Input, Button, Upload, message, Table } from 'antd';
import { UploadOutlined, LinkOutlined } from '@ant-design/icons';
import axios from 'axios';
import LinkNotification from './LinkNotification';
import MainLayout from './layouts/MainLayout';
import '../styles/CreateLink.scss';

const { TextArea } = Input;

const CreateLink: React.FC = () => {
    const [form] = Form.useForm();
    const [imageFile, setImageFile] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
    const [previewData, setPreviewData] = useState({
        title: '',
        description: '',
        imageUrl: '',
    });

    // Mock data for recent links - replace with actual API call
    const recentLinks = [
        {
            key: '1',
            shortLink: 'https://short.link/abc123',
            originalLink: 'https://example.com/very-long-original-link',
            clicks: 156,
            createdAt: '2024-03-20 15:30',
        },
        {
            key: '2',
            shortLink: 'https://short.link/def456',
            originalLink: 'https://example.com/another-long-link',
            clicks: 89,
            createdAt: '2024-03-20 14:15',
        },
    ];

    const columns = [
        {
            title: 'Link bọc',
            dataIndex: 'shortLink',
            key: 'shortLink',
            render: (text: string) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <LinkOutlined style={{ color: '#1890ff' }} />
                    <a href={text} target="_blank" rel="noopener noreferrer">
                        {text}
                    </a>
                </div>
            ),
        },
        {
            title: 'Link gốc',
            dataIndex: 'originalLink',
            key: 'originalLink',
            render: (text: string) => (
                <div className="original-link-cell">
                    <span>{text}</span>
                </div>
            ),
        },
        {
            title: 'Lượt click',
            dataIndex: 'clicks',
            key: 'clicks',
            width: 120,
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 180,
        },
    ];

    const onFinish = async (values: any) => {
        if (!imageFile) {
            message.error('Vui lòng chọn ảnh trước!');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('title', values.title);
            formData.append('description', values.description);
            formData.append('redirectUrl', values.redirectUrl);
            formData.append('image', imageFile);

            const response = await axios.post(`/api/generate-landing`, formData, {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            });

            setGeneratedUrl(response.data.url);
            form.resetFields();
            setImageFile(null);
            setPreviewData({
                title: '',
                description: '',
                imageUrl: '',
            });
        } catch (error: any) {
            message.error(error?.response?.data?.message || 'Không thể tạo trang landing');
        } finally {
            setLoading(false);
        }
    };

    const uploadProps = {
        beforeUpload: (file: any) => {
            const isImage = file.type.startsWith('image/');
            if (!isImage) {
                message.error('Bạn chỉ có thể tải lên các tệp ảnh!');
                return false;
            }
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewData(prev => ({
                    ...prev,
                    imageUrl: e.target?.result as string
                }));
            };
            reader.readAsDataURL(file);
            return false;
        },
        maxCount: 1,
    };

    const handleFormChange = () => {
        const values = form.getFieldsValue();
        setPreviewData(prev => ({
            ...prev,
            title: values.title || '',
            description: values.description || ''
        }));
    };

    return (
        <MainLayout>
            <div className="create-link-page">
                <div className="heading-page">
                    <h5>Tạo link</h5>
                </div>
                <div className="content-wrapper">
                    <div className="form-section">
                        <Form
                            form={form}
                            name="landing-generator"
                            onFinish={onFinish}
                            layout="vertical"
                            className="form-landing"
                            onValuesChange={handleFormChange}
                        >
                            <div className="item-form">
                                <Form.Item
                                    name="title"
                                    label="Tiêu đề"
                                    rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
                                >
                                    <Input placeholder="Nhập tiêu đề trang web..." />
                                </Form.Item>
                                <i>Tiêu đề sẽ hiển thị khi chia sẻ trang web</i>
                            </div>

                            <div className="item-form">
                                <Form.Item
                                    name="description"
                                    label="Mô tả"
                                    rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                                >
                                    <TextArea
                                        rows={4}
                                        placeholder="Nhập mô tả trang web..."
                                    />
                                </Form.Item>
                                <i>Đoạn mô tả sẽ hiển thị khi chia sẻ trang web</i>
                            </div>

                            <div className="item-form">
                                <Form.Item
                                    name="redirectUrl"
                                    label="URL Chuyển Hướng"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập URL chuyển hướng!' },
                                        { type: 'url', message: 'Vui lòng nhập một URL hợp lệ!' }
                                    ]}
                                >
                                    <Input placeholder="https://example.com" />
                                </Form.Item>
                                <i>Url của trang web muốn chuyển hướng tới</i>
                            </div>

                            <div className="item-form">
                                <Form.Item
                                    label="Ảnh meta"
                                    required
                                >
                                    <Upload {...uploadProps}>
                                        <Button icon={<UploadOutlined />}>Chọn Ảnh</Button>
                                    </Upload>
                                </Form.Item>
                                <i>Kích thước chuẩn là 1200x600px, kích thước tối đa là 5MB</i>
                            </div>

                            <div className="item-form-submit">
                                <Form.Item>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        loading={loading}
                                        block
                                    >
                                        Tạo Landing
                                    </Button>
                                </Form.Item>
                            </div>
                        </Form>

                        {generatedUrl && (
                            <LinkNotification url={generatedUrl} onClose={() => setGeneratedUrl(null)} />
                        )}
                    </div>

                    <div className="content-right">
                        
                        <div className="recent-links-section">
                            <Table 
                                dataSource={recentLinks} 
                                columns={columns} 
                                pagination={false}
                                size="small"
                                className="recent-links-table"
                            />
                        </div>
                        <div className="preview-section col-md-3 col-12">
                            <h6>Preview trên Messenger</h6>
                            <div className="messenger-preview">
                                <div className="message-container">
                                    <div className="link-preview">
                                        {previewData.imageUrl && (
                                            <div className="preview-image">
                                                <img src={previewData.imageUrl} alt="Preview" />
                                            </div>
                                        )}
                                        <div className="preview-content">
                                            <div className="preview-title">
                                                {previewData.title || 'Tiêu đề sẽ hiển thị ở đây'}
                                            </div>
                                            <div className="preview-description">
                                                {previewData.description || 'Mô tả sẽ hiển thị ở đây'}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="seen-status">
                                        <div className="seen-icon">
                                            <img
                                                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='white'%3E%3Cpath d='M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z'/%3E%3C/svg%3E"
                                                alt="Seen"
                                            />
                                        </div>
                                        <span>Đã xem</span>
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

export default CreateLink; 