import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit3,
  Save,
  X,
  Camera,
  Upload,
  Check,
  AlertCircle,
  Users,
  BookOpen,
  Heart,
  Globe,
  Github,
  Instagram,
  Linkedin,
  Twitter,
  Facebook,
  GraduationCap,
  Award,
  Clock,
  Star,
  Settings,
  Lock,
  Eye,
  EyeOff,
  Copy,
  QrCode,
  Download,
  Share2,
  RefreshCw,
  MessageCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import CountUp from 'react-countup';
import './Profile.css';

const Profile = () => {
  const { student, syncWithProfile } = useData();
  
  // Загружаем данные из localStorage или используем значения по умолчанию
  const [profileData, setProfileData] = useState(() => {
    const savedData = localStorage.getItem('studentProfile');
    if (savedData) {
      return JSON.parse(savedData);
    }
    return {
      // Основная информация
      firstName: student.firstName || 'Александр',
      lastName: student.lastName || 'Петров',
      middleName: 'Владимирович',
      gender: 'Мужской',
      email: 'aleksandr.petrov@university.edu',
      phone: '+7 (999) 123-45-67',
      birthDate: '2004-03-15',
      avatar: null,
      
      // Учебная информация
      group: student.group || 'SE',
      course: student.course || '1',
      specialty: 'Информационные технологии',
      admissionYear: '2022',
      studentId: 'ST-2022-001',
      
      // Контактная информация
      address: {
        city: 'Москва',
        street: 'ул. Студенческая, д. 15',
        apartment: 'кв. 42',
        zipCode: '119991'
      },
      
      // Социальные сети
      socialMedia: {
        telegram: '@alex_petrov',
        instagram: '',
        linkedin: '',
        github: 'alex-petrov',
        twitter: '',
        facebook: ''
      },
      
      // Дополнительная информация
      bio: 'Студент 3 курса факультета ИТ. Увлекаюсь веб-разработкой и машинным обучением.',
      interests: ['Программирование', 'Фотография', 'Путешествия', 'Музыка'],
      languages: ['Русский (родной)', 'Английский (B2)', 'Python', 'JavaScript'],
      
      // Настройки приватности
      privacy: {
        showEmail: true,
        showPhone: false,
        showAddress: false,
        showSocialMedia: true
      }
    };
  });

  const [editMode, setEditMode] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [tempData, setTempData] = useState(profileData);
  const [saveStatus, setSaveStatus] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // Сохраняем данные в localStorage при каждом изменении
  useEffect(() => {
    localStorage.setItem('studentProfile', JSON.stringify(profileData));
  }, [profileData]);

  // Статистика профиля
  const getProfileStats = () => {
    const completedFields = Object.values(profileData).filter(value => {
      if (typeof value === 'string') return value.trim() !== '';
      if (typeof value === 'object' && value !== null) {
        return Object.values(value).some(v => v && v.toString().trim() !== '');
      }
      return value !== null && value !== undefined;
    }).length;
    
    const totalFields = 15; // Сбалансированное количество основных полей
    const completionPercentage = Math.round((completedFields / totalFields) * 100);
    
    return {
      completionPercentage,
      completedFields,
      totalFields,
      hasAvatar: !!profileData.avatar,
      socialMediaCount: Object.values(profileData.socialMedia).filter(v => v.trim() !== '').length
    };
  };

  const profileStats = getProfileStats();

  // Статистические карточки
  const stats = [
    {
      icon: User,
      label: 'Заполненность профиля',
      value: profileStats.completionPercentage,
      color: '#3b82f6',
      trend: 'хорошо',
      description: 'Процент заполнения',
      suffix: '%'
    },
    {
      icon: Clock,
      label: 'Курс обучения',
      value: parseInt(profileData.course),
      color: '#10b981',
      trend: profileData.admissionYear,
      description: 'Год поступления'
    },
    {
      icon: Users,
      label: 'Группа',
      value: profileData.group,
      color: '#f59e0b',
      trend: 'активная',
      description: 'Учебная группа',
      isText: true
    },
    {
      icon: Globe,
      label: 'Соц. сети',
      value: profileStats.socialMediaCount,
      color: '#8b5cf6',
      trend: '+1',
      description: 'Подключенных аккаунтов'
    }
  ];

  // Валидация данных
  const validateField = (field, value) => {
    const errors = {};
    
    switch (field) {
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.email = 'Некорректный email';
        }
        break;
      case 'phone':
        if (!/^\+?[\d\s\-\(\)]{10,}$/.test(value)) {
          errors.phone = 'Некорректный номер телефона';
        }
        break;
      case 'firstName':
      case 'lastName':
        if (value.trim().length < 2) {
          errors[field] = 'Минимум 2 символа';
        }
        break;
    }
    
    return errors;
  };

  // Функции для редактирования
  const startEdit = (field) => {
    setEditingField(field);
    setTempData(profileData);
    setValidationErrors({});
  };

  const cancelEdit = () => {
    setEditingField(null);
    setTempData(profileData);
    setValidationErrors({});
  };

  const saveField = (field) => {
    // Для вложенных полей
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      const value = tempData[parent][child];
      const errors = validateField(field, value);
      
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        return;
      }
    } else {
      // Для обычных полей
      const errors = validateField(field, tempData[field]);
      
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        return;
      }
    }
    
    setProfileData(tempData);
    setEditingField(null);
    setSaveStatus('success');
    setTimeout(() => setSaveStatus(null), 2000);
    
    // Синхронизируем с DataContext
    setTimeout(() => syncWithProfile(), 100);
  };

  const updateTempData = (field, value) => {
    setTempData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateNestedTempData = (parent, field, value) => {
    setTempData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  // Обработка загрузки аватара
  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData(prev => ({
          ...prev,
          avatar: e.target.result
        }));
        setSaveStatus('success');
        setTimeout(() => setSaveStatus(null), 2000);
        
        // Синхронизируем с DataContext
        setTimeout(() => syncWithProfile(), 100);
      };
      reader.readAsDataURL(file);
    }
  };

  // Добавление/удаление интересов
  const addInterest = (interest) => {
    if (interest.trim() && !tempData.interests.includes(interest.trim())) {
      setTempData(prev => ({
        ...prev,
        interests: [...prev.interests, interest.trim()]
      }));
    }
  };

  const removeInterest = (interest) => {
    setTempData(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };

  // Добавление/удаление языков
  const addLanguage = (language) => {
    if (language.trim() && !tempData.languages.includes(language.trim())) {
      setTempData(prev => ({
        ...prev,
        languages: [...prev.languages, language.trim()]
      }));
    }
  };

  const removeLanguage = (language) => {
    setTempData(prev => ({
      ...prev,
      languages: prev.languages.filter(l => l !== language)
    }));
  };

  // Форматирование даты
  const formatDate = (dateString) => {
    return format(new Date(dateString), 'd MMMM yyyy', { locale: ru });
  };

  // Вычисление возраста
  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  // Прогресс заполнения профиля
  const completionProgress = {
    current: profileStats.completedFields,
    total: profileStats.totalFields,
    percentage: profileStats.completionPercentage
  };

  return (
    <div className="profile">
      <div className="container">
        {/* Header */}
        <div className="profile-header">
          <div className="header-content">
            <div className="welcome-section">
              <h1>
                <User className="header-icon" />
                Мой профиль
              </h1>
              <p className="header-subtitle">
                Личная информация и настройки • {profileData.firstName} {profileData.lastName}
              </p>
            </div>
            <div className="completion-progress-card">
              <div className="progress-info">
                <h3>Заполненность профиля</h3>
                <p>{completionProgress.current} из {completionProgress.total} полей</p>
              </div>
              <div className="progress-circle">
                <CircularProgressbar
                  value={completionProgress.percentage}
                  text={`${completionProgress.percentage}%`}
                  styles={buildStyles({
                    pathColor: '#3b82f6',
                    textColor: 'var(--foreground)',
                    trailColor: 'var(--muted)',
                    textSize: '16px'
                  })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save Status */}
        {saveStatus && (
          <div className={`save-status ${saveStatus}`}>
            <div className="save-status-content">
              {saveStatus === 'success' ? (
                <>
                  <Check size={16} />
                  <span>Данные сохранены</span>
                </>
              ) : (
                <>
                  <AlertCircle size={16} />
                  <span>Ошибка сохранения</span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card-enhanced">
              <div className="stat-header">
                <div className="stat-icon" style={{ backgroundColor: stat.color }}>
                  <stat.icon size={24} color="white" />
                </div>
                <div className="stat-trend" style={{ color: stat.color }}>
                  {stat.trend}
                </div>
              </div>
              <div className="stat-content">
                <div className="stat-value">
                  {stat.isText ? (
                    stat.value
                  ) : (
                    <CountUp 
                      end={stat.value} 
                      duration={2}
                      preserveValue
                      suffix={stat.suffix || ''}
                    />
                  )}
                </div>
                <div className="stat-label">{stat.label}</div>
                <div className="stat-description">{stat.description}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Profile Content */}
        <div className="profile-content">
          {/* Main Profile Card */}
          <div className="profile-main-card card">
            <div className="profile-card-header">
              <h3>
                <User size={16} />
                Основная информация
              </h3>
            </div>
            
            <div className="profile-avatar-section">
              <div className="avatar-container">
                {profileData.avatar ? (
                  <img src={profileData.avatar} alt="Аватар" className="avatar-image" />
                ) : (
                  <div className="avatar-placeholder">
                    <User size={48} />
                  </div>
                )}
                <label className="avatar-upload-btn" htmlFor="avatar-upload">
                  <Camera size={16} />
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  style={{ display: 'none' }}
                />
              </div>
              
              <div className="profile-name-section">
                <h2>{profileData.firstName} {profileData.lastName}</h2>
                <p>{profileData.specialty}</p>
                <div className="profile-badges">
                  <span className="badge">Группа {profileData.group}</span>
                  <span className="badge">{profileData.course} курс</span>
                </div>
              </div>
            </div>

            <div className="profile-fields">
              {/* Имя */}
              <div className="field-group">
                <label>Имя</label>
                {editingField === 'firstName' ? (
                  <div className="edit-field">
                    <input
                      type="text"
                      value={tempData.firstName}
                      onChange={(e) => updateTempData('firstName', e.target.value)}
                      className={validationErrors.firstName ? 'error' : ''}
                    />
                    <div className="edit-actions">
                      <button onClick={() => saveField('firstName')} className="btn btn-primary">
                        <Check size={14} />
                      </button>
                      <button onClick={cancelEdit} className="btn btn-secondary">
                        <X size={14} />
                      </button>
                    </div>
                    {validationErrors.firstName && (
                      <span className="error-message">{validationErrors.firstName}</span>
                    )}
                  </div>
                ) : (
                  <div className="display-field">
                    <span>{profileData.firstName}</span>
                    <button onClick={() => startEdit('firstName')} className="edit-btn">
                      <Edit3 size={14} />
                    </button>
                  </div>
                )}
              </div>

              {/* Фамилия */}
              <div className="field-group">
                <label>Фамилия</label>
                {editingField === 'lastName' ? (
                  <div className="edit-field">
                    <input
                      type="text"
                      value={tempData.lastName}
                      onChange={(e) => updateTempData('lastName', e.target.value)}
                      className={validationErrors.lastName ? 'error' : ''}
                    />
                    <div className="edit-actions">
                      <button onClick={() => saveField('lastName')} className="btn btn-primary">
                        <Check size={14} />
                      </button>
                      <button onClick={cancelEdit} className="btn btn-secondary">
                        <X size={14} />
                      </button>
                    </div>
                    {validationErrors.lastName && (
                      <span className="error-message">{validationErrors.lastName}</span>
                    )}
                  </div>
                ) : (
                  <div className="display-field">
                    <span>{profileData.lastName}</span>
                    <button onClick={() => startEdit('lastName')} className="edit-btn">
                      <Edit3 size={14} />
                    </button>
                  </div>
                )}
              </div>

              {/* Отчество */}
              <div className="field-group">
                <label>Отчество</label>
                {editingField === 'middleName' ? (
                  <div className="edit-field">
                    <input
                      type="text"
                      value={tempData.middleName}
                      onChange={(e) => updateTempData('middleName', e.target.value)}
                    />
                    <div className="edit-actions">
                      <button onClick={() => saveField('middleName')} className="btn btn-primary">
                        <Check size={14} />
                      </button>
                      <button onClick={cancelEdit} className="btn btn-secondary">
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="display-field">
                    <span>{profileData.middleName}</span>
                    <button onClick={() => startEdit('middleName')} className="edit-btn">
                      <Edit3 size={14} />
                    </button>
                  </div>
                )}
              </div>

              {/* Пол */}
              <div className="field-group">
                <label>Пол</label>
                {editingField === 'gender' ? (
                  <div className="edit-field">
                    <select
                      value={tempData.gender}
                      onChange={(e) => updateTempData('gender', e.target.value)}
                    >
                      <option value="Мужской">Мужской</option>
                      <option value="Женский">Женский</option>
                    </select>
                    <div className="edit-actions">
                      <button onClick={() => saveField('gender')} className="btn btn-primary">
                        <Check size={14} />
                      </button>
                      <button onClick={cancelEdit} className="btn btn-secondary">
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="display-field">
                    <span>{profileData.gender}</span>
                    <button onClick={() => startEdit('gender')} className="edit-btn">
                      <Edit3 size={14} />
                    </button>
                  </div>
                )}
              </div>

              {/* Email */}
              <div className="field-group">
                <label>
                  <Mail size={16} />
                  Email
                </label>
                {editingField === 'email' ? (
                  <div className="edit-field">
                    <input
                      type="email"
                      value={tempData.email}
                      onChange={(e) => updateTempData('email', e.target.value)}
                      className={validationErrors.email ? 'error' : ''}
                    />
                    <div className="edit-actions">
                      <button onClick={() => saveField('email')} className="btn btn-primary">
                        <Check size={14} />
                      </button>
                      <button onClick={cancelEdit} className="btn btn-secondary">
                        <X size={14} />
                      </button>
                    </div>
                    {validationErrors.email && (
                      <span className="error-message">{validationErrors.email}</span>
                    )}
                  </div>
                ) : (
                  <div className="display-field">
                    <span>{profileData.email}</span>
                    <button onClick={() => startEdit('email')} className="edit-btn">
                      <Edit3 size={14} />
                    </button>
                  </div>
                )}
              </div>

              {/* Телефон */}
              <div className="field-group">
                <label>
                  <Phone size={16} />
                  Телефон
                </label>
                {editingField === 'phone' ? (
                  <div className="edit-field">
                    <input
                      type="tel"
                      value={tempData.phone}
                      onChange={(e) => updateTempData('phone', e.target.value)}
                      className={validationErrors.phone ? 'error' : ''}
                    />
                    <div className="edit-actions">
                      <button onClick={() => saveField('phone')} className="btn btn-primary">
                        <Check size={14} />
                      </button>
                      <button onClick={cancelEdit} className="btn btn-secondary">
                        <X size={14} />
                      </button>
                    </div>
                    {validationErrors.phone && (
                      <span className="error-message">{validationErrors.phone}</span>
                    )}
                  </div>
                ) : (
                  <div className="display-field">
                    <span>{profileData.phone}</span>
                    <button onClick={() => startEdit('phone')} className="edit-btn">
                      <Edit3 size={14} />
                    </button>
                  </div>
                )}
              </div>

              {/* Дата рождения */}
              <div className="field-group">
                <label>
                  <Calendar size={16} />
                  Дата рождения
                </label>
                {editingField === 'birthDate' ? (
                  <div className="edit-field">
                    <input
                      type="date"
                      value={tempData.birthDate}
                      onChange={(e) => updateTempData('birthDate', e.target.value)}
                    />
                    <div className="edit-actions">
                      <button onClick={() => saveField('birthDate')} className="btn btn-primary">
                        <Check size={14} />
                      </button>
                      <button onClick={cancelEdit} className="btn btn-secondary">
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="display-field">
                    <span>{formatDate(profileData.birthDate)} ({calculateAge(profileData.birthDate)} лет)</span>
                    <button onClick={() => startEdit('birthDate')} className="edit-btn">
                      <Edit3 size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Academic Info */}
          <div className="info-card card academic-info">
            <div className="info-card-header">
              <h3>
                <GraduationCap size={16} />
                Учебная информация
              </h3>
            </div>
            <div className="info-content">
              <div className="field-group">
                <label>Студенческий билет:</label>
                {editingField === 'studentId' ? (
                  <div className="edit-field">
                    <input
                      type="text"
                      value={tempData.studentId}
                      onChange={(e) => updateTempData('studentId', e.target.value)}
                    />
                    <div className="edit-actions">
                      <button onClick={() => saveField('studentId')} className="btn btn-primary">
                        <Check size={14} />
                      </button>
                      <button onClick={cancelEdit} className="btn btn-secondary">
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="display-field">
                    <span>{profileData.studentId}</span>
                    <button onClick={() => startEdit('studentId')} className="edit-btn">
                      <Edit3 size={14} />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="field-group">
                <label>Специальность:</label>
                {editingField === 'specialty' ? (
                  <div className="edit-field">
                    <input
                      type="text"
                      value={tempData.specialty}
                      onChange={(e) => updateTempData('specialty', e.target.value)}
                    />
                    <div className="edit-actions">
                      <button onClick={() => saveField('specialty')} className="btn btn-primary">
                        <Check size={14} />
                      </button>
                      <button onClick={cancelEdit} className="btn btn-secondary">
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="display-field">
                    <span>{profileData.specialty}</span>
                    <button onClick={() => startEdit('specialty')} className="edit-btn">
                      <Edit3 size={14} />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="field-group">
                <label>Год поступления:</label>
                {editingField === 'admissionYear' ? (
                  <div className="edit-field">
                    <input
                      type="number"
                      value={tempData.admissionYear}
                      onChange={(e) => updateTempData('admissionYear', e.target.value)}
                    />
                    <div className="edit-actions">
                      <button onClick={() => saveField('admissionYear')} className="btn btn-primary">
                        <Check size={14} />
                      </button>
                      <button onClick={cancelEdit} className="btn btn-secondary">
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="display-field">
                    <span>{profileData.admissionYear}</span>
                    <button onClick={() => startEdit('admissionYear')} className="edit-btn">
                      <Edit3 size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="info-card card contact-info">
            <div className="info-card-header">
              <h3>
                <MapPin size={16} />
                Адрес
              </h3>
            </div>
            <div className="info-content">
              <div className="field-group">
                <label>Город:</label>
                {editingField === 'address.city' ? (
                  <div className="edit-field">
                    <input
                      type="text"
                      value={tempData.address.city}
                      onChange={(e) => updateNestedTempData('address', 'city', e.target.value)}
                    />
                    <div className="edit-actions">
                      <button onClick={() => saveField('address.city')} className="btn btn-primary">
                        <Check size={14} />
                      </button>
                      <button onClick={cancelEdit} className="btn btn-secondary">
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="display-field">
                    <span>{profileData.address.city}</span>
                    <button onClick={() => startEdit('address.city')} className="edit-btn">
                      <Edit3 size={14} />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="field-group">
                <label>Улица:</label>
                {editingField === 'address.street' ? (
                  <div className="edit-field">
                    <input
                      type="text"
                      value={tempData.address.street}
                      onChange={(e) => updateNestedTempData('address', 'street', e.target.value)}
                    />
                    <div className="edit-actions">
                      <button onClick={() => saveField('address.street')} className="btn btn-primary">
                        <Check size={14} />
                      </button>
                      <button onClick={cancelEdit} className="btn btn-secondary">
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="display-field">
                    <span>{profileData.address.street}</span>
                    <button onClick={() => startEdit('address.street')} className="edit-btn">
                      <Edit3 size={14} />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="field-group">
                <label>Квартира:</label>
                {editingField === 'address.apartment' ? (
                  <div className="edit-field">
                    <input
                      type="text"
                      value={tempData.address.apartment}
                      onChange={(e) => updateNestedTempData('address', 'apartment', e.target.value)}
                    />
                    <div className="edit-actions">
                      <button onClick={() => saveField('address.apartment')} className="btn btn-primary">
                        <Check size={14} />
                      </button>
                      <button onClick={cancelEdit} className="btn btn-secondary">
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="display-field">
                    <span>{profileData.address.apartment}</span>
                    <button onClick={() => startEdit('address.apartment')} className="edit-btn">
                      <Edit3 size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="info-card card social-media">
            <div className="info-card-header">
              <h3>
                <Globe size={16} />
                Социальные сети
              </h3>
            </div>
            <div className="info-content">
              {Object.entries(profileData.socialMedia).map(([platform, username]) => {
                const icons = {
                  telegram: MessageCircle,
                  instagram: Instagram,
                  linkedin: Linkedin,
                  github: Github,
                  twitter: Twitter,
                  facebook: Facebook
                };
                
                const Icon = icons[platform] || Globe;
                const platformNames = {
                  telegram: 'Telegram',
                  instagram: 'Instagram',
                  linkedin: 'LinkedIn',
                  github: 'GitHub',
                  twitter: 'Twitter',
                  facebook: 'Facebook'
                };
                
                return (
                  <div key={platform} className="field-group">
                    <label>
                      <Icon size={16} />
                      {platformNames[platform]}:
                    </label>
                    {editingField === `socialMedia.${platform}` ? (
                      <div className="edit-field">
                        <input
                          type="text"
                          value={tempData.socialMedia[platform]}
                          onChange={(e) => updateNestedTempData('socialMedia', platform, e.target.value)}
                          placeholder={`Введите ${platformNames[platform]} username`}
                        />
                        <div className="edit-actions">
                          <button onClick={() => saveField(`socialMedia.${platform}`)} className="btn btn-primary">
                            <Check size={14} />
                          </button>
                          <button onClick={cancelEdit} className="btn btn-secondary">
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="display-field">
                        <span>{username || 'Не указано'}</span>
                        <button onClick={() => startEdit(`socialMedia.${platform}`)} className="edit-btn">
                          <Edit3 size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bio & Interests - Full Width Section */}
        <div className="bio-section-full">
          <div className="info-card card">
            <div className="info-card-header">
              <h3>
                <Heart size={16} />
                О себе
              </h3>
            </div>
            <div className="bio-content">
              <div className="field-group">
                <label>Биография:</label>
                {editingField === 'bio' ? (
                  <div className="edit-field">
                    <textarea
                      value={tempData.bio}
                      onChange={(e) => updateTempData('bio', e.target.value)}
                      rows={4}
                      placeholder="Расскажите о себе..."
                    />
                    <div className="edit-actions">
                      <button onClick={() => saveField('bio')} className="btn btn-primary">
                        <Check size={14} />
                      </button>
                      <button onClick={cancelEdit} className="btn btn-secondary">
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="display-field bio-field">
                    <span>{profileData.bio}</span>
                    <button onClick={() => startEdit('bio')} className="edit-btn">
                      <Edit3 size={14} />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="interests-section">
                <div className="section-header">
                  <h4>Интересы</h4>
                  <button 
                    onClick={() => startEdit('interests')} 
                    className="btn btn-secondary btn-small"
                  >
                    <Edit3 size={12} />
                    Редактировать
                  </button>
                </div>
                
                {editingField === 'interests' ? (
                  <div className="edit-field">
                    <div className="tags-editor">
                      <input
                        type="text"
                        placeholder="Добавить интерес и нажать Enter"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && e.target.value.trim()) {
                            addInterest(e.target.value);
                            e.target.value = '';
                          }
                        }}
                      />
                      <div className="editable-tags">
                        {tempData.interests.map((interest, index) => (
                          <span key={index} className="editable-tag">
                            {interest}
                            <button 
                              onClick={() => removeInterest(interest)}
                              className="remove-tag-btn"
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="edit-actions">
                      <button onClick={() => saveField('interests')} className="btn btn-primary">
                        <Check size={14} />
                      </button>
                      <button onClick={cancelEdit} className="btn btn-secondary">
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="interests-tags">
                    {profileData.interests.map((interest, index) => (
                      <span key={index} className="interest-tag">
                        {interest}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="languages-section">
                <div className="section-header">
                  <h4>Языки и технологии</h4>
                  <button 
                    onClick={() => startEdit('languages')} 
                    className="btn btn-secondary btn-small"
                  >
                    <Edit3 size={12} />
                    Редактировать
                  </button>
                </div>
                
                {editingField === 'languages' ? (
                  <div className="edit-field">
                    <div className="tags-editor">
                      <input
                        type="text"
                        placeholder="Добавить язык/технологию и нажать Enter"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && e.target.value.trim()) {
                            addLanguage(e.target.value);
                            e.target.value = '';
                          }
                        }}
                      />
                      <div className="editable-tags">
                        {tempData.languages.map((language, index) => (
                          <span key={index} className="editable-tag">
                            {language}
                            <button 
                              onClick={() => removeLanguage(language)}
                              className="remove-tag-btn"
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="edit-actions">
                      <button onClick={() => saveField('languages')} className="btn btn-primary">
                        <Check size={14} />
                      </button>
                      <button onClick={cancelEdit} className="btn btn-secondary">
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="languages-tags">
                    {profileData.languages.map((language, index) => (
                      <span key={index} className="language-tag">
                        {language}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;