import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { decode, decodeAudioData, createPcmBlob } from './utils/audio';
import { Visualizer } from './components/Visualizer';
import { Link } from "react-router-dom";

// Constants defined inline (no import needed)
const Language = {
  ENGLISH: 'English',
  TELUGU: 'Telugu',
  TAMIL: 'Tamil',
  KANNADA: 'Kannada',
  MALAYALAM: 'Malayalam',
  HINDI: 'Hindi'
};

const AgriTopic = {
  PEST_CONTROL: 'Pest & Disease Control',
  FERTILIZER: 'Fertilizer & Soil Health',
  MARKET_PRICES: 'Market Prices & Trends',
  WEATHER_ADVICE: 'Weather-based Sowing',
  GOVT_SCHEMES: 'Government Schemes'
};

// Translation dictionary
const translations = {
  [Language.ENGLISH]: {
    appName: 'KISAN MITRA',
    appSubtitle: 'AI Voice Assistant',
    ready: 'Ready',
    liveAssistant: 'Live Assistant',
    configuration: 'Configuration',
    imageAnalysis: 'Image Analysis',
    uploadFarmImage: 'Upload Farm Image',
    clickToUpload: 'Click to upload farm image',
    supportsFormat: 'Supports JPG, PNG up to 5MB',
    imageReady: 'Image ready for analysis',
    yourQuestion: 'Your Question',
    questionPlaceholder: 'Ask about pests, diseases, crop health, soil conditions...',
    language: 'Language',
    topic: 'Topic',
    analyzeImage: 'Analyze Image',
    analyzing: 'Analyzing...',
    endVoiceCall: 'End Voice Call',
    startVoiceAssistant: 'Start Voice Assistant',
    analysisResult: 'Analysis Result',
    expertConversation: 'Expert Conversation',
    geminiLive: 'GEMINI PRO LIVE',
    live: 'Live',
    startConversation: 'Start a conversation or upload an image',
    askAboutCrops: 'Ask about crops, pests, or upload farm images',
    analyzeThisUploadedImage: 'Analyze this uploaded image',
    connectToStart: 'Connect to start',
    startSpeaking: 'Start Speaking',
    farmerLanguage: 'Farmer Language',
    topicFocus: 'Topic Focus',
    farmerProfile: 'Farmer Profile',
    viewProfile: 'View Profile',
    profileDetails: 'Profile Details',
    name: 'Name',
    phone: 'Phone',
    state: 'State',
    district: 'District',
    soilType: 'Soil Type',
    weatherSms: 'Weather SMS',
    currentCrop: 'Current Crop',
    expectedDate: 'Expected Date',
    editProfile: 'Edit Profile',
    cropInfo: 'Crop Information',
    daysRemaining: 'Days Remaining',
    smsNotEnabled: 'SMS Alerts Not Enabled',
    enableSms: 'Enable SMS Alerts',
    notifications: 'Notifications'
  },
  [Language.TELUGU]: {
    appName: 'కిసాన్ మిత్ర',
    appSubtitle: 'AI వాయిస్ సహాయకుడు',
    ready: 'సిద్ధంగా',
    liveAssistant: 'లైవ్ సహాయకుడు',
    configuration: 'సెట్టింగ్లు',
    imageAnalysis: 'చిత్ర విశ్లేషణ',
    uploadFarmImage: 'ఫార్మ్ చిత్రం అప్లోడ్ చేయండి',
    clickToUpload: 'ఫార్మ్ చిత్రం అప్లోడ్ చేయడానికి క్లిక్ చేయండి',
    supportsFormat: 'JPG, PNG 5MB వరకు మాత్రమే',
    imageReady: 'చిత్రం విశ్లేషణకు సిద్ధంగా ఉంది',
    yourQuestion: 'మీ ప్రశ్న',
    questionPlaceholder: 'కీటకాలు, వ్యాధులు, పంట ఆరోగ్యం, మట్టి స్థితి గురించి అడగండి...',
    language: 'భాష',
    topic: 'విషయం',
    analyzeImage: 'చిత్రాన్ని విశ్లేషించండి',
    analyzing: 'విశ్లేషిస్తోంది...',
    endVoiceCall: 'వాయిస్ కాల్ ముగించు',
    startVoiceAssistant: 'వాయిస్ సహాయకుడిని ప్రారంభించు',
    analysisResult: 'విశ్లేషణ ఫలితం',
    expertConversation: 'నిపుణుల సంభాషణ',
    geminiLive: 'జెమిని ప్రో లైవ్',
    live: 'లైవ్',
    startConversation: 'సంభాషణ ప్రారంభించండి లేదా చిత్రం అప్లోడ్ చేయండి',
    askAboutCrops: 'పంటలు, కీటకాలు గురించి అడగండి లేదా ఫార్మ్ చిత్రాలు అప్లోడ్ చేయండి',
    analyzeThisUploadedImage: 'ఈ అప్లోడ్ చేసిన చిత్రాన్ని విశ్లేషించండి',
    connectToStart: 'ప్రారంభించడానికి కనెక్ట్ చేయండి',
    startSpeaking: 'మాట్లాడటం ప్రారంభించండి',
    farmerLanguage: 'రైతు భాష',
    topicFocus: 'విషయ దృష్టి',
    farmerProfile: 'రైతు ప్రొఫైల్',
    viewProfile: 'ప్రొఫైల్ చూడండి',
    profileDetails: 'ప్రొఫైల్ వివరాలు',
    name: 'పేరు',
    phone: 'ఫోన్',
    state: 'రాష్ట్రం',
    district: 'జిల్లా',
    soilType: 'మట్టి రకం',
    weatherSms: 'వాతావరణ ఎస్ఎంఎస్',
    currentCrop: 'ప్రస్తుత పంట',
    expectedDate: 'అంచనా తేదీ',
    editProfile: 'ప్రొఫైల్ సవరించు',
    cropInfo: 'పంట సమాచారం',
    daysRemaining: 'మిగిలిన రోజులు',
    smsNotEnabled: 'ఎస్ఎంఎస్ హెచ్చరికలు ప్రారంభించబడలేదు',
    enableSms: 'ఎస్ఎంఎస్ హెచ్చరికలు ప్రారంభించండి',
    notifications: 'నోటిఫికేషన్లు'
  },
  // Add other languages similarly...
};

const VoiceAgent = () => {
  const [config, setConfig] = useState({ 
    language: Language.TELUGU, 
    topic: AgriTopic.PEST_CONTROL 
  });
  
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [transcription, setTranscription] = useState([]);
  const [activeUserText, setActiveUserText] = useState('');
  const [activeAiText, setActiveAiText] = useState('');
  
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [userQuery, setUserQuery] = useState('');
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [imageAnalysis, setImageAnalysis] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  
  // Farmer data state
  const [farmerData, setFarmerData] = useState({
    name: 'Raju Kumar',
    phone: '+91 9876543210',
    state: 'Telangana',
    district: 'Karimnagar',
    soilType: 'Black Soil',
    weatherSms: false,
    currentCrop: 'Paddy',
    expectedDate: '2024-12-15'
  });

  const scrollRef = useRef(null);
  const audioContextRef = useRef(null);
  const sessionRef = useRef(null);
  const sourcesRef = useRef(new Set());
  const nextStartTimeRef = useRef(0);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  const userTranscriptionRef = useRef('');
  const aiTranscriptionRef = useRef('');

  // Get current translations based on selected language
  const t = translations[config.language];

  // Calculate days remaining
  const calculateDaysRemaining = () => {
    const today = new Date();
    const expected = new Date(farmerData.expectedDate);
    const diffTime = expected - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Load farmer data from localStorage on component mount
  useEffect(() => {
    const savedFarmerData = localStorage.getItem('farmerData');
    if (savedFarmerData) {
      setFarmerData(JSON.parse(savedFarmerData));
    }
  }, []);

  // Save farmer data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('farmerData', JSON.stringify(farmerData));
  }, [farmerData]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [transcription, activeAiText, activeUserText]);

  const stopSession = useCallback(() => {
    if (sessionRef.current) {
      try { sessionRef.current.close(); } catch (e) {}
      sessionRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    sourcesRef.current.forEach(source => {
      try { source.stop(); } catch (e) {}
    });
    sourcesRef.current.clear();
    setIsConnected(false);
    setIsConnecting(false);
    userTranscriptionRef.current = '';
    aiTranscriptionRef.current = '';
    setActiveUserText('');
    setActiveAiText('');
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      alert('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setSelectedImage(file);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) {
      alert('Please upload an image first');
      return;
    }

    setIsAnalyzingImage(true);
    try {
      const base64Image = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64 = e.target.result.split(',')[1];
          resolve(base64);
        };
        reader.readAsDataURL(selectedImage);
      });

      const ai = new GoogleGenAI({ apiKey: 'AIzaSyB_AS7Vv1cStEeeFnKs3nE-_BpssumYtqM' });
      
      const model = ai.models.generateContent({
        model: 'gemini-1.5-flash',
      });

      const prompt = userQuery 
        ? `Analyze this agricultural image and answer the following question: ${userQuery}`
        : `Analyze this agricultural image. Identify crops, pests, diseases, soil conditions, or any visible agricultural issues. Provide recommendations in ${config.language} language.`;

      const result = await model.generateContent({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: prompt
              },
              {
                inlineData: {
                  mimeType: selectedImage.type,
                  data: base64Image
                }
              }
            ]
          }
        ]
      });

      const analysisText = await result.response.text();
      setImageAnalysis(analysisText);
      
      setTranscription(prev => [
        ...prev,
        { 
          role: 'user', 
          text: userQuery || t.analyzeThisUploadedImage, 
          timestamp: Date.now(),
          hasImage: true,
          imagePreview: imagePreview 
        },
        { 
          role: 'model', 
          text: analysisText, 
          timestamp: Date.now() 
        }
      ]);

      setUserQuery('');
      removeImage();

    } catch (error) {
      console.error('Image analysis error:', error);
      alert('Failed to analyze image. Please try again.');
    } finally {
      setIsAnalyzingImage(false);
    }
  };

  const startSession = async () => {
    if (isConnected || isConnecting) return;
    setIsConnecting(true);

    try {
      const ai = new GoogleGenAI({ apiKey:'AIzaSyAzto3p17XgBpvHKMA-FN4muLVtcqc-Vtg' });

      if (!audioContextRef.current) {
        audioContextRef.current = {
          input: new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 }),
          output: new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 }),
        };
      }

      const { input: inputCtx, output: outputCtx } = audioContextRef.current;
      await inputCtx.resume();
      await outputCtx.resume();

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const knowledgeBase = `
        KNOWLEDGE DOMAIN: Indian Agriculture Expert (Focused on South India)
        CORE DATA:
        - Pests: Brown Plant Hopper (Paddy), Pink Bollworm (Cotton), Thrips (Chillies), Fall Armyworm (Maize).
        - Fertilizers: Urea, DAP, MOP ratios for regional soils.
        - Schemes: PM-KISAN, Rythu Bandhu, Rythu Bharosa, Krishi Bhagya.
        
        INSTRUCTIONS:
        1. Act as 'Kisan Mitra'.
        2. Speak in ${config.language} language.
        3. Primary focus: ${config.topic}.
        4. Use regional terms.
        5. Actionable, warm advice for farmers.
      `;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
          systemInstruction: knowledgeBase,
          outputAudioTranscription: {},
          inputAudioTranscription: {},
        },
        callbacks: {
          onopen: () => {
            setIsConnected(true);
            setIsConnecting(false);

            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createPcmBlob(inputData);
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message) => {
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              const audioBuffer = await decodeAudioData(decode(base64Audio), outputCtx, 24000, 1);
              const source = outputCtx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputCtx.destination);
              source.onended = () => sourcesRef.current.delete(source);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.inputTranscription) {
              userTranscriptionRef.current += message.serverContent.inputTranscription.text;
              setActiveUserText(userTranscriptionRef.current);
            }
            if (message.serverContent?.outputTranscription) {
              aiTranscriptionRef.current += message.serverContent.outputTranscription.text;
              setActiveAiText(aiTranscriptionRef.current);
            }

            if (message.serverContent?.turnComplete) {
              const uText = userTranscriptionRef.current;
              const aText = aiTranscriptionRef.current;

              if (uText.trim() || aText.trim()) {
                setTranscription(prev => [
                  ...prev,
                  ...(uText.trim() ? [{ role: 'user', text: uText, timestamp: Date.now() }] : []),
                  ...(aText.trim() ? [{ role: 'model', text: aText, timestamp: Date.now() }] : [])
                ]);
              }
              
              userTranscriptionRef.current = '';
              aiTranscriptionRef.current = '';
              setActiveUserText('');
              setActiveAiText('');
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => {
                try { s.stop(); } catch (e) {}
              });
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
            console.error('Session error:', e);
            stopSession();
          },
          onclose: () => {
            stopSession();
          },
        },
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error('Connection failed:', err);
      setIsConnecting(false);
      alert('Connection failed. Please check your internet and microphone permissions.');
    }
  };

  const toggleProfile = () => {
    setShowProfile(!showProfile);
  };

  const enableSMSAlerts = () => {
    setFarmerData(prev => ({
      ...prev,
      weatherSms: true
    }));
    alert(t.language === Language.ENGLISH ? 'SMS Alerts Enabled Successfully!' : 'ఎస్ఎంఎస్ హెచ్చరికలు విజయవంతంగా ప్రారంభించబడ్డాయి!');
  };

  const daysRemaining = calculateDaysRemaining();

  return (
  <div className="min-h-screen w-full bg-[#f8faf7] flex flex-col font-sans">

      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4">
              {/* Language Icon */}
              <Link to="/">
                <img
                  src="/src/assets/languages.png"
                  alt="Languages"
                  className="w-12 h-12 cursor-pointer hover:scale-105 transition-transform"
                />
              </Link>

              {/* Profile Icon */}
              <button
                onClick={toggleProfile}
                className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-green-100 rounded-2xl flex items-center justify-center shadow-md hover:shadow-lg transition-all hover:scale-105"
                title={t.viewProfile}
              >
                <ProfileIcon className="w-6 h-6 text-emerald-600" />
              </button>

              {/* Leaf Icon */}
              <div className="w-12 h-12 bg-[#1a4d2e] rounded-2xl flex items-center justify-center shadow-lg shadow-green-100 -rotate-3">
                <LeafIcon className="w-7 h-7 text-[#ffcc00]" />
              </div>

              {/* Title */}
              <div>
                <h1 className="text-xl font-black text-slate-800">
                  {t.appName}
                </h1>
                <p className="text-[10px] font-bold text-green-700 uppercase tracking-widest mt-1">
                  {t.appSubtitle}
                </p>
              </div>
            </div>

            {/* Status */}
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
              <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? "bg-green-500 animate-pulse" : "bg-slate-300"}`} />
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                {isConnected ? t.liveAssistant : t.ready}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Panel */}
        <div className="lg:col-span-4 space-y-6">
          {/* Profile Card - Shows when profile is toggled */}
          {showProfile && (
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-emerald-100 animate-slideDown">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-sm font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                  <ProfileIcon className="w-4 h-4" /> {t.farmerProfile}
                </h2>
                <button
                  onClick={toggleProfile}
                  className="text-sm text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl font-bold">
                      {farmerData.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{farmerData.name}</h3>
                    <p className="text-sm text-slate-600">{farmerData.state}, {farmerData.district}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-emerald-50 p-3 rounded-xl">
                    <p className="text-xs text-slate-500">{t.phone}</p>
                    <p className="text-sm font-medium text-slate-800">{farmerData.phone}</p>
                  </div>
                  <div className="bg-emerald-50 p-3 rounded-xl">
                    <p className="text-xs text-slate-500">{t.soilType}</p>
                    <p className="text-sm font-medium text-slate-800">{farmerData.soilType}</p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-4 rounded-xl">
                  <h4 className="text-xs font-bold text-emerald-800 mb-2 flex items-center gap-2">
                    <CropIcon className="w-4 h-4" /> {t.cropInfo}
                  </h4>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{farmerData.currentCrop}</p>
                      <p className="text-xs text-slate-600">{t.expectedDate}: {farmerData.expectedDate}</p>
                    </div>
                    <div className="bg-white px-3 py-1 rounded-full">
                      <span className="text-sm font-bold text-emerald-600">{daysRemaining} {t.daysRemaining}</span>
                    </div>
                  </div>
                </div>

                {!farmerData.weatherSms && (
                  <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 p-4 rounded-xl">
                    <div className="flex items-start gap-3">
                      <AlertIcon className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-yellow-800 mb-1">{t.smsNotEnabled}</h4>
                        <p className="text-xs text-yellow-700 mb-3">
                          {t.language === Language.ENGLISH 
                            ? 'Enable SMS alerts for weather updates and crop advisories'
                            : 'వాతావరణ నవీకరణలు మరియు పంట సలహాల కోసం ఎస్ఎంఎస్ హెచ్చరికలను ప్రారంభించండి'}
                        </p>
                        <button
                          onClick={enableSMSAlerts}
                          className="w-full py-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-sm font-medium rounded-lg hover:from-yellow-600 hover:to-amber-600 transition-all"
                        >
                          {t.enableSms}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <button className="w-full py-3 border-2 border-emerald-200 text-emerald-600 font-medium rounded-xl hover:bg-emerald-50 transition-colors">
                  {t.editProfile}
                </button>
              </div>
            </div>
          )}

          {/* Main Configuration Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 sticky top-28">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <UploadIcon className="w-4 h-4" /> {t.imageAnalysis}
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-slate-800 mb-3 block">{t.uploadFarmImage}</label>
                <div 
                  className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all hover:border-green-400 hover:bg-green-50 ${
                    imagePreview ? 'border-green-300 bg-green-50' : 'border-slate-200'
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  
                  {imagePreview ? (
                    <div className="relative">
                      <img 
                        src={imagePreview} 
                        alt="Uploaded farm" 
                        className="w-full h-48 object-cover rounded-xl mb-4"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage();
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                      <p className="text-xs text-slate-600 mt-2">{t.imageReady}</p>
                    </div>
                  ) : (
                    <div className="py-8">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <UploadIcon className="w-6 h-6 text-slate-400" />
                      </div>
                      <p className="text-sm font-medium text-slate-600 mb-1">
                        {t.clickToUpload}
                      </p>
                      <p className="text-xs text-slate-400">
                        {t.supportsFormat}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 mb-3 block">{t.yourQuestion}</label>
                <textarea
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  placeholder={t.questionPlaceholder}
                  className="w-full h-32 p-4 text-sm border border-slate-200 rounded-2xl focus:border-green-400 focus:ring-2 focus:ring-green-100 focus:outline-none resize-none bg-slate-50"
                  disabled={isAnalyzingImage}
                />
              </div>

              {/* <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-800 mb-2 block">{t.language}</label>
                  <select
                    value={config.language}
                    onChange={(e) => setConfig({...config, language: e.target.value})}
                    className="w-full p-3 text-sm border border-slate-200 rounded-xl focus:border-green-400 focus:outline-none bg-white"
                  >
                    {Object.values(Language).map((lang) => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-800 mb-2 block">{t.topic}</label>
                  <select
                    value={config.topic}
                    onChange={(e) => setConfig({...config, topic: e.target.value})}
                    className="w-full p-3 text-sm border border-slate-200 rounded-xl focus:border-green-400 focus:outline-none bg-white"
                  >
                    {Object.values(AgriTopic).map((topic) => (
                      <option key={topic} value={topic}>{topic}</option>
                    ))}
                  </select>
                </div>
              </div> */}

              <div className="space-y-3 pt-4">
                <button
                  onClick={analyzeImage}
                  disabled={!selectedImage || isAnalyzingImage}
                  className={`w-full py-4 rounded-2xl flex items-center justify-center font-black uppercase tracking-tighter transition-all ${
                    selectedImage 
                      ? 'bg-[#1a4d2e] hover:bg-[#0f3a21] text-white' 
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  } ${isAnalyzingImage ? 'opacity-50' : ''}`}
                >
                  {isAnalyzingImage ? (
                    <>
                      <LoadingSpinner className="w-5 h-5 mr-2" />
                      {t.analyzing}
                    </>
                  ) : (
                    <>
                      <AnalyzeIcon className="w-5 h-5 mr-2" />
                      {t.analyzeImage}
                    </>
                  )}
                </button>

                <button
                  onClick={isConnected ? stopSession : startSession}
                  disabled={isConnecting}
                  className={`w-full py-4 rounded-2xl flex items-center justify-center font-black uppercase tracking-tighter transition-all shadow-lg ${
                    isConnected 
                      ? 'bg-red-500 hover:bg-red-600 text-white' 
                      : 'bg-[#ffcc00] hover:bg-[#f2c200] text-[#1a4d2e]'
                  } disabled:opacity-50`}
                >
                  {isConnecting ? (
                    <LoadingSpinner className="w-5 h-5" />
                  ) : isConnected ? (
                    <>
                      <StopIcon className="w-5 h-5 mr-2" />
                      {t.endVoiceCall}
                    </>
                  ) : (
                    <>
                      <MicIcon className="w-5 h-5 mr-2" />
                      {t.startVoiceAssistant}
                    </>
                  )}
                </button>
              </div>

              {imageAnalysis && (
                <div className="mt-6 p-4 bg-green-50 border border-green-100 rounded-2xl">
                  <h3 className="text-xs font-bold text-green-800 mb-2">{t.analysisResult}</h3>
                  <p className="text-sm text-slate-700">{imageAnalysis}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Conversation */}
        <div className="lg:col-span-8 flex flex-col h-[600px] lg:h-auto">
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col flex-1 overflow-hidden">
            <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <BotIcon className="w-5 h-5 text-green-700" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">{t.expertConversation}</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t.geminiLive}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`} />
                <span className="text-xs font-bold text-slate-600">
                  {isConnected ? t.live : t.ready}
                </span>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-8">
              {transcription.length === 0 && !activeUserText && !activeAiText && (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                  <ChatIcon className="w-10 h-10 text-slate-300 mb-4" />
                  <h4 className="text-lg font-black text-slate-800 italic">{t.startConversation}</h4>
                  <p className="text-sm text-slate-500 mt-2">{t.askAboutCrops}</p>
                </div>
              )}
              
              {transcription.map((turn, idx) => (
                <div key={idx} className={`flex ${turn.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-6 py-4 rounded-3xl text-sm font-medium ${
                    turn.role === 'user' 
                      ? 'bg-slate-800 text-white rounded-tr-none' 
                      : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                  }`}>
                    {turn.hasImage && turn.imagePreview && (
                      <div className="mb-3">
                        <img 
                          src={turn.imagePreview} 
                          alt="Farm analysis" 
                          className="w-48 h-32 object-cover rounded-lg"
                        />
                      </div>
                    )}
                    <p className="leading-relaxed">{turn.text}</p>
                  </div>
                </div>
              ))}
              
              {activeUserText && (
                <div className="flex justify-end opacity-50 italic">
                  <div className="max-w-[85%] px-6 py-4 rounded-3xl bg-slate-50 text-slate-600 border border-dashed border-slate-200 text-sm">
                    {activeUserText}
                  </div>
                </div>
              )}
              
              {activeAiText && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] px-6 py-4 rounded-3xl bg-green-50 text-slate-800 text-sm border border-green-100 rounded-tl-none">
                    {activeAiText}
                  </div>
                </div>
              )}
            </div>

            <div className="p-8 bg-slate-50/50 border-t border-slate-100">
              <div className="max-w-xl mx-auto">
                <Visualizer isActive={isConnected} />
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="h-2 bg-[#ffcc00] w-full" />
    </div>
  );
};

// Icon Components
const LeafIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const ProfileIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const CropIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
  </svg>
);

const AlertIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
  </svg>
);

const UploadIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

const TrashIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const AnalyzeIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

const MicIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
  </svg>
);

const StopIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
  </svg>
);

const BotIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const ChatIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const LoadingSpinner = ({ className }) => (
  <svg className={`animate-spin ${className}`} fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export default VoiceAgent;