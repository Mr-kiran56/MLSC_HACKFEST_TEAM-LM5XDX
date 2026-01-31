import React, { useState, useEffect } from 'react';
import './farmerDetail_stunning.css';
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
      navigate("/");
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
    const baseFields = farmerData.name && 
                       farmerData.phone && 
                       farmerData.state && 
                       farmerData.district && 
                       farmerData.soilType;
    
    if (!baseFields) return false;
    
    if (farmerData.weatherSms) {
      return farmerData.currentCrop && farmerData.expectedDate;
    }
    
    return true;
  };

  const handleSubmit = () => {
    if (isFormValid()) {
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

  // Language Selection Screen
  if (currentStep === 'language') {
    return (
      <div className="app-container">
        <div className="language-selection">
          <div className="header-logo">
            <h1 className="app-title">KISAN MITRA</h1>
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
            <button 
              className="language-btn"
              onClick={() => handleLanguageSelect(Language.ENGLISH)}
            >
              <span className="lang-icon">🇬🇧</span>
              <span className="lang-name">English</span>
            </button>
            
            <button 
              className="language-btn"
              onClick={() => handleLanguageSelect(Language.HINDI)}
            >
              <span className="lang-icon">🇮🇳</span>
              <span className="lang-name">हिंदी</span>
            </button>
            
            <button 
              className="language-btn"
              onClick={() => handleLanguageSelect(Language.TELUGU)}
            >
              <span className="lang-icon">🇮🇳</span>
              <span className="lang-name">తెలుగు</span>
            </button>
            
            <button 
              className="language-btn"
              onClick={() => handleLanguageSelect(Language.TAMIL)}
            >
              <span className="lang-icon">🇮🇳</span>
              <span className="lang-name">தமிழ்</span>
            </button>
            
            <button 
              className="language-btn"
              onClick={() => handleLanguageSelect(Language.KANNADA)}
            >
              <span className="lang-icon">🇮🇳</span>
              <span className="lang-name">ಕನ್ನಡ</span>
            </button>
            
            <button 
              className="language-btn"
              onClick={() => handleLanguageSelect(Language.MALAYALAM)}
            >
              <span className="lang-icon">🇮🇳</span>
              <span className="lang-name">മലയാളം</span>
            </button>
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
            >
              <span>←</span>
              <span>{t.welcome || 'Back'}</span>
            </button>
            <div className="header-content">
              <h1 className="form-title">{t.title}</h1>
              <p className="form-subtitle">{t.subtitle}</p>
            </div>
          </div>

          <div className="form-card">
            <h2 className="section-title">{t.enterDetails}</h2>

            <div className="form-group">
              <label className="form-label">{t.nameLabel}</label>
              <input
                type="text"
                className="form-input"
                value={farmerData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder={t.nameLabel}
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t.phoneLabel}</label>
              <input
                type="tel"
                className="form-input"
                value={farmerData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder={t.phoneLabel}
                maxLength="10"
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t.stateLabel}</label>
              <select
                className="form-select"
                value={farmerData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
              >
                <option value="">{t.stateLabel}</option>
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">{t.districtLabel}</label>
              <select
                className="form-select"
                value={farmerData.district}
                onChange={(e) => handleInputChange('district', e.target.value)}
                disabled={!farmerData.state}
              >
                <option value="">{t.districtLabel}</option>
                {districts.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">{t.soilLabel}</label>
              <select
                className="form-select"
                value={farmerData.soilType}
                onChange={(e) => handleInputChange('soilType', e.target.value)}
              >
                <option value="">{t.soilLabel}</option>
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
                />
                <span>{t.weatherSms}</span>
              </label>
            </div>

            {farmerData.weatherSms && (
              <div className="weather-fields">
                <div className="form-group">
                  <label className="form-label">{t.currentCrop}</label>
                  <input
                    type="text"
                    className="form-input"
                    value={farmerData.currentCrop}
                    onChange={(e) => handleInputChange('currentCrop', e.target.value)}
                    placeholder={t.currentCrop}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{t.expectedDate}</label>
                  <input
                    type="date"
                    className="form-input"
                    value={farmerData.expectedDate}
                    onChange={(e) => handleInputChange('expectedDate', e.target.value)}
                  />
                </div>
              </div>
            )}

            <button 
              className={`submit-btn ${!isFormValid() ? 'disabled' : ''}`}
              onClick={handleSubmit}
              disabled={!isFormValid()}
            >
              {t.next}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default FarmerDetail;