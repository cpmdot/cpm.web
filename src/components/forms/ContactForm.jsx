import { useDispatch } from 'react-redux';
import React, { useState, useCallback } from 'react';
import { useLanguage } from '../../context/LanguageContext'; // Adjust path as necessary
import { createContact } from '../../features/contacts/thunks';

const ContactForm = ({ onSuccess, onError, isActive }) => { // Added isActive prop
  const dispatch = useDispatch();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    subject: '',
    message: '',
    privacyPolicy: false,
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}$/.test(phone);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error for the field as user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    let currentErrors = {};
    let isValid = true;

    // Validation logic
    if (!formData.fullName.trim()) {
      currentErrors.fullName = t('name-required');
      isValid = false;
    }
    if (!formData.email.trim()) {
      currentErrors.email = t('email-required');
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      currentErrors.email = t('invalid-email');
      isValid = false;
    }
    if (!formData.phoneNumber.trim()) {
      currentErrors.phoneNumber = t('phone-required');
      isValid = false;
    } else if (!validatePhone(formData.phoneNumber)) {
      currentErrors.phoneNumber = t('invalid-phone');
      isValid = false;
    }
    if (!formData.subject) {
      currentErrors.subject = t('subject-required');
      isValid = false;
    }
    if (!formData.message.trim()) {
      currentErrors.message = t('message-required');
      isValid = false;
    }
    if (!formData.privacyPolicy) {
      currentErrors.privacyPolicy = t('agree-privacy-required');
      isValid = false;
    }

    setErrors(currentErrors);

    if (!isValid) {
      // Focus on the first invalid field
      const firstErrorField = Object.keys(currentErrors).find(key => currentErrors[key]);
      if (firstErrorField) {
        document.querySelector(`[name="${firstErrorField}"]`).focus();
      }
      return;
    }

    // Actual API submission using the imported function
    try {
      // Use the imported function
      dispatch(createContact(formData));
      
      setSuccessMessage(t('contact-success-message'));
      onSuccess(t('contact-success-toast'));
      setFormData({
        fullName: '',
        email: '',
        phoneNumber: '',
        subject: '',
        message: '',
        privacyPolicy: false,
      });
      setErrors({}); // Clear errors on success
      setTimeout(() => setSuccessMessage(''), 5000); // Hide success message after 5 seconds

    } catch (error) {
      console.error('Submission error:', error);
      onError(t('contact-error-toast'));
      setSuccessMessage(''); // Clear success message if there was an error
    }
  }, [formData, t, onSuccess, onError, validateEmail, validatePhone]);


  return (
    <div id="cform-contact" className={`cform-tab-content ${isActive ? 'active' : ''}`} role="tabpanel" aria-labelledby="contact-tab">
      <h1 id="contact-form-heading"><i className="fas fa-paper-plane"></i> {t('contact-heading')}</h1>
      <p className="cform-subtitle">{t('contact-subtitle')}</p>
      {successMessage && (
        <div className="cform-success-message show">
          <i className="fas fa-check-circle"></i>
          <p>{successMessage}</p>
        </div>
      )}
      <form onSubmit={handleSubmit} noValidate>
        <div className="cform-form-group">
          <label htmlFor="cform-fullName">{t('name-label')}</label>
          <input
            type="text"
            id="cform-fullName"
            name="fullName"
            placeholder={t('name-placeholder')}
            value={formData.fullName}
            onChange={handleChange}
            required
            aria-describedby={errors.fullName ? "cform-nameError" : undefined}
            aria-invalid={!!errors.fullName}
          />
          {errors.fullName && <span className="cform-error-message show" id="cform-nameError">{errors.fullName}</span>}
        </div>
        <div className="cform-form-group">
          <label htmlFor="cform-email">{t('email-label')}</label>
          <input
            type="email"
            id="cform-email"
            name="email"
            placeholder={t('email-placeholder')}
            value={formData.email}
            onChange={handleChange}
            required
            aria-describedby={errors.email ? "cform-emailError" : undefined}
            aria-invalid={!!errors.email}
          />
          {errors.email && <span className="cform-error-message show" id="cform-emailError">{errors.email}</span>}
        </div>
        <div className="cform-form-group">
          <label htmlFor="cform-phone-number">{t('phone-label')}</label>
          <input
            type="tel"
            id="cform-phone-number"
            name="phoneNumber"
            placeholder={t('phone-placeholder')}
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            aria-describedby={errors.phoneNumber ? "cform-phoneError" : undefined}
            aria-invalid={!!errors.phoneNumber}
          />
          {errors.phoneNumber && <span className="cform-error-message show" id="cform-phoneError">{errors.phoneNumber}</span>}
        </div>
        <div className="cform-form-group">
          <label htmlFor="cform-subject">{t('subject-label')}</label>
          <select
            id="cform-subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            aria-describedby={errors.subject ? "cform-subjectError" : undefined}
            aria-invalid={!!errors.subject}
          >
            <option value="">{t('select-subject')}</option>
            <option value="general">{t('subject-general')}</option>
            <option value="services">{t('subject-services')}</option>
            <option value="training">{t('subject-training')}</option>
            <option value="careers">{t('subject-careers')}</option>
            <option value="other">{t('subject-other')}</option>
          </select>
          {errors.subject && <span className="cform-error-message show" id="cform-subjectError">{errors.subject}</span>}
        </div>
        <div className="cform-form-group">
          <label htmlFor="cform-message">{t('message-label')}</label>
          <textarea
            id="cform-message"
            name="message"
            placeholder={t('message-placeholder')}
            rows="3"
            value={formData.message}
            onChange={handleChange}
            required
            aria-describedby={errors.message ? "cform-messageError" : undefined}
            aria-invalid={!!errors.message}
          ></textarea>
          {errors.message && <span className="cform-error-message show" id="cform-messageError">{errors.message}</span>}
        </div>
        <div className="cform-form-group cform-checkbox-group">
          <div className="cform-checkbox-text-group">
            <input
              type="checkbox"
              id="cform-contact-privacy"
              name="privacyPolicy"
              checked={formData.privacyPolicy}
              onChange={handleChange}
              required
              aria-describedby={errors.privacyPolicy ? "cform-privacyError" : undefined}
              aria-invalid={!!errors.privacyPolicy}
            />
            <label htmlFor="cform-contact-privacy" className="sr-only"> {t('agree-privacy')}</label>
            <span className="cform-privacy-text">
              {t('privacy-contact-label-part1')} <a href="/privacy-policy" className="cform-privacy-policy">{t('privacy-policy-link')}</a> {t('privacy-contact-label-part2')}
            </span>
          </div>
          {errors.privacyPolicy && <span className="cform-error-message show" id="cform-privacyError">{errors.privacyPolicy}</span>}
        </div>
        <button type="submit" className="cform-submit-btn">
          <i className="fas fa-paper-plane"></i> {t('submit-button')}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;