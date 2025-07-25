import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import '../styles/pages/createAppointmentForm.css';
import { useDispatch, useSelector } from 'react-redux';
import { createAppointment } from '../features/appointments/thunks';
import { useLanguage } from '../context/LanguageContext';
import { convertUtcSlotsToLocal24h } from '../features/dateTimeUtils';

export default function CreateAppointmentForm({
  onSuccess,
  onError,
  isActive,
}) {
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector(
    (state) => state.appointments
  );
  const { t } = useLanguage();
  const [apptDate, setApptDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [apptTime, setApptTime] = useState('');
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [serviceNeeded, setServiceNeeded] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [privacyPolicy, setPrivacyPolicy] = useState(true);

  // Fetch available slots when date changes
  useEffect(() => {
    if (!apptDate) return;
    const fetchSlots = async () => {
      setLoadingSlots(true);
      try {
        const res = await axios.get('/api/appointments/available-slots', {
          params: { date: apptDate },
        });

        const slots = convertUtcSlotsToLocal24h(res.data);
        setAvailableSlots(slots);
      } catch (err) {
        console.error(
          '[AppointmentForm] Error fetching available slots in fetchSlots:',
          err
        );
        onError(t('slots-error-toast'));
        setAvailableSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };
    fetchSlots();
  }, [apptDate]);

  // Reset form after successful booking
  useEffect(() => {
    if (success) {
      setApptDate('');
      setApptTime('');
      setClientName('');
      setClientEmail('');
      setClientPhone('');
      setServiceNeeded('');
      setPrivacyPolicy(false);
      setAvailableSlots([]);
    }
  }, [success, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !apptDate ||
      !apptTime ||
      !clientName ||
      !clientEmail ||
      !serviceNeeded ||
      !additionalInfo ||
      !privacyPolicy
    ) {
      alert('Please fill all required fields and accept privacy policy');
      return;
    }

    dispatch(
      createAppointment({
        apptDate,
        apptTime,
        clientName,
        clientEmail,
        clientPhone,
        serviceNeeded,
        additionalInfo,
        privacyPolicy,
      })
    );

    if (success) {
      setSuccessMessage(t('appointment-success-message'));
      onSuccess(t('appointment-success-toast'));
      setTimeout(() => setSuccessMessage(''), 5000);
    }
  };

  return (
    <>
      <div
        id="cform-appointment"
        className={`cform-tab-content ${isActive ? 'active' : ''}`}
        role="tabpanel"
        aria-labelledby="appointment-tab"
      >
        <form className="appointment-form" onSubmit={handleSubmit}>
          <h1>
            <i className="fas fa-calendar-check"></i> {t('appointment-heading')}
          </h1>
          <p className="cform-subtitle">{t('appointment-subtitle')}</p>
          {loading && <p className="info-msg">Booking your appointment...</p>}
          {successMessage && (
            // <p className="success-msg"></p>
            <div className="cform-success-message show">
              <i className="fas fa-check-circle"></i>
              <p>{successMessage}</p>
            </div>
          )}
          {error && <p className="error-msg">{error}</p>}
          <div className="cform-form-group">
            <label htmlFor="cform-apptDate">{t('date-time-label')}</label>
            <div className="cform-date-info">
              <label>
                {t('select-date')}*
                <input
                  type="date"
                  value={apptDate}
                  onChange={(e) => setApptDate(e.target.value)}
                  required
                />
              </label>

              <label>
                {t('select-time')}*
                {loadingSlots ? (
                  <p>Loading slots...</p>
                ) : (
                  <select
                    value={apptTime}
                    onChange={(e) => setApptTime(e.target.value)}
                    required
                  >
                    <option value="">Select a slot</option>
                    {availableSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                )}
              </label>
            </div>
          </div>
          <div className="cform-form-group">
            <label>
              {t('name-label')}*
              <input
                type="text"
                placeholder={t('name-placeholder')}
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                required
              />
            </label>
          </div>
          <div className="cform-form-group">
            <label>
              {t('email-label')}*
              <input
                type="email"
                placeholder={t('email-placeholder')}
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                required
              />
            </label>
          </div>
          <div className="cform-form-group">
            <label>
              {t('phone-label')}
              <input
                type="tel"
                placeholder={t('phone-placeholder-appt')}
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
              />
            </label>
          </div>

          <div className="cform-form-group">
            <label>
              Service Needed*
              <select
                name="service"
                value={serviceNeeded}
                onChange={(e) => setServiceNeeded(e.target.value)}
                required
              >
                <option value="">{t('select-service')}</option>
                <option value="consultation">
                  {t('service-consultation')}
                </option>
                <option value="site-visit">{t('service-site-visit')}</option>
                <option value="project-discussion">
                  {t('service-project-discussion')}
                </option>
                <option value="training">{t('service-training')}</option>
                <option value="equipment">{t('service-equipment')}</option>
              </select>
            </label>
          </div>

          <div className="cform-form-group">
            <label htmlFor="cform-apptMessage">{t('message-label')}</label>
            <textarea
              id="cform-apptMessage-not-used"
              name="apptMessage"
              value={additionalInfo}
              placeholder={t('message-placeholder-appt')}
              onChange={(e) => setAdditionalInfo(e.target.value)}
            />
          </div>

          <div className="cform-form-group cform-checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={privacyPolicy}
                onChange={(e) => setPrivacyPolicy(e.target.checked)}
              />
              <span className="cform-privacy-text">
                {' '}
                {t('privacy-appointment-label-part1')}{' '}
                <a href="/privacy-policy" className="cform-privacy-policy">
                  {t('privacy-policy-link')}
                </a>{' '}
                {t('privacy-appointment-label-part2')}
              </span>
            </label>
          </div>

          <button type="submit" disabled={loading} className="cform-submit-btn">
            {loading ? (
              'Booking...'
            ) : (
              <span>
                <i className="fas fa-calendar-plus"></i>{' '}
                {t('schedule-appointment-button')}
              </span>
            )}
          </button>
        </form>
      </div>
    </>
  );
}
