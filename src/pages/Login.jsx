// client/src/pages/Login.jsx
import React, { useState, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext'; // This MUST be used within LanguageProvider
import LoginForm from '../components/forms/LoginForm';
import SignupForm from '../components/forms/SignupForm';
import ForgotPasswordForm from '../components/forms/ForgotPasswordForm';
import '../styles/pages/login.css';

import cpmLogo from '../assets/images/cpm_logo.png';

const Login = () => {
  const { t } = useLanguage();

  const [activeView, setActiveView] = useState('login');

  const handleCreateAccountClick = useCallback(() => {
    setActiveView('signup');
    document.title = t('signup-page-title');
  }, [t]);

  const handleForgotPasswordClick = useCallback(() => {
    setActiveView('forgotten');
    document.title = t('forgotten-page-title');
  }, [t]);

  const handleBackToLoginClick = useCallback(() => {
    setActiveView('login');
    document.title = t('login-page-title');
  }, [t]);

  const handleAuthSuccess = useCallback((message) => {
    alert(message); // For now, simple alert
    handleBackToLoginClick();
  }, [handleBackToLoginClick]);

  const handleAuthError = useCallback((message) => {
    alert(message); // For now, simple alert
  }, []);

  return (
    <div className="login-page-container">
      <div id="view-container">
        {activeView === 'login' && (
          <div id="login-view">
            <div className="login-left">
              <img src={cpmLogo} alt={t('toolreg-logo-alt')} className="login-logo-img" />
              <div className="tagline">{t('login-tagline')}</div>
            </div>
            <div className="login-right">
              <LoginForm
                onForgotPasswordClick={handleForgotPasswordClick}
                onCreateAccountClick={handleCreateAccountClick}
                onSuccess={handleAuthSuccess}
                onError={handleAuthError}
              />
            </div>
          </div>
        )}

        {activeView === 'signup' && (
          <div id="signup-view">
            <img src={cpmLogo} alt={t('toolreg-logo-alt')} className="login-logo-img" />
            <SignupForm
              onBackToLoginClick={handleBackToLoginClick}
              onSuccess={handleAuthSuccess}
              onError={handleAuthError}
            />
          </div>
        )}

        {activeView === 'forgotten' && (
          <div id="forgotten-view">
            <ForgotPasswordForm
              onCancelClick={handleBackToLoginClick}
              onSuccess={handleAuthSuccess}
              onError={handleAuthError}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;