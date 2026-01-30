import { useEffect } from 'react';
import { Modal } from 'bootstrap';

export const TipsModal = ({ modalRef, title, btnClass = 'btn-primary' }) => {
  // Modal 初始化
  useEffect(() => {
    if (modalRef.current && !modalRef.current._instance) {
      modalRef.current = new Modal(modalRef.current, {
        keyboard: false,
        backdrop: 'static',
      });
    }
  }, [modalRef]);

  return (
    <div className="modal fade" tabIndex="-1" ref={modalRef}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
              取消
            </button>
            <button type="button" className={`btn ${btnClass}`}>
              刪除
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
