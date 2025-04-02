import React, { useState } from 'react';
import { Form, Input, Button, Upload, message, Modal } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import LinkNotification from '../LinkNotification';

const { TextArea } = Input;

interface CreateLinkModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreateLinkModal: React.FC<CreateLinkModalProps> = ({ isOpen, onClose }) => {
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
            onClose();
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
        <Modal
            title="Tạo link"
            open={isOpen}
            onCancel={onClose}
            width={600}
            footer={null}
        >
            <div className="create-link-modal">
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
        </Modal>
    );
};

export default CreateLinkModal; 