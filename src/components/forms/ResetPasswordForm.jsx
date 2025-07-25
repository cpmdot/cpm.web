// client/src/components/forms/ResetPasswordForm.jsx
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { resetPassword } from '../../api/api';
import { useLanguage } from '../../context/LanguageContext';

const ResetPasswordForm = ({ token, onMessage }) => {
  const { t } = useLanguage();
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    if (newPassword !== confirmNewPassword) {
      setError(t('passwords-do-not-match'));
      setLoading(false);
      return;
    }

    if (newPassword.length < 8 || !/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword) || !/[!@#$%^&*()]/.test(newPassword)) {
        setError(t('password-strength-requirements'));
        setLoading(false);
        return;
    }

    try {
      const response = await resetPassword(token, { newPassword });
      setSuccessMessage(response.message || t('reset-password-success-message'));
      if (onMessage) onMessage(response.message || t('reset-password-success-message'), 'success');
      
      setTimeout(() => {
        history.push('/login');
      }, 3000);
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || t('reset-password-failed-generic');
      setError(errMsg);
      if (onMessage) onMessage(errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="reset-password-form">
      <h3>{t('set-new-password-title')}</h3>
      <div className="form-group">
        <label htmlFor="newPassword">{t('new-password-label')}</label>
        <input
          type="password"
          id="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder={t('new-password-placeholder-reset')}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="confirmNewPassword">{t('confirm-new-password-label')}</label>
        <input
          type="password"
          id="confirmNewPassword"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          placeholder={t('confirm-new-password-placeholder')}
          required
        />
      </div>
      {loading && <p>{t('resetting-message')}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      {error && <p className="error-message">{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? t('resetting-button') : t('reset-password-submit-button')}
      </button>
    </form>
  );
};

export default ResetPasswordForm;