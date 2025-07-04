import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../contexts/DataContext';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { 
  MessageSquare, 
  Send, 
  Bot, 
  User, 
  Clock, 
  MessageCircle, 
  CheckCircle, 
  AlertCircle,
  Zap,
  Headphones,
  ThumbsUp,
  ThumbsDown,
  Star,
  Download,
  Search,
  Filter,
  Settings,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Hash,
  Archive,
  FileText,
  HelpCircle,
  Smile,
  Paperclip,
  Camera,
  Mic,
  MoreHorizontal,
  X,
  Trash2,
  Flag,
  Copy,
  Image,
  File
} from 'lucide-react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import CountUp from 'react-countup';
import './Feedback.css';

const Feedback = () => {
  const { student } = useData();
  
  // Немедленный скролл наверх при монтировании компонента
  React.useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Состояния чата
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('feedback-chat');
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      {
        id: 1,
        type: 'system',
        message: 'Добро пожаловать в службу поддержки UniPortal! Как дела?',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        sender: 'Система',
        avatar: null,
        status: 'delivered'
      },
      {
        id: 2,
        type: 'bot',
        message: 'Привет! Я Анна, ваш виртуальный помощник. Готова помочь с любыми вопросами по учебе и системе. Что вас интересует?',
        timestamp: new Date(Date.now() - 1000 * 60 * 3),
        sender: 'Анна',
        avatar: null,
        status: 'delivered',
        quickReplies: [
          'Как получить справку?',
          'Проблема с входом в систему',
          'Вопрос по расписанию',
          'Техническая поддержка'
        ]
      }
    ];
  });
  
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMessages, setFilteredMessages] = useState(messages);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [chatStats, setChatStats] = useState(() => {
    const saved = localStorage.getItem('feedback-stats');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      totalMessages: 2,
      responseTime: 30,
      satisfaction: 4.8,
      resolvedIssues: 45
    };
  });
  
  const inputRef = useRef(null);

  // Сохранение данных в localStorage
  useEffect(() => {
    localStorage.setItem('feedback-chat', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('feedback-stats', JSON.stringify(chatStats));
  }, [chatStats]);



  // Принудительно прокручиваем страницу наверх при загрузке
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Поиск по сообщениям
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredMessages(messages);
    } else {
      const filtered = messages.filter(msg => 
        msg.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.sender.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMessages(filtered);
    }
  }, [searchQuery, messages]);

  // Закрытие меню при клике вне элементов
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMoreMenu && !event.target.closest('.more-menu-container')) {
        setShowMoreMenu(false);
      }
      if (showEmojiPicker && !event.target.closest('.emoji-container')) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMoreMenu, showEmojiPicker]);

  // Быстрые ответы
  const quickReplies = [
    { text: 'Как получить справку?', category: 'academic' },
    { text: 'Проблема с входом в систему', category: 'technical' },
    { text: 'Изменить пароль', category: 'technical' },
    { text: 'Вопрос по расписанию', category: 'schedule' },
    { text: 'Связаться с преподавателем', category: 'academic' },
    { text: 'Проблема с оценками', category: 'academic' },
    { text: 'Техническая поддержка', category: 'technical' },
    { text: 'Как подать заявление?', category: 'academic' },
    { text: 'Проблемы с загрузкой файлов', category: 'technical' },
    { text: 'Изменить группу', category: 'academic' },
    { text: 'Восстановить доступ', category: 'technical' },
    { text: 'Спасибо за помощь!', category: 'general' }
  ];

  // Автоматические ответы бота
  const botResponses = {
    'вопрос по расписанию': 'Для просмотра актуального расписания перейдите в раздел "Расписание". Если у вас есть вопросы по конкретному занятию, укажите предмет и дату.',
    'проблема с оценками': 'По вопросам оценок обращайтесь к преподавателю предмета или в деканат. Оценки обновляются в течение 3-5 рабочих дней после проведения контроля.',
    'техническая поддержка': 'Опишите, пожалуйста, проблему подробнее. Какие ошибки вы видите? В каком разделе возникает проблема?',
    'общий вопрос': 'Задавайте любые вопросы, я постараюсь помочь! Если не смогу ответить, передам ваш вопрос специалисту.',
    'как получить справку': 'Справки выдаются в деканате (каб. 201) с 9:00 до 17:00. Необходимо иметь при себе студенческий билет. Время изготовления - 1 рабочий день.',
    'проблема с входом в систему': 'Попробуйте сбросить пароль через "Забыли пароль?" на странице входа. Если проблема не решилась, сообщите ваш логин.',
    'изменить пароль': 'Для смены пароля перейдите в "Профиль" → "Настройки" → "Безопасность" → "Сменить пароль".',
    'связаться с преподавателем': 'Контакты преподавателей указаны в расписании. Также можете обратиться в деканат за контактной информацией.',
    'как подать заявление': 'Заявления подаются в деканате в каб. 201. Требуется заполнить бланк и приложить необходимые документы. Список документов зависит от типа заявления.',
    'проблемы с загрузкой файлов': 'Проверьте размер файла (максимум 10 МБ) и формат. Поддерживаются: PDF, DOC, DOCX, JPG, PNG. Если проблема сохраняется, попробуйте другой браузер.',
    'изменить группу': 'Для перевода в другую группу необходимо подать заявление в деканат с указанием причины. Рассмотрение занимает 3-5 рабочих дней.',
    'восстановить доступ': 'Для восстановления доступа к системе обратитесь в IT-службу (каб. 105) с паспортом и студенческим билетом. Также можете написать на it-support@university.ru.',
    'спасибо за помощь': 'Рад был помочь! Если у вас возникнут другие вопросы, обращайтесь в любое время. Хорошего дня!',
    'default': 'Спасибо за ваше сообщение! Я передам его специалисту, и мы ответим вам в течение 2-4 часов в рабочее время.'
  };

  // Отправка сообщения
  const sendMessage = (messageText = newMessage) => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      message: messageText,
      timestamp: new Date(),
      sender: `${student.firstName} ${student.lastName}`,
      avatar: null,
      status: 'delivered'
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setShowQuickReplies(false);
    
    // Обновляем статистику
    setChatStats(prev => ({
      ...prev,
      totalMessages: prev.totalMessages + 1
    }));

    // Симуляция ответа бота
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        const botResponse = getBotResponse(messageText.toLowerCase());
        const botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          message: botResponse,
          timestamp: new Date(),
          sender: 'Анна',
          avatar: null,
          status: 'delivered'
        };
        
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
        
        // Обновляем статистику
        setChatStats(prev => ({
          ...prev,
          totalMessages: prev.totalMessages + 1,
          responseTime: Math.max(15, prev.responseTime - 1)
        }));
      }, 1500);
    }, 500);
  };

  // Получение ответа бота
  const getBotResponse = (message) => {
    const key = Object.keys(botResponses).find(k => 
      k !== 'default' && message.includes(k)
    );
    return botResponses[key] || botResponses.default;
  };

  // Обработка нажатия Enter
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Статистические карточки
  const stats = [
    {
      icon: MessageCircle,
      label: 'Всего сообщений',
      value: chatStats.totalMessages,
      color: '#3b82f6',
      trend: '+12%',
      description: 'В этом месяце'
    },
    {
      icon: Clock,
      label: 'Время ответа',
      value: chatStats.responseTime,
      color: '#10b981',
      trend: 'быстро',
      description: 'Секунд в среднем',
      suffix: 'с'
    },
    {
      icon: Star,
      label: 'Оценка поддержки',
      value: chatStats.satisfaction,
      color: '#f59e0b',
      trend: '+0.3',
      description: 'Средняя оценка',
      suffix: '/5'
    },
    {
      icon: CheckCircle,
      label: 'Решено вопросов',
      value: chatStats.resolvedIssues,
      color: '#8b5cf6',
      trend: '+8',
      description: 'За последний месяц'
    }
  ];

  // Форматирование времени
  const formatTime = (timestamp) => {
    return format(timestamp, 'HH:mm', { locale: ru });
  };

  const formatDate = (timestamp) => {
    const today = new Date();
    const messageDate = new Date(timestamp);
    
    if (messageDate.toDateString() === today.toDateString()) {
      return 'Сегодня';
    }
    
    return format(messageDate, 'd MMM', { locale: ru });
  };

  // Оценка сообщения
  const rateMessage = (messageId, rating) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, rating } : msg
    ));
    
    if (rating === 'up') {
      setChatStats(prev => ({
        ...prev,
        satisfaction: Math.min(5, prev.satisfaction + 0.1)
      }));
    }
  };

  // Функция поиска
  const handleSearch = () => {
    setSearchVisible(!searchVisible);
    setSearchQuery('');
    if (searchVisible) {
      setFilteredMessages(messages);
    }
  };

  // Функция меню "Еще"
  const handleMoreMenu = () => {
    setShowMoreMenu(!showMoreMenu);
  };

  // Функция прикрепления файлов
  const handleFileAttachment = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.zip,.rar';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 10 * 1024 * 1024) { // 10MB
          alert('Файл слишком большой! Максимальный размер: 10MB');
          return;
        }
        setSelectedFile(file);
        sendFileMessage(file);
      }
    };
    input.click();
  };

  // Функция камеры
  const handleCamera = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setSelectedFile(file);
        sendFileMessage(file);
      }
    };
    input.click();
  };

  // Функция эмодзи
  const handleEmoji = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  // Популярные эмодзи
  const popularEmojis = ['😊', '😂', '❤️', '👍', '👎', '😢', '😮', '😡', '🤔', '👏', '🙏', '✨', '🔥', '💡', '✅', '❌', '📚', '🎓', '📝', '⏰'];

  // Добавление эмодзи к сообщению
  const addEmoji = (emoji) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  // Отправка файла
  const sendFileMessage = (file) => {
    const fileMessage = {
      id: Date.now(),
      type: 'user',
      message: `📎 ${file.name}`,
      timestamp: new Date(),
      sender: `${student.firstName} ${student.lastName}`,
      avatar: null,
      status: 'delivered',
      file: {
        name: file.name,
        size: file.size,
        type: file.type
      }
    };

    setMessages(prev => [...prev, fileMessage]);
    setSelectedFile(null);
    
    // Ответ бота на файл
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        const botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          message: `Файл "${file.name}" успешно получен! Я передам его специалисту для обработки. Если у вас есть дополнительные вопросы по этому файлу, пожалуйста, опишите их.`,
          timestamp: new Date(),
          sender: 'Анна',
          avatar: null,
          status: 'delivered'
        };
        
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
      }, 1000);
    }, 500);
  };

  // Функции меню "Еще"
  const clearChat = () => {
    const confirmClear = window.confirm('Вы действительно хотите очистить историю чата?');
    if (confirmClear) {
      setMessages([]);
      setShowMoreMenu(false);
      setChatStats(prev => ({ ...prev, totalMessages: 0 }));
    }
  };

  const exportChat = () => {
    const chatData = messages.map(msg => ({
      time: format(msg.timestamp, 'dd.MM.yyyy HH:mm', { locale: ru }),
      sender: msg.sender,
      message: msg.message
    }));
    
    const dataStr = JSON.stringify(chatData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `chat_history_${format(new Date(), 'yyyy-MM-dd', { locale: ru })}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    setShowMoreMenu(false);
  };

  const reportIssue = () => {
    const issue = prompt('Опишите проблему:');
    if (issue) {
      const reportMessage = {
        id: Date.now(),
        type: 'user',
        message: `🚩 ПРОБЛЕМА: ${issue}`,
        timestamp: new Date(),
        sender: `${student.firstName} ${student.lastName}`,
        avatar: null,
        status: 'delivered'
      };
      
      setMessages(prev => [...prev, reportMessage]);
      setShowMoreMenu(false);
    }
  };

  return (
    <div className="feedback">
      <div className="container">
        {/* Header */}
        <div className="feedback-header">
          <div className="header-content">
            <div className="welcome-section">
              <h1>
                <MessageSquare className="header-icon" />
                Поддержка и помощь
              </h1>
              <p className="header-subtitle">
                Онлайн-чат с поддержкой • {student.firstName} {student.lastName}, группа {student.group}
              </p>
            </div>
            <div className="support-status-card">
              <div className="status-info">
                <h3>Статус поддержки</h3>
                <p>Онлайн • Отвечаем быстро</p>
              </div>
              <div className="status-indicator">
                <div className="status-dot online"></div>
                <span>В сети</span>
              </div>
            </div>
          </div>
        </div>

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
                  <CountUp 
                    end={stat.value} 
                    duration={2}
                    decimals={stat.suffix === '/5' ? 1 : 0}
                    preserveValue
                    suffix={stat.suffix || ''}
                  />
                </div>
                <div className="stat-label">{stat.label}</div>
                <div className="stat-description">{stat.description}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Chat Interface */}
        <div className="chat-container card">
          <div className="chat-header">
            <div className="chat-info">
              <div className="chat-avatar">
                <Headphones size={20} />
              </div>
              <div className="chat-details">
                <h3>Служба поддержки</h3>
                <p className="chat-status">
                  <span className="status-dot online"></span>
                  Онлайн • Отвечаем в течение минуты
                </p>
              </div>
            </div>
            <div className="chat-actions">
              <button 
                className={`btn btn-secondary btn-small ${searchVisible ? 'active' : ''}`}
                onClick={handleSearch}
                title="Поиск по сообщениям"
              >
                <Search size={16} />
              </button>
              <div className="more-menu-container">
                <button 
                  className={`btn btn-secondary btn-small ${showMoreMenu ? 'active' : ''}`}
                  onClick={handleMoreMenu}
                  title="Дополнительные действия"
                >
                  <MoreHorizontal size={16} />
                </button>
                {showMoreMenu && (
                  <div className="more-menu">
                    <button onClick={clearChat} className="menu-item danger">
                      <Trash2 size={16} />
                      Очистить чат
                    </button>
                    <button onClick={exportChat} className="menu-item">
                      <Download size={16} />
                      Экспорт истории
                    </button>
                    <button onClick={reportIssue} className="menu-item">
                      <Flag size={16} />
                      Сообщить о проблеме
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Search Bar */}
          {searchVisible && (
            <div className="search-bar">
              <div className="search-input-container">
                <Search size={16} className="search-icon" />
                <input
                  type="text"
                  placeholder="Поиск по сообщениям..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                  autoFocus
                />
                {searchQuery && (
                  <button 
                    className="clear-search"
                    onClick={() => setSearchQuery('')}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              {searchQuery && (
                <div className="search-results">
                  Найдено сообщений: {filteredMessages.length}
                </div>
              )}
            </div>
          )}

          <div className="chat-messages">
            {filteredMessages.map((message) => (
              <div key={message.id} className={`message ${message.type}`}>
                <div className="message-content">
                  {message.type !== 'user' && (
                    <div className="message-avatar">
                      {message.type === 'bot' ? (
                        <Bot size={20} />
                      ) : message.type === 'system' ? (
                        <Settings size={20} />
                      ) : (
                        <Headphones size={20} />
                      )}
                    </div>
                  )}
                  
                  <div className="message-bubble">
                    <div className="message-header">
                      <span className="message-sender">{message.sender}</span>
                      <span className="message-time">{formatTime(message.timestamp)}</span>
                    </div>
                    <div className="message-text">{message.message}</div>
                    
                    {message.file && (
                      <div className="message-file">
                        <div className="file-icon">
                          {message.file.type?.startsWith('image/') ? <Image size={16} /> : <File size={16} />}
                        </div>
                        <div className="file-info">
                          <div className="file-name">{message.file.name}</div>
                          <div className="file-size">{Math.round(message.file.size / 1024)} KB</div>
                        </div>
                      </div>
                    )}
                    
                    {message.quickReplies && showQuickReplies && (
                      <div className="quick-replies">
                        {message.quickReplies.map((reply, index) => (
                          <button
                            key={index}
                            className="quick-reply-btn"
                            onClick={() => sendMessage(reply)}
                          >
                            {reply}
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {message.type === 'bot' && (
                      <div className="message-actions">
                        <button
                          className={`reaction-btn ${message.rating === 'up' ? 'active' : ''}`}
                          onClick={() => rateMessage(message.id, 'up')}
                        >
                          <ThumbsUp size={14} />
                        </button>
                        <button
                          className={`reaction-btn ${message.rating === 'down' ? 'active' : ''}`}
                          onClick={() => rateMessage(message.id, 'down')}
                        >
                          <ThumbsDown size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {message.type === 'user' && (
                    <div className="message-avatar user-avatar">
                      <User size={20} />
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="message bot">
                <div className="message-content">
                  <div className="message-avatar">
                    <Bot size={20} />
                  </div>
                  <div className="message-bubble typing">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Replies */}
          {showQuickReplies && (
            <div className="quick-replies-section">
              <h4>Быстрые ответы:</h4>
              <div className="quick-replies-grid">
                {quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    className="quick-reply-card"
                    onClick={() => sendMessage(reply.text)}
                  >
                    <span className="quick-reply-text">{reply.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Selected File Preview */}
          {selectedFile && (
            <div className="selected-file">
              <div className="file-icon">
                {selectedFile.type?.startsWith('image/') ? <Image size={16} /> : <File size={16} />}
              </div>
              <div className="file-info">
                <div className="file-name">{selectedFile.name}</div>
                <div className="file-size">{Math.round(selectedFile.size / 1024)} KB</div>
              </div>
              <button 
                className="remove-file"
                onClick={() => setSelectedFile(null)}
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Chat Input */}
          <div className="chat-input">
            <div className="input-actions">
              <button 
                className="input-btn"
                onClick={handleFileAttachment}
                title="Прикрепить файл"
              >
                <Paperclip size={18} />
              </button>
              <button 
                className="input-btn"
                onClick={handleCamera}
                title="Сделать фото"
              >
                <Camera size={18} />
              </button>
            </div>
            
            <div className="input-field">
              <textarea
                ref={inputRef}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Напишите ваше сообщение..."
                rows={1}
                className="message-input"
                autoFocus={false}
              />
              <div className="emoji-container">
                <button 
                  className={`input-btn emoji-btn ${showEmojiPicker ? 'active' : ''}`}
                  onClick={handleEmoji}
                  title="Добавить эмодзи"
                >
                  <Smile size={18} />
                </button>
                {showEmojiPicker && (
                  <div className="emoji-picker">
                    <div className="emoji-grid">
                      {popularEmojis.map((emoji, index) => (
                        <button
                          key={index}
                          className="emoji-btn"
                          onClick={() => addEmoji(emoji)}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <button 
              className="send-btn"
              onClick={() => sendMessage()}
              disabled={!newMessage.trim()}
            >
              <Send size={18} />
            </button>
          </div>
        </div>

        {/* Contact Information */}
        <div className="contact-info-section">
          <div className="contact-card card">
            <h3>
              <Phone size={16} />
              Контакты поддержки
            </h3>
            <div className="contact-list">
              <div className="contact-item">
                <Phone size={16} />
                <div>
                  <p>+7 (495) 123-45-67</p>
                  <span>Пн-Пт: 9:00-18:00</span>
                </div>
              </div>
              <div className="contact-item">
                <Mail size={16} />
                <div>
                  <p>support@university.ru</p>
                  <span>Ответ в течение 2-4 часов</span>
                </div>
              </div>
              <div className="contact-item">
                <MapPin size={16} />
                <div>
                  <p>Корпус 1, каб. 105</p>
                  <span>Служба поддержки</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="faq-card card">
            <h3>
              <HelpCircle size={16} />
              FAQ
            </h3>
            <div className="faq-list">
              <div className="faq-item">
                <h4>Как восстановить пароль?</h4>
                <p>Используйте "Забыли пароль?" на странице входа</p>
              </div>
              <div className="faq-item">
                <h4>Где посмотреть оценки?</h4>
                <p>В разделе "Главная" → "Академические результаты"</p>
              </div>
              <div className="faq-item">
                <h4>Как связаться с преподавателем?</h4>
                <p>Контакты указаны в расписании</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback; 