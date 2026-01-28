import { useEffect } from "react";
import { Toast } from "bootstrap";

const Toasts = ({ modalRef, toastMesage, isErrorMessage }) => {
  useEffect(() => {
    if (modalRef.current) {
      modalRef.current = new Toast(modalRef.current);
    }
  }, [modalRef]);

  return (
    <div
      ref={modalRef}
      className="toast position-fixed top-10 end-0"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div
        className={`toast-body alert ${isErrorMessage ? "alert-danger" : "alert-success"} mb-0`}
      >
        {toastMesage}
      </div>
    </div>
  );
};

export default Toasts;
