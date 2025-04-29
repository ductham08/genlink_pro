import React, { useState } from 'react';
import { Typography, Button, Tooltip, Modal, message } from 'antd';
import { CopyOutlined, LinkOutlined } from '@ant-design/icons';

const { Paragraph } = Typography;

interface LinkNotificationProps {
  url: string;
  onClose: () => void;
}

const LinkNotification: React.FC<LinkNotificationProps> = ({ url, onClose }) => {
  const [isModalVisible, setIsModalVisible] = useState(true);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url).then(() => {
      message.success('Đã sao chép liên kết!');
    }).catch(() => {
      message.error('Không thể sao chép liên kết');
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
    <div className='modal-link-notification'>
      <Modal
        title="Tạo link thành công!"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Tooltip key="copy" title="Sao chép liên kết">
            <Button onClick={handleCopyLink} icon={<CopyOutlined />}>
              Sao chép
            </Button>
          </Tooltip>,
          <Tooltip key="open" title="Mở liên kết">
            <Button onClick={handleOpenLink} icon={<LinkOutlined />}>
              Mở
            </Button>
          </Tooltip>,
        ]}
      >
        <Paragraph><a href={url} target="_blank" rel="noopener noreferrer">{url}</a></Paragraph>
      </Modal>
    </div>
  );
};

export default LinkNotification;