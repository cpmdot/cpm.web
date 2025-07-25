// client/src/pages/ResetPassword.jsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import ResetPasswordForm from '../components/forms/ResetPasswordForm';
import ErrorModal from '../components/common/ErrorModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useLanguage } from '../context/LanguageContext';

const ResetPassword = () => {
  const { t } = useLanguage();
  const { token } = useParams();
  const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleMessage = (text, type) => {
    setStatusMessage({ text, type });
  };

  return (
    <div className="reset-password-page">
      {isLoading && <LoadingSpinner />}
      {statusMessage.text && (
        <div className={`alert ${statusMessage.type}`}>
          {statusMessage.text}
        </div>
      )}
      {!token ? (
        <ErrorModal message={t('no-reset-token-provided')} onClose={() => { /* handle closing or redirect */ }} />
      ) : (
        <ResetPasswordForm token={token} onMessage={handleMessage} />
      )}
    </div>
  );
};

export default ResetPassword;