// client/src/components/forms/ForgotPasswordForm.jsx
import React, { useState, useCallback } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { forgotPassword } from '../../api/api';

const ForgotPasswordForm = ({ onCancelClick, onSuccess, onError }) => {
  const { t } = useLanguage();
  const [emailPhone, setEmailPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleRequestSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    if (!emailPhone.trim()) {
      setError(t('forgot-all-fields-required'));
      setLoading(false);
      return;
    }

    try {
      const response = await forgotPassword({ email: emailPhone });
      setSuccessMessage(response.message || t('forgot-password-success-message'));
      if (onSuccess) onSuccess(response.message || t('forgot-password-success-message'));
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || t('forgot-password-failed-generic');
      setError(errMsg);
      if (onError) onError(errMsg);
    } finally {
      setLoading(false);
    }
  }, [emailPhone, t, onSuccess, onError]);

  return (
    <div className="forgotten-container">
      <form onSubmit={handleRequestSubmit}>
        <div className="forgotten-title">{t('forgot-password-title')}</div>
        <hr className="subtitle-divider" />
        <div className="forgotten-subtitle">{t('forgot-password-subtitle')}</div>

        <input
          type="text"
          id="forgotten-email-phone"
          placeholder={t('email-phone-placeholder-forgot')}
          value={emailPhone}
          onChange={(e) => setEmailPhone(e.target.value)}
          required
        />
        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}
        <hr className="form-divider" />
        <div className="button-row">
          <button type="button" className="cancel-button" onClick={onCancelClick} disabled={loading}>{t('cancel-button')}</button>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? t('sending-request') : t('forgot-password-submit-button')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;