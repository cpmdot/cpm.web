// client/src/components/common/ErrorModal.jsx
import React from 'react';
// - import ResetPasswordForm from '../components/forms/ResetPasswordForm'; // ErrorModal should not import this
// - import ErrorModal from '../components/common/ErrorModal'; // Circular import
// - import LoadingSpinner from '../components/common/LoadingSpinner'; // ErrorModal should not import this
// - import { useLanguage } from '../context/LanguageContext'; // ErrorModal should not import this

const ErrorModal = ({ message, onClose, title = 'Error', buttonText = 'Close' }) => {
  if (!message) {
    return null; // Don't render if there's no message
  }

  return (
    <div className="modal-backdrop">
      <div className="error-modal">
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <p>{message}</p>
        </div>
        <div className="modal-footer">
          <button className="modal-button" onClick={onClose}>
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;