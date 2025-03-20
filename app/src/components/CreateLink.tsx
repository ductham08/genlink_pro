import React, { useState } from 'react';
import { Form, Input, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import LinkNotification from './LinkNotification';
import MainLayout from './layouts/MainLayout';

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
            // Create preview URL for the image
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
            <div className="container" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', margin: '0' }}>
                <div className="col-md-6 col-12 content-form">
                    <Form
                        form={form}
                        name="landing-generator"
                        onFinish={onFinish}
                        layout="vertical"
                        className='form-landing'
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

                {/* Preview Section */}
                <div className="col-md-4 col-12">
                    <div className="preview-section" style={{
                        width: '100%',
                        borderRadius: '8px',
                        position: 'sticky',
                        top: '20px',
                        height: 'fit-content'
                    }}>
                        <h6 style={{ marginBottom: '16px', color: '#65676B', fontWeight: 600 }}>Preview trên Messenger</h6>

                        {/* Messenger Chat Preview */}
                        <div style={{
                            backgroundColor: 'rgba(0, 0, 0, 0.1)',
                            borderRadius: '8px',
                            padding: '12px',
                            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                            paddingTop: "65px"
                        }}>
                            {/* Chat Messages Container */}
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '2px'
                            }}>
                                {/* Link Preview Message */}
                                <div style={{
                                    alignSelf: 'flex-end',
                                    maxWidth: '85%',
                                    borderRadius: '18px',
                                    padding: '8px',
                                    marginBottom: '2px'
                                }}>
                                    {/* Link Preview Card */}
                                    <div style={{
                                        backgroundColor: 'white',
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                    }}>
                                        {previewData.imageUrl && (
                                            <div style={{
                                                width: '100%',
                                                height: '150px',
                                                overflow: 'hidden',
                                                position: 'relative',
                                                backgroundColor: '#F0F2F5'
                                            }}>
                                                <img
                                                    src={previewData.imageUrl}
                                                    alt="Preview"
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover'
                                                    }}
                                                />
                                            </div>
                                        )}
                                        <div style={{
                                            padding: '8px',
                                            borderTop: previewData.imageUrl ? '1px solid #E4E6EB' : 'none'
                                        }}>
                                            <div style={{
                                                fontSize: '14px',
                                                fontWeight: '500',
                                                color: '#050505',
                                                marginBottom: '4px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                lineHeight: '18px'
                                            }}>
                                                {previewData.title || 'Tiêu đề sẽ hiển thị ở đây'}
                                            </div>
                                            <div style={{
                                                fontSize: '13px',
                                                color: '#65676B',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                lineHeight: '16px'
                                            }}>
                                                {previewData.description || 'Mô tả sẽ hiển thị ở đây'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Seen Status */}
                                <div style={{
                                    alignSelf: 'flex-end',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    marginTop: '2px'
                                }}>
                                    <div style={{
                                        width: '12px',
                                        height: '12px',
                                        borderRadius: '50%',
                                        backgroundColor: '#0084ff',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <img
                                            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='white'%3E%3Cpath d='M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z'/%3E%3C/svg%3E"
                                            alt="Seen"
                                            style={{
                                                width: '8px',
                                                height: '8px'
                                            }}
                                        />
                                    </div>
                                    <span style={{ fontSize: '11px', color: '#65676B' }}>Đã xem</span>
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