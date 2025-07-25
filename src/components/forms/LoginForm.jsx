import React, { useState, useCallback } from 'react';
import { useLanguage } from '../../context/LanguageContext'; // Adjust path
import { loginUser } from '../../api/api'; // Import your login API function

const LoginForm = ({ onForgotPasswordClick, onCreateAccountClick, onSuccess, onError }) => {
  const { t } = useLanguage();
  const [emailPhone, setEmailPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    if (!emailPhone.trim() || !password.trim()) {
      setError(t('login-all-fields-required'));
      return;
    }

    try {
      // Call your login API
      const result = await loginUser({ email: emailPhone, password }); // Assuming backend expects 'email'
      // If login successful, trigger success callback
      onSuccess(t('login-success-message')); 
      // Clear form
      setEmailPhone('');
      setPassword('');
    } catch (err) {
      // Handle login error from API
      setError(err.message || t('login-failed-generic'));
      onError(err.message || t('login-failed-generic'));
    }
  }, [emailPhone, password, t, onSuccess, onError]);

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="text"
          id="login-email-phone"
          placeholder={t('email-phone-placeholder-login')}
          value={emailPhone}
          onChange={(e) => setEmailPhone(e.target.value)}
          required
        />
        <input
          type="password"
          id="login-password"
          placeholder={t('password-placeholder-login')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <div className="error-message">{error}</div>}
        <button type="submit" className="login-button">{t('login-button')}</button>
        <div className="forgot-password">
          <a href="#" onClick={onForgotPasswordClick}>{t('forgot-password-link')}</a>
        </div>
        <hr className="form-divider" />
        <button type="button" className="create-account-button" onClick={onCreateAccountClick}>
          {t('create-new-account-button')}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;