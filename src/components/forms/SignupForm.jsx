// client/src/components/forms/SignupForm.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { registerUser } from '../../api/api';

const SignupForm = ({ onBackToLoginClick, onSuccess, onError }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    emailPhone: '',
    password: '',
    birthDay: '',
    birthMonth: '',
    birthYear: '',
    gender: '', // Initialize gender to empty string
  });
  const [error, setError] = useState('');

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    console.log(`Radio: Name: ${name}, Value: ${value}, New formData.gender: ${value}`); // DIAGNOSTIC LOG
  }, []);

  const populateDateDropdowns = useCallback(() => {
    const today = new Date();
    setFormData(prev => ({
      ...prev,
      birthDay: String(today.getDate()),
      birthMonth: String(today.getMonth() + 1),
      birthYear: String(today.getFullYear())
    }));
  }, []);

  useEffect(() => {
    populateDateDropdowns();
  }, [populateDateDropdowns]);


  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError('');

    const { firstName, lastName, emailPhone, password, birthDay, birthMonth, birthYear, gender } = formData;

    if (!firstName || !lastName || !emailPhone || !password || !birthDay || !birthMonth || !birthYear || !gender) {
      setError(t('signup-all-fields-required'));
      return;
    }

    const isEmail = emailPhone.includes('@');
    const email = isEmail ? emailPhone : undefined;
    const phone = !isEmail ? emailPhone : undefined;
    const username = `${firstName}.${lastName}`.toLowerCase();

    try {
      await registerUser({
        username,
        email,
        phone,
        password,
      });

      onSuccess(t('signup-success-message'));
      setFormData({
        firstName: '', lastName: '', emailPhone: '', password: '',
        birthDay: '', birthMonth: '', birthYear: '', gender: '',
      });
      populateDateDropdowns();
    } catch (err) {
      setError(err.message || t('signup-failed-generic'));
      onError(err.message || t('signup-failed-generic'));
    }
  }, [formData, t, onSuccess, onError, populateDateDropdowns]);

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    { value: 1, label: t('month-jan') }, { value: 2, label: t('month-feb') },
    { value: 3, label: t('month-mar') }, { value: 4, label: t('month-apr') },
    { value: 5, label: t('month-may') }, { value: 6, label: t('month-jun') },
    { value: 7, label: t('month-jul') }, { value: 8, label: t('month-aug') },
    { value: 9, label: t('month-sep') }, { value: 10, label: t('month-oct') },
    { value: 11, label: t('month-nov') }, { value: 12, label: t('month-dec') },
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  return (
    <div className="signup-container">
      <div className="signup-title">{t('signup-title')}</div>
      <div className="signup-subtitle">{t('signup-subtitle')}</div>
      <hr className="subtitle-divider" />
      <form onSubmit={handleSubmit}>
        <div className="name-fields">
          <input
            type="text"
            id="first-name"
            name="firstName"
            placeholder={t('first-name-placeholder')}
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            id="last-name"
            name="lastName"
            placeholder={t('last-name-placeholder')}
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <input
          type="text"
          id="email-phone"
          name="emailPhone"
          placeholder={t('email-phone-placeholder-signup')}
          value={formData.emailPhone}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          id="new-password"
          name="password"
          placeholder={t('new-password-placeholder')}
          value={formData.password}
          onChange={handleChange}
          required
        />
        <div className="birthday-section">
          <label htmlFor="birth-day">{t('birthday-label')} <span className="info-icon">i</span></label>
          <div className="birthday-fields">
            <select id="birth-day" name="birthDay" value={formData.birthDay} onChange={handleChange} required>
              <option value="">{t('day-placeholder')}</option>
              {days.map((day) => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
            <select id="birth-month" name="birthMonth" value={formData.birthMonth} onChange={handleChange} required>
              <option value="">{t('month-placeholder')}</option>
              {months.map((month) => (
                <option key={month.value} value={month.value}>{month.label}</option>
              ))}
            </select>
            <select id="birth-year" name="birthYear" value={formData.birthYear} onChange={handleChange} required>
              <option value="">{t('year-placeholder')}</option>
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="gender-section">
          <label>{t('gender-label')} <span className="info-icon">i</span></label>
          <div className="gender-options">
            <div className="gender-option">
              <label htmlFor="gender-female">{t('gender-female')}</label>
              <input type="radio" id="gender-female" name="gender" value="female" checked={formData.gender === 'female'} onChange={handleChange} required />
            </div>
            <div className="gender-option">
              <label htmlFor="gender-male">{t('gender-male')}</label>
              <input type="radio" id="gender-male" name="gender" value="male" checked={formData.gender === 'male'} onChange={handleChange} required />
            </div>
            <div className="gender-option">
              <label htmlFor="gender-custom">{t('gender-custom')}</label>
              <input type="radio" id="gender-custom" name="gender" value="custom" checked={formData.gender === 'custom'} onChange={handleChange} required />
            </div>
          </div>
        </div>
        {error && <div className="error-message">{error}</div>}
        <div className="disclaimer">
          {t('disclaimer-part1')} <a href="#">{t('disclaimer-link1')}</a>, {t('disclaimer-part2')} <a href="#">{t('disclaimer-link2')}</a>. {t('disclaimer-part3')} <a href="#">{t('disclaimer-link3')}</a> {t('disclaimer-part4')}
        </div>
        <button type="submit" className="signup-button">{t('signup-button')}</button>
        <div className="login-link">
          <a href="#" onClick={onBackToLoginClick}>{t('already-have-account')}</a>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;