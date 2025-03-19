import React, { useState } from 'react';
import { Form, Input, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import LinkNotification from './LinkNotification';
import axiosInstance from '../config/axios';

const { TextArea } = Input;

const CreateLink: React.FC = () => {
    const [form] = Form.useForm();
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);

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

            const response = await axiosInstance.post(`/generate-landing`, formData, {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            });

            setGeneratedUrl(response.data.url);
            form.resetFields();
            setImageFile(null);
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
            return false; // Ngăn chặn tải lên tự động
        },
        maxCount: 1,
    };

    return (
        <div className="container">
            <div className="col-md-6 col-12 content-form">
                <Form
                    form={form}
                    name="landing-generator"
                    onFinish={onFinish}
                    layout="vertical"
                    className='form-landing'
                >
                    <div className="item-form">
                        <i>Website tạo ra nhằm mục đích tạo ra một link có thể chuyển hướng tới link bất kỳ.</i>
                        <br />
                        <i>Link sẽ được tạo ra dạng: https://link-landing.com/build/id-link</i>
                        <hr />
                        <i>Anh em có lòng góp gạo lúa vui lòng gửi về số tài khoản sau:</i>
                        <br />
                        <i style={{ cursor: 'pointer' }} onClick={() => navigator.clipboard.writeText('20023333388888')}>Số tài khoản: 20023333388888 (Click để copy)</i>
                        <br />
                        <i>Ngân hàng: Mb Bank</i>
                        <br />
                        <i>Chủ tài khoản: Nguyễn Đức Thắm</i>
                        <br />
                        <i style={{ color: 'red' }}>* Do server có giới hạn nên anh em hạn chế tạo link quá nhiều, nếu có thắc mắc vui lòng liên hệ <b><a style={{ color: 'red', textDecoration: 'none' }} href="https://t.me/otis_cua" target="_blank" rel="noopener noreferrer">otis cua</a></b> !</i>
                    </div>
                    <hr />

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
                                Tạo Trang Landing
                            </Button>
                        </Form.Item>
                    </div>
                </Form>

                {generatedUrl && (
                    <LinkNotification url={generatedUrl} onClose={() => setGeneratedUrl(null)} />
                )}
            </div>
        </div>
    );
};

export default CreateLink; 