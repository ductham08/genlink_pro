import React, { useState } from 'react';
import { Form, Input, Button, Upload, message, Modal, Image } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import LinkNotification from '../LinkNotification';
import { useGenerateLandingMutation } from '../../app/slices/link';
import '../../styles/CreateLink.scss';

const { TextArea } = Input;

interface CreateLinkModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreateLinkModal: React.FC<CreateLinkModalProps> = ({ isOpen, onClose }) => {
    const [form] = Form.useForm();
    const [imageFile, setImageFile] = useState<any>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);

    const [generateLanding] = useGenerateLandingMutation();

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

            const response = await generateLanding(formData).unwrap();

            setGeneratedUrl(response.url);
            form.resetFields();
            onClose();
        } catch (error: any) {
            message.error(error?.data?.message || 'Không thể tạo trang landing');
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (file: any) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error('Bạn chỉ có thể tải lên các tệp ảnh!');
            return false;
        }

        // Tạo URL preview cho ảnh
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        setImageFile(file);
        return false;
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview(null);
    };

    const uploadProps = {
        beforeUpload: handleImageChange,
        maxCount: 1,
        showUploadList: false
    };

    return (
        <>
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
                        autoComplete="off"
                    >
                        <div className="item-form">
                            <Form.Item
                                name="title"
                                label="Tiêu đề link bọc"
                                rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
                            >
                                <Input allowClear placeholder="Nhập tiêu đề trang web..." />
                            </Form.Item>
                        </div>

                        <div className="item-form">
                            <Form.Item
                                name="redirectUrl"
                                label="Url cần bọc"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập URL chuyển hướng!' },
                                    { type: 'url', message: 'Vui lòng nhập một URL hợp lệ!' }
                                ]}
                            >
                                <Input allowClear placeholder="https://example.com" />
                            </Form.Item>
                        </div>

                        <div className="item-form">
                            <Form.Item
                                label="Ảnh meta"
                                required
                            >
                                {imagePreview ? (
                                    <div style={{ marginBottom: 16, position: 'relative' }}>
                                        <Image
                                            src={imagePreview}
                                            alt="Preview"
                                            style={{ maxWidth: '100%', maxHeight: 150, objectFit: 'contain' }}
                                        />
                                        <Button
                                            type="text"
                                            danger
                                            icon={<DeleteOutlined />}
                                            onClick={handleRemoveImage}
                                            style={{ position: 'absolute', top: 0, right: 0 }}
                                        />
                                    </div>
                                ) : (
                                    <Upload {...uploadProps}>
                                        <Button icon={<UploadOutlined />}>Chọn Ảnh</Button>
                                    </Upload>
                                )}
                            </Form.Item>
                            <i>Kích thước chuẩn là 1200x600px, kích thước tối đa là 5MB</i>
                        </div>

                        <div className="item-form">
                            <Form.Item
                                name="description"
                                label="Mô tả ngắn"
                                rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                            >
                                <TextArea
                                    allowClear
                                    cols={4}
                                    placeholder="Nhập mô tả ngắn cho link bọc"
                                />
                            </Form.Item>
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

                </div>
            </Modal>
            {generatedUrl && (
                <LinkNotification url={generatedUrl} onClose={() => setGeneratedUrl(null)} />
            )}
        </>
    );
};

export default CreateLinkModal; 