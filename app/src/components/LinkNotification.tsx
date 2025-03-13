import React, { useState } from 'react';
import { Typography, Button, Tooltip, Modal } from 'antd';
import { CopyOutlined, LinkOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

interface LinkNotificationProps {
  url: string;
  onClose: () => void;
}

const LinkNotification: React.FC<LinkNotificationProps> = ({ url, onClose }) => {
  const [isModalVisible, setIsModalVisible] = useState(true);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url).then(() => {
      alert('Đã sao chép liên kết vào clipboard!');
    }).catch((err) => {
      console.error('Không thể sao chép liên kết:', err);
      alert('Không thể sao chép liên kết. Vui lòng thử lại.');
    });
  };

  const handleOpenLink = () => {
    window.open(url, '_blank');
  };

  const handleOk = () => {
    setIsModalVisible(false);
    onClose();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    onClose();
  };

  return (
    <Modal
      title="Trang Landing đã được tạo thành công!"
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Đóng
        </Button>,
      ]}
    >
      <Paragraph>
        Bạn có thể truy cập tại: <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
      </Paragraph>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
        <Tooltip title="Sao chép liên kết">
          <Button onClick={handleCopyLink} icon={<CopyOutlined />}>
            Sao chép
          </Button>
        </Tooltip>
        <Tooltip title="Mở liên kết">
          <Button onClick={handleOpenLink} icon={<LinkOutlined />}>
            Mở
          </Button>
        </Tooltip>
      </div>
    </Modal>
  );
};

export default LinkNotification; 