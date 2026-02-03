import { Modal, Button } from 'antd';

const TipsModal = ({ isOpen = false, onClose = () => {}, title = '', onConfirm = () => {}, loading = false }) => {
  return (
    <Modal
      title={title}
      open={isOpen}
      onCancel={onClose}
      maskClosable={false}
      footer={[
        <Button key="cancel" onClick={onClose} disabled={loading}>
          取消
        </Button>,
        <Button key="delete" type="primary" danger loading={loading} onClick={onConfirm}>
          刪除
        </Button>,
      ]}
    />
  );
};

export default TipsModal;
