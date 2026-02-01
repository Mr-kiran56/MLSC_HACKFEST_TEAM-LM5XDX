// localData.jsx

// Language related functions
export const getSelectedLanguage = () => {
  return localStorage.getItem('selectedLanguage') || 'en'; // Default to English
};

export const setSelectedLanguage = (language) => {
  localStorage.setItem('selectedLanguage', language);
  return language;
};

export const getTranslation = (key) => {
  const lang = getSelectedLanguage();
  
  const translations = {
    en: {
      welcome: "Welcome",
      title: "Kisan Mitra",
      // Add more translations as needed
    },
    hi: {
      welcome: "स्वागत है",
      title: "किसान मित्र",
      // Add more translations as needed
    },
    te: {
      welcome: "స్వాగతం",
      title: "కిసాన్ మిత్ర",
      // Add more translations as needed
    },
    ta: {
      welcome: "வரவேற்கிறோம்",
      title: "கிசான் மித்திரா",
      // Add more translations as needed
    },
    kn: {
      welcome: "ಸ್ವಾಗತ",
      title: "ಕಿಸಾನ್ ಮಿತ್ರ",
      // Add more translations as needed
    },
    ml: {
      welcome: "സ്വാഗതം",
      title: "കിസാൻ മിത്ര",
      // Add more translations as needed
    }
  };
  
  return translations[lang]?.[key] || translations.en[key] || key;
};

// Farmer data related functions
export const getFarmerData = () => {
  const data = localStorage.getItem('farmerData');
  return data ? JSON.parse(data) : null;
};

export const setFarmerData = (data) => {
  localStorage.setItem('farmerData', JSON.stringify(data));
};

export const clearFarmerData = () => {
  localStorage.removeItem('farmerData');
};

// Clear all app data
export const clearAllData = () => {
  localStorage.removeItem('selectedLanguage');
  localStorage.removeItem('farmerData');
};