import React, { useState, useEffect } from 'react';
import './farmerDetail.css';
import { Language, TRANSLATIONS, LOCATIONS, SOIL_TYPES } from './farmerDetailConsonants.js';
import { useNavigate } from "react-router-dom";

function FarmerDetail() {
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState('language'); // 'language', 'details', 'dashboard'
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [farmerData, setFarmerData] = useState({
    name: '',
    phone: '',
    state: '',
    district: '',
    soilType: '',
    weatherSms: false,
    currentCrop: '',
    expectedDate: ''
  });

  const t = selectedLanguage ? TRANSLATIONS[selectedLanguage] : TRANSLATIONS[Language.ENGLISH];
  const states = selectedLanguage ? Object.keys(LOCATIONS[selectedLanguage]) : [];
  const districts = farmerData.state && selectedLanguage 
    ? LOCATIONS[selectedLanguage][farmerData.state] || [] 
    : [];
  const soilTypes = selectedLanguage ? SOIL_TYPES[selectedLanguage] : [];

  const handleLanguageSelect = (lang) => {
    setSelectedLanguage(lang);
    setCurrentStep('details');
  };

  useEffect(() => {
    if (currentStep === "dashboard") {
      navigate("/dashboard");
    }
  }, [currentStep, navigate]);

  const handleInputChange = (field, value) => {
    setFarmerData(prev => ({
      ...prev,
      [field]: value,
      // Reset district when state changes
      ...(field === 'state' ? { district: '' } : {})
    }));
  };

  const isFormValid = () => {
    const baseFields = farmerData.name.trim() && 
                       farmerData.phone.trim() && 
                       farmerData.state && 
                       farmerData.district && 
                       farmerData.soilType;
    
    if (!baseFields) return false;
    
    // Phone number validation
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(farmerData.phone)) return false;
    
    if (farmerData.weatherSms) {
      return farmerData.currentCrop.trim() && farmerData.expectedDate;
    }
    
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid()) {
      // Save data to localStorage or API
      localStorage.setItem('farmerData', JSON.stringify({
        ...farmerData,
        language: selectedLanguage
      }));
      setCurrentStep('dashboard');
    }
  };

  const handleBack = () => {
    setCurrentStep('language');
    setSelectedLanguage(null);
    setFarmerData({
      name: '',
      phone: '',
      state: '',
      district: '',
      soilType: '',
      weatherSms: false,
      currentCrop: '',
      expectedDate: ''
    });
  };

  // Format phone number as user types
  const handlePhoneChange = (value) => {
    const numbersOnly = value.replace(/\D/g, '').slice(0, 10);
    handleInputChange('phone', numbersOnly);
  };

  // Language Selection Screen
  if (currentStep === 'language') {
    return (
      <div className="app-container">
        <div className="language-selection">
          <div className="header-logo">
            <h1 className="app-title" data-text="KISAN MITRA">KISAN MITRA</h1>
            <p className="app-subtitle">AI Voice Assistant</p>
          </div>
          
          <div className="welcome-text">
            <span className="welcome-text-line">Choose your language</span>
            <span className="welcome-text-line">अपनी भाषा चुनें</span>
            <span className="welcome-text-line">మీ భాషను ఎంచుకోండి</span>
            <span className="welcome-text-line">உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்</span>
            <span className="welcome-text-line">ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ</span>
            <span className="welcome-text-line">നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുക്കുക</span>
          </div>
          
          <div className="language-grid">
            {[
              { lang: Language.ENGLISH, icon: '🇬🇧', name: 'English' },
              { lang: Language.HINDI, icon: '🇮🇳', name: 'हिंदी' },
              { lang: Language.TELUGU, icon: '🇮🇳', name: 'తెలుగు' },
              { lang: Language.TAMIL, icon: '🇮🇳', name: 'தமிழ்' },
              { lang: Language.KANNADA, icon: '🇮🇳', name: 'ಕನ್ನಡ' },
              { lang: Language.MALAYALAM, icon: '🇮🇳', name: 'മലയാളം' }
            ].map((language) => (
              <button 
                key={language.lang}
                className="language-btn"
                onClick={() => handleLanguageSelect(language.lang)}
                aria-label={`Select ${language.name} language`}
                type="button"
              >
                <span className="lang-icon" aria-hidden="true">{language.icon}</span>
                <span className="lang-name">{language.name}</span>
              </button>
            ))}
          </div>
          
          <div className="footer-note">
            <small>Select your preferred language to continue</small>
          </div>
        </div>
      </div>
    );
  }

  // Farmer Details Form
  if (currentStep === 'details') {
    return (
      <div className="app-container">
        <div className="form-container">
          <div className="header">
            <button 
              className="back-btn"
              onClick={handleBack}
              aria-label="Go back to language selection"
              type="button"
            >
              <span aria-hidden="true">←</span>
              <span>{t.welcome || 'Back'}</span>
            </button>
            <div className="header-content">
              <h1 className="form-title">{t.title}</h1>
              <p className="form-subtitle">{t.subtitle}</p>
            </div>
          </div>

          <div className="form-card">
            <h2 className="section-title">{t.enterDetails}</h2>

            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  {t.nameLabel} *
                </label>
                <input
                  id="name"
                  type="text"
                  className="form-input"
                  value={farmerData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder={t.nameLabel}
                  required
                  aria-required="true"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone" className="form-label">
                  {t.phoneLabel} *
                </label>
                <input
                  id="phone"
                  type="tel"
                  className="form-input"
                  value={farmerData.phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder={t.phoneLabel}
                  pattern="[0-9]{10}"
                  maxLength="10"
                  required
                  aria-required="true"
                  aria-describedby="phone-help"
                />
                <small id="phone-help" className="help-text">
                  Enter 10-digit mobile number
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="state" className="form-label">
                  {t.stateLabel} *
                </label>
                <select
                  id="state"
                  className="form-select"
                  value={farmerData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  required
                  aria-required="true"
                >
                  <option value="">{t.select} {t.stateLabel}</option>
                  {states.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="district" className="form-label">
                  {t.districtLabel} *
                </label>
                <select
                  id="district"
                  className="form-select"
                  value={farmerData.district}
                  onChange={(e) => handleInputChange('district', e.target.value)}
                  disabled={!farmerData.state}
                  required
                  aria-required="true"
                  aria-label={farmerData.state ? `Select ${t.districtLabel}` : "Select state first"}
                >
                  <option value="">{farmerData.state ? `${t.select} ${t.districtLabel}` : `${t.selectStateFirst}`}</option>
                  {districts.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="soilType" className="form-label">
                  {t.soilLabel} *
                </label>
                <select
                  id="soilType"
                  className="form-select"
                  value={farmerData.soilType}
                  onChange={(e) => handleInputChange('soilType', e.target.value)}
                  required
                  aria-required="true"
                >
                  <option value="">{t.select} {t.soilLabel}</option>
                  {soilTypes.map(soil => (
                    <option key={soil} value={soil}>{soil}</option>
                  ))}
                </select>
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={farmerData.weatherSms}
                    onChange={(e) => handleInputChange('weatherSms', e.target.checked)}
                    aria-label="Subscribe to weather SMS alerts"
                  />
                  <span>{t.weatherSms}</span>
                </label>
                <small className="help-text">
                  Get daily weather updates for your crop
                </small>
              </div>

              {farmerData.weatherSms && (
                <div className="weather-fields">
                  <div className="form-group">
                    <label htmlFor="currentCrop" className="form-label">
                      {t.currentCrop} *
                    </label>
                    <input
                      id="currentCrop"
                      type="text"
                      className="form-input"
                      value={farmerData.currentCrop}
                      onChange={(e) => handleInputChange('currentCrop', e.target.value)}
                      placeholder={t.currentCrop}
                      required
                      aria-required="true"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="expectedDate" className="form-label">
                      {t.expectedDate} *
                    </label>
                    <input
                      id="expectedDate"
                      type="date"
                      className="form-input"
                      value={farmerData.expectedDate}
                      onChange={(e) => handleInputChange('expectedDate', e.target.value)}
                      required
                      aria-required="true"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
              )}

              <div className="form-actions">
                <button 
                  type="submit"
                  className={`submit-btn ${!isFormValid() ? 'disabled' : ''}`}
                  disabled={!isFormValid()}
                  aria-label={!isFormValid() ? "Please fill all required fields correctly" : "Submit farmer details"}
                >
                  {t.next}
                </button>
                
                <div className="form-note">
                  <small>* Required fields</small>
                  <small>All information is kept secure and confidential</small>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default FarmerDetail;