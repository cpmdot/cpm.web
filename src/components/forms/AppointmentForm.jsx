import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { getAvailableSlots, submitAppointmentForm } from '../../api/api'; // Import submitAppointmentForm

// Utility to wait for jQuery and jQuery UI dependencies
const waitForDependencies = (maxAttempts = 20, interval = 500) => {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const checkDependencies = () => {
      const jQueryLoaded = !!window.jQuery;
      const jQueryUILoaded = jQueryLoaded && !!window.jQuery.ui;
      const datepickerLoaded =
        jQueryLoaded && typeof window.jQuery.fn.datepicker === 'function';

      if (jQueryLoaded && jQueryUILoaded && datepickerLoaded) {
        resolve();
      } else {
        attempts++;
        if (attempts >= maxAttempts) {
          reject(
            new Error(
              'Failed to load jQuery UI with datepicker after ' +
                (maxAttempts * interval) / 1000 +
                ' seconds'
            )
          );
        } else {
          setTimeout(checkDependencies, interval);
        }
      }
    };
    checkDependencies();
  });
};

// Format date for display
const formatDateDisplay = (dateValue, t) => {
  if (!dateValue)
    return {
      day: t('select-date-day-placeholder'),
      date: t('select-date-full-placeholder'),
    };
  const dateObj = new Date(dateValue + 'T00:00:00'); // Add T00:00:00 to avoid timezone issues for date-only input
  const day = dateObj.toLocaleDateString(t('locale'), { weekday: 'long' }); // Use locale from translations
  const date = dateObj.toLocaleDateString(t('locale'), {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  return { day, date };
};

// Apply native date input fallback (if jQuery UI fails)
const applyDateInputFallback = (dateInput) => {
  if (dateInput && dateInput.type !== 'date') {
    dateInput.type = 'date';
    const fallbackMessage = document.createElement('span');
    fallbackMessage.className = 'cform-fallback-message';
    fallbackMessage.textContent = 'Using native date picker.';
    dateInput.parentNode.appendChild(fallbackMessage);
  }
};

const AppointmentForm = ({ onSuccess, onError, isActive }) => {
  // Added isActive prop
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    apptDate: '',
    apptTime: '',
    apptName: '',
    apptEmail: '',
    apptPhone: '',
    service: '',
    apptMessage: '',
    apptPrivacy: false,
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [availableTimes, setAvailableTimes] = useState([]);
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);
  const timePickerRef = useRef(null);
  const apptDateInputRef = useRef(null); // Ref for the hidden date input
  const apptTimeInputRef = useRef(null); // Ref for the hidden time select
  const dateInfoRef = useRef(null); // Ref for the clickable date display div
  const timeInfoRef = useRef(null); // Ref for the clickable time display div

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) =>
    /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}$/.test(
      phone
    );

  // Fetch available slots when date changes
  const fetchSlots = useCallback(
    async (date) => {
      console.log(`[AppointmentForm] Calling fetchSlots for date: ${date}`);
      if (!date) {
        setAvailableTimes([]);
        return;
      }
      try {
        const slots = await getAvailableSlots(date);
        console.log(`[AppointmentForm] Received slots for ${date}:`, slots);
        setAvailableTimes(slots);
        // Reset time selection if no slots are available or previously selected time is no longer available
        if (
          !slots.some(
            (slot) => slot.value === formData.apptTime && !slot.disabled
          )
        ) {
          setFormData((prev) => ({ ...prev, apptTime: '' }));
          if (document.getElementById('cform-selectedTime')) {
            document.getElementById('cform-selectedTime').textContent =
              t('select-time');
          }
        }
      } catch (error) {
        console.error(
          '[AppointmentForm] Error fetching available slots in fetchSlots:',
          error
        );
        onError(t('slots-error-toast')); // This is the toast message the user sees
        setAvailableTimes([]); // Clear slots on error
      }
    },
    [formData.apptTime, onError, t]
  );

  // Handle input changes
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

  // Effect for Datepicker initialization and cleanup
  useEffect(() => {
    let isDatepickerAvailable = false;
    const dateInputEl = apptDateInputRef.current;
    const dateInfoEl = dateInfoRef.current;

    // Only initialize if the tab is active
    if (!isActive) return;

    const initializeDatepicker = async () => {
      if (!dateInputEl || !dateInfoEl) return;

      try {
        await waitForDependencies();
        console.log(
          '[AppointmentForm] jQuery UI Datepicker dependencies loaded. Initializing...'
        );
        window.jQuery(dateInputEl).datepicker({
          minDate: 0, // Cannot select past dates
          dateFormat: 'yy-mm-dd',
          beforeShow: (input, inst) => {
            // Ensure datepicker z-index is high enough
            inst.dpDiv.css({ zIndex: 10000 });
          },
          onSelect: (dateText) => {
            console.log('[AppointmentForm] Date selected:', dateText);
            setFormData((prev) => ({ ...prev, apptDate: dateText }));
            const { day, date } = formatDateDisplay(dateText, t);
            if (document.getElementById('cform-selectedDay')) {
              document.getElementById('cform-selectedDay').textContent = day;
            }
            if (document.getElementById('cform-selectedDate')) {
              document.getElementById('cform-selectedDate').textContent = date;
            }
            // Fetch slots for newly selected date
            fetchSlots(dateText);
            // Clear date/time error
            setErrors((prev) => ({ ...prev, dateTime: '' }));
          },
        });
        isDatepickerAvailable = true;
        console.log(
          '[AppointmentForm] jQuery UI Datepicker initialized successfully.'
        );
      } catch (error) {
        console.error(
          '[AppointmentForm] Failed to initialize jQuery UI datepicker:',
          error.message
        );
        applyDateInputFallback(dateInputEl); // Fallback if jQuery UI datepicker fails
      }
    };

    initializeDatepicker();

    // Event listeners for custom date display button (to trigger datepicker)
    const handleDateInfoClick = () => {
      if (isDatepickerAvailable) {
        window.jQuery(dateInputEl).datepicker('show'); // Show jQuery UI datepicker
      } else {
        dateInputEl.click(); // Trigger native HTML date input
      }
    };

    const handleDateInfoKeyDown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleDateInfoClick();
      }
    };

    // Add listeners to the display div
    if (dateInfoEl) {
      dateInfoEl.addEventListener('click', handleDateInfoClick);
      dateInfoEl.addEventListener('keydown', handleDateInfoKeyDown);
    }

    // Cleanup function for useEffect
    return () => {
      console.log('[AppointmentForm] Cleaning up datepicker useEffect.');
      if (
        isDatepickerAvailable &&
        window.jQuery(dateInputEl).data('datepicker')
      ) {
        window.jQuery(dateInputEl).datepicker('destroy'); // Destroy datepicker instance
        console.log('[AppointmentForm] Datepicker destroyed.');
      }
      if (dateInfoEl) {
        dateInfoEl.removeEventListener('click', handleDateInfoClick);
        dateInfoEl.removeEventListener('keydown', handleDateInfoKeyDown);
      }
    };
  }, [isActive, fetchSlots, t]); // Re-run if isActive changes to initialize/cleanup

  // Effect for Custom Time Picker visibility and positioning
  useEffect(() => {
    const timeInfoEl = timeInfoRef.current;
    const timePickerEl = timePickerRef.current;

    // Only set up listeners if the tab is active
    if (!isActive) return;

    // Position time picker correctly when it becomes visible
    if (isTimePickerVisible && timeInfoEl && timePickerEl) {
      const rect = timeInfoEl.getBoundingClientRect();
      timePickerEl.style.position = 'absolute';
      timePickerEl.style.top = `${rect.bottom + window.scrollY}px`;
      timePickerEl.style.left = `${rect.left + window.scrollX}px`;
      timePickerEl.style.width = `${rect.width}px`;
      timePickerEl.style.display = 'block'; // Ensure it's displayed
      timePickerEl.style.zIndex = '10000'; // Ensure it's above other elements
      // Focus the first available option for accessibility
      setTimeout(() => {
        const firstOption = timePickerEl.querySelector(
          '.cform-time-option:not([disabled])'
        );
        if (firstOption) firstOption.focus();
      }, 0);
    } else if (timePickerEl) {
      timePickerEl.style.display = 'none'; // Hide it
    }

    // Handle clicks outside time picker to close it
    const handleClickOutsideTimePicker = (e) => {
      if (
        timePickerEl &&
        !timePickerEl.contains(e.target) &&
        timeInfoEl &&
        !timeInfoEl.contains(e.target)
      ) {
        setIsTimePickerVisible(false);
      }
    };

    document.addEventListener('click', handleClickOutsideTimePicker);

    // Cleanup
    return () => {
      console.log('[AppointmentForm] Cleaning up time picker useEffect.');
      document.removeEventListener('click', handleClickOutsideTimePicker);
    };
  }, [isActive, isTimePickerVisible]); // Dependencies: isActive, isTimePickerVisible

  // Initial fetch of slots when component mounts (or when apptDate is initially set/defaulted)
  useEffect(() => {
    // Only fetch default slots if component is active
    if (!isActive) return;

    if (!formData.apptDate) {
      // Set default date to today and fetch slots for it
      const today = new Date();
      const formattedToday =
        today.getFullYear() +
        '-' +
        String(today.getMonth() + 1).padStart(2, '0') +
        '-' +
        String(today.getDate()).padStart(2, '0');
      console.log(
        '[AppointmentForm] Setting default date to today:',
        formattedToday
      );
      setFormData((prev) => ({ ...prev, apptDate: formattedToday }));
    }
  }, [isActive, formData.apptDate]); // Re-run if isActive changes or apptDate not set

  // Effect to fetch slots whenever apptDate in formData changes (after initial render or user selection)
  useEffect(() => {
    if (isActive && formData.apptDate) {
      // Only fetch if active and date is set
      console.log(
        '[AppointmentForm] apptDate changed (or component active), fetching slots for:',
        formData.apptDate
      );
      fetchSlots(formData.apptDate);
    }
  }, [isActive, formData.apptDate, fetchSlots]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      let currentErrors = {};
      let isValid = true;

      // Validation logic
      if (!formData.apptDate || !formData.apptTime) {
        currentErrors.dateTime = t('date-time-required');
        isValid = false;
      }
      if (!formData.apptName.trim()) {
        currentErrors.apptName = t('name-required');
        isValid = false;
      }
      if (!formData.apptEmail.trim()) {
        currentErrors.apptEmail = t('email-required');
        isValid = false;
      } else if (!validateEmail(formData.apptEmail)) {
        currentErrors.apptEmail = t('invalid-email');
        isValid = false;
      }
      if (!formData.apptPhone.trim()) {
        currentErrors.apptPhone = t('phone-required');
        isValid = false;
      } else if (!validatePhone(formData.apptPhone)) {
        currentErrors.apptPhone = t('invalid-phone');
        isValid = false;
      }
      if (!formData.service) {
        currentErrors.service = t('service-required');
        isValid = false;
      }
      if (!formData.apptPrivacy) {
        currentErrors.apptPrivacy = t('agree-privacy-required');
        isValid = false;
      }

      setErrors(currentErrors);

      if (!isValid) {
        const firstErrorField = Object.keys(currentErrors).find(
          (key) => currentErrors[key]
        );
        if (firstErrorField) {
          document.querySelector(`[name="${firstErrorField}"]`).focus();
        }
        console.log('[AppointmentForm] Form is invalid:', currentErrors);
        return;
      }

      // Actual API submission using the imported function
      try {
        console.log('[AppointmentForm] Submitting form data:', formData);
        await submitAppointmentForm(formData); // Use the imported function

        setSuccessMessage(t('appointment-success-message'));
        onSuccess(t('appointment-success-toast'));
        // Reset form data and errors
        setFormData({
          apptDate: '',
          apptTime: '',
          apptName: '',
          apptEmail: '',
          apptPhone: '',
          service: '',
          apptMessage: '',
          apptPrivacy: false,
        });
        setErrors({});
        // Reset displayed date/time
        if (document.getElementById('cform-selectedDay'))
          document.getElementById('cform-selectedDay').textContent = t(
            'select-date-day-placeholder'
          );
        if (document.getElementById('cform-selectedDate'))
          document.getElementById('cform-selectedDate').textContent = '';
        if (document.getElementById('cform-selectedTime'))
          document.getElementById('cform-selectedTime').textContent =
            t('select-time');

        // Crucial for jQuery UI datepicker: destroy and re-initialize after form reset
        // This ensures the datepicker reflects the cleared date and functions correctly upon reopening.
        if (
          window.jQuery &&
          apptDateInputRef.current &&
          window.jQuery(apptDateInputRef.current).data('datepicker')
        ) {
          window.jQuery(apptDateInputRef.current).datepicker('destroy');
          setTimeout(() => {
            // Small delay to ensure DOM update
            if (window.jQuery && apptDateInputRef.current) {
              // Re-check if jQuery and ref exist
              window.jQuery(apptDateInputRef.current).datepicker({
                minDate: 0,
                dateFormat: 'yy-mm-dd',
                beforeShow: (input, inst) => inst.dpDiv.css({ zIndex: 10000 }),
                onSelect: (dateText) => {
                  setFormData((prev) => ({ ...prev, apptDate: dateText }));
                  const { day, date } = formatDateDisplay(dateText, t);
                  if (document.getElementById('cform-selectedDay'))
                    document.getElementById('cform-selectedDay').textContent =
                      day;
                  if (document.getElementById('cform-selectedDate'))
                    document.getElementById('cform-selectedDate').textContent =
                      date;
                  fetchSlots(dateText);
                  setErrors((prev) => ({ ...prev, dateTime: '' }));
                },
              });
            }
          }, 100); // 100ms delay
        }

        setTimeout(() => setSuccessMessage(''), 5000); // Hide success message after 5 seconds
      } catch (error) {
        console.error('[AppointmentForm] Submission error:', error);
        onError(t('appointment-error-toast'));
        setSuccessMessage('');
      }
    },
    [formData, t, onSuccess, onError, fetchSlots, validateEmail, validatePhone]
  );

  // Derived state for date display texts
  const { day: selectedDayText, date: selectedDateText } = formatDateDisplay(
    formData.apptDate,
    t
  );

  return (
    <div
      id="cform-appointment"
      className={`cform-tab-content ${isActive ? 'active' : ''}`}
      role="tabpanel"
      aria-labelledby="appointment-tab"
    >
      <h1>
        <i className="fas fa-calendar-check"></i> {t('appointment-heading')}
      </h1>
      <p className="cform-subtitle">{t('appointment-subtitle')}</p>
      {successMessage && (
        <div className="cform-success-message show">
          <i className="fas fa-check-circle"></i>
          <p>{successMessage}</p>
        </div>
      )}
      <form onSubmit={handleSubmit} noValidate>
        <div className="cform-form-group">
          <label htmlFor="cform-apptDate">{t('date-time-label')}</label>
          <div className="cform-custom-date-time">
            {/* Date Info Display - clickable */}
            <div
              className="cform-date-info"
              ref={dateInfoRef}
              tabIndex="0"
              role="button"
              aria-haspopup="dialog"
              aria-controls="cform-apptDate"
            >
              <i className="fas fa-calendar-day"></i>
              <div className="cform-date-text">
                <span id="cform-selectedDay">{selectedDayText}</span>
                <span id="cform-selectedDate">{selectedDateText}</span>
              </div>
            </div>

            {/* Hidden Date Input - controlled by jQuery UI Datepicker or native fallback */}
            <input
              type="text" // Use 'text' for jQuery UI Datepicker, will be changed to 'date' if fallback
              id="cform-apptDate"
              name="apptDate"
              ref={apptDateInputRef}
              value={formData.apptDate} // Value managed by state
              onChange={handleChange} // Still capture changes if type is 'date'
              placeholder={t('date-placeholder')}
              required
              aria-describedby={
                errors.dateTime ? 'cform-datetime-error' : undefined
              }
              aria-invalid={!!errors.dateTime}
              readOnly // Prevent direct typing when using datepicker
            />

            {/* Time Info Display - clickable */}
            <div
              className="cform-time-info"
              ref={timeInfoRef}
              tabIndex="0"
              role="button"
              aria-haspopup="listbox"
              aria-controls="cform-apptTime"
            >
              <i className="fas fa-clock"></i>
              <div className="cform-time-text">
                {/* Display selected time, or placeholder */}
                <span id="cform-selectedTime">
                  {formData.apptTime
                    ? availableTimes.find(
                        (slot) => slot.value === formData.apptTime
                      )?.text || t('select-time')
                    : t('select-time')}
                </span>
              </div>
            </div>
            {/* Hidden Time Select Element - controlled by custom UI */}
            <select
              id="cform-apptTime"
              name="apptTime"
              ref={apptTimeInputRef}
              value={formData.apptTime}
              onChange={handleChange}
              required
              aria-describedby={
                errors.dateTime ? 'cform-datetime-error' : undefined
              }
              aria-invalid={!!errors.dateTime}
              style={{ display: 'none' }} // Hide the native select, controlled by custom picker
            >
              <option value="">{t('select-time')}</option>
              {/* Render available times from state, including disabled state */}
              {availableTimes.map((slot) => (
                <option
                  key={slot.value}
                  value={slot.value}
                  disabled={slot.disabled}
                >
                  {slot.text}
                </option>
              ))}
            </select>
          </div>
          {errors.dateTime && (
            <span
              className="cform-error-message show"
              id="cform-datetime-error"
            >
              {errors.dateTime}
            </span>
          )}
        </div>

        {/* Custom Time Picker Popup - rendered conditionally based on state */}
        {/* It is absolutely positioned by useEffect/JS, so its placement here in JSX doesn't affect visual flow */}
        {/* The display:block/none and positioning are handled by useEffect */}
        {/* We use createPortal for the time picker to ensure it renders on top of everything,
            but for simplicity in this snippet, it's directly here. If z-index issues occur, consider portal. */}
        <div className="cform-time-picker" ref={timePickerRef}>
          {availableTimes.length > 0 ? (
            availableTimes.map((slot) => (
              <button
                key={slot.value}
                className="cform-time-option"
                onClick={() => {
                  setFormData((prev) => ({ ...prev, apptTime: slot.value }));
                  setIsTimePickerVisible(false); // Close time picker after selection
                  // Update display text for selected time
                  if (document.getElementById('cform-selectedTime')) {
                    document.getElementById('cform-selectedTime').textContent =
                      slot.text;
                  }
                  // Clear time-related errors
                  setErrors((prev) => ({
                    ...prev,
                    apptTime: '',
                    dateTime: '',
                  }));
                }}
                disabled={slot.disabled} // Disable if slot is not available
                tabIndex="0" // Make clickable option focusable
              >
                {slot.text}
              </button>
            ))
          ) : (
            // Message if no slots are available
            <div
              className="cform-time-option"
              style={{ cursor: 'default', color: '#999' }}
            >
              {t('no-slots-available')}
            </div>
          )}
        </div>

        <div className="cform-form-group">
          <label htmlFor="cform-apptName">{t('name-label')}</label>
          <input
            type="text"
            id="cform-apptName"
            name="apptName"
            placeholder={t('name-placeholder')}
            value={formData.apptName}
            onChange={handleChange}
            required
            aria-describedby={
              errors.apptName ? 'cform-apptNameError' : undefined
            }
            aria-invalid={!!errors.apptName}
          />
          {errors.apptName && (
            <span className="cform-error-message show" id="cform-apptNameError">
              {errors.apptName}
            </span>
          )}
        </div>
        <div className="cform-form-group">
          <label htmlFor="cform-apptEmail">{t('email-label')}</label>
          <input
            type="email"
            id="cform-apptEmail"
            name="apptEmail"
            placeholder={t('email-placeholder')}
            value={formData.apptEmail}
            onChange={handleChange}
            required
            aria-describedby={
              errors.apptEmail ? 'cform-apptEmailError' : undefined
            }
            aria-invalid={!!errors.apptEmail}
          />
          {errors.apptEmail && (
            <span
              className="cform-error-message show"
              id="cform-apptEmailError"
            >
              {errors.apptEmail}
            </span>
          )}
        </div>
        <div className="cform-form-group">
          <label htmlFor="cform-apptPhone">{t('phone-label')}</label>
          <input
            type="tel"
            id="cform-apptPhone"
            name="apptPhone"
            placeholder={t('phone-placeholder-appt')}
            value={formData.apptPhone}
            onChange={handleChange}
            required
            aria-describedby={
              errors.apptPhone ? 'cform-apptPhoneError' : undefined
            }
            aria-invalid={!!errors.apptPhone}
          />
          {errors.apptPhone && (
            <span
              className="cform-error-message show"
              id="cform-apptPhoneError"
            >
              {errors.apptPhone}
            </span>
          )}
        </div>
        <div className="cform-form-group">
          <label htmlFor="cform-service">{t('service-label')}</label>
          <select
            id="cform-service"
            name="service"
            value={formData.service}
            onChange={handleChange}
            required
            aria-describedby={errors.service ? 'cform-serviceError' : undefined}
            aria-invalid={!!errors.service}
          >
            <option value="">{t('select-service')}</option>
            <option value="consultation">{t('service-consultation')}</option>
            <option value="site-visit">{t('service-site-visit')}</option>
            <option value="project-discussion">
              {t('service-project-discussion')}
            </option>
            <option value="training">{t('service-training')}</option>
            <option value="equipment">{t('service-equipment')}</option>
          </select>
          {errors.service && (
            <span className="cform-error-message show" id="cform-serviceError">
              {errors.service}
            </span>
          )}
        </div>
        <div className="cform-form-group">
          <label htmlFor="cform-apptMessage">{t('message-label')}</label>
          <textarea
            id="cform-apptMessage"
            name="apptMessage"
            placeholder={t('message-placeholder-appt')}
            rows="3"
            value={formData.apptMessage}
            onChange={handleChange}
            aria-describedby={
              errors.apptMessage ? 'cform-apptMessageError' : undefined
            }
            aria-invalid={!!errors.apptMessage}
          ></textarea>
          {errors.apptMessage && (
            <span
              className="cform-error-message show"
              id="cform-apptMessageError"
            >
              {errors.apptMessage}
            </span>
          )}
        </div>
        <div className="cform-form-group cform-checkbox-group">
          <div className="cform-checkbox-text-group">
            <input
              type="checkbox"
              id="cform-appt-privacy"
              name="apptPrivacy"
              checked={formData.apptPrivacy}
              onChange={handleChange}
              required
              aria-describedby={
                errors.apptPrivacy ? 'cform-apptPrivacyError' : undefined
              }
              aria-invalid={!!errors.apptPrivacy}
            />
            <label htmlFor="cform-appt-privacy" className="sr-only">
              {t('agree-privacy')}
            </label>
            <span className="cform-privacy-text">
              {t('privacy-appointment-label-part1')}{' '}
              <a href="/privacy-policy" className="cform-privacy-policy">
                {t('privacy-policy-link')}
              </a>{' '}
              {t('privacy-appointment-label-part2')}
            </span>
          </div>
          {errors.apptPrivacy && (
            <span
              className="cform-error-message show"
              id="cform-apptPrivacyError"
            >
              {errors.apptPrivacy}
            </span>
          )}
        </div>
        <button type="submit" className="cform-submit-btn">
          <i className="fas fa-calendar-plus"></i>{' '}
          {t('schedule-appointment-button')}
        </button>
      </form>
    </div>
  );
};

export default AppointmentForm;
