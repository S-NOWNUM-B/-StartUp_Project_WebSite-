import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { 
  Bell, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  CheckCircle,
  X,
  Archive,
  AlertTriangle,
  Info,
  Award,
  Clock,
  BookOpen,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Download,
  List,
  Grid,
  SortDesc,
  Check,
  Trash2,
  Eye,
  EyeOff,
  Star,
  MessageSquare,
  GraduationCap,
  Zap,
  FileText,
  Calendar as CalendarIcon,
  TrendingUp
} from 'lucide-react';
import { format, isToday, isYesterday, parseISO, differenceInDays } from 'date-fns';
import { ru } from 'date-fns/locale';
import CountUp from 'react-countup';
import './Notifications.css';

const Notifications = () => {
  const { student } = useData();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('list');
  const [sortBy, setSortBy] = useState('date');
  const [currentPage, setCurrentPage] = useState(1);
  const [readNotifications, setReadNotifications] = useState([1, 3, 5, 8]);
  const [archivedNotifications, setArchivedNotifications] = useState([]);

  const notificationsPerPage = 8;

  // Данные уведомлений
  const notificationsData = [
    {
      id: 1,
      title: 'Новое задание по Математике',
      message: 'Преподаватель добавил новое задание "Дифференциальные уравнения". Срок сдачи: 15 января 2025.',
      category: 'assignment',
      type: 'info',
      priority: 'high',
      date: '2025-01-05T14:30:00',
      sender: 'Проф. Иванов А.В.',
      read: true,
      actionRequired: true,
      metadata: {
        subject: 'Математический анализ',
        deadline: '2025-01-15T23:59:00'
      }
    },
    {
      id: 2,
      title: 'Изменение в расписании',
      message: 'Занятие по Физике 7 января перенесено с 10:00 на 14:00, аудитория 205.',
      category: 'schedule',
      type: 'warning',
      priority: 'high',
      date: '2025-01-05T09:15:00',
      sender: 'Учебный отдел',
      read: false,
      actionRequired: false,
      metadata: {
        subject: 'Физика',
        oldTime: '10:00',
        newTime: '14:00',
        room: '205'
      }
    },
    {
      id: 3,
      title: 'Оценка выставлена',
      message: 'По предмету "Программирование" выставлена оценка 5 за лабораторную работу №3.',
      category: 'grade',
      type: 'success',
      priority: 'medium',
      date: '2025-01-04T16:45:00',
      sender: 'Доц. Петрова М.И.',
      read: true,
      actionRequired: false,
      metadata: {
        subject: 'Программирование',
        grade: 5,
        assignment: 'Лабораторная работа №3'
      }
    },
    {
      id: 4,
      title: 'Напоминание о экзамене',
      message: 'До экзамена по Базам данных осталось 5 дней. Не забудьте подготовиться!',
      category: 'reminder',
      type: 'warning',
      priority: 'high',
      date: '2025-01-04T10:00:00',
      sender: 'Система',
      read: false,
      actionRequired: true,
      metadata: {
        subject: 'Базы данных',
        examDate: '2025-01-10T09:00:00',
        daysLeft: 5
      }
    },
    {
      id: 5,
      title: 'Стипендия начислена',
      message: 'Академическая стипендия за декабрь в размере 3500 рублей зачислена на ваш счёт.',
      category: 'financial',
      type: 'success',
      priority: 'medium',
      date: '2025-01-03T12:30:00',
      sender: 'Бухгалтерия',
      read: true,
      actionRequired: false,
      metadata: {
        amount: 3500,
        period: 'Декабрь 2024',
        type: 'Академическая стипендия'
      }
    },
    {
      id: 6,
      title: 'Новое объявление от деканата',
      message: 'Уважаемые студенты! 12 января состоится встреча с представителями IT-компаний.',
      category: 'announcement',
      type: 'info',
      priority: 'medium',
      date: '2025-01-03T09:00:00',
      sender: 'Деканат ИТ',
      read: false,
      actionRequired: false,
      metadata: {
        eventDate: '2025-01-12T14:00:00',
        location: 'Актовый зал',
        topic: 'Карьерные возможности'
      }
    },
    {
      id: 7,
      title: 'Системное обновление',
      message: 'Студенческий портал будет недоступен 6 января с 02:00 до 04:00 для технического обслуживания.',
      category: 'system',
      type: 'warning',
      priority: 'low',
      date: '2025-01-02T18:00:00',
      sender: 'IT-отдел',
      read: false,
      actionRequired: false,
      metadata: {
        maintenanceStart: '2025-01-06T02:00:00',
        maintenanceEnd: '2025-01-06T04:00:00',
        affectedServices: ['Портал', 'Электронная почта']
      }
    },
    {
      id: 8,
      title: 'Приглашение на мероприятие',
      message: 'Студенческий совет приглашает на новогодний концерт 25 декабря в 19:00.',
      category: 'event',
      type: 'info',
      priority: 'low',
      date: '2025-01-02T11:15:00',
      sender: 'Студенческий совет',
      read: true,
      actionRequired: false,
      metadata: {
        eventDate: '2024-12-25T19:00:00',
        location: 'Актовый зал',
        type: 'Новогодний концерт'
      }
    },
    {
      id: 9,
      title: 'Просрочено задание',
      message: 'Задание по предмету "Алгоритмы" было сдано с опозданием. Оценка может быть снижена.',
      category: 'assignment',
      type: 'error',
      priority: 'high',
      date: '2025-01-01T15:30:00',
      sender: 'Система',
      read: false,
      actionRequired: true,
      metadata: {
        subject: 'Алгоритмы и структуры данных',
        overdueBy: '2 дня',
        penaltyApplied: true
      }
    },
    {
      id: 10,
      title: 'Библиотечное напоминание',
      message: 'Книга "Основы программирования" должна быть возвращена до 8 января.',
      category: 'library',
      type: 'warning',
      priority: 'medium',
      date: '2025-01-01T10:00:00',
      sender: 'Библиотека',
      read: false,
      actionRequired: true,
      metadata: {
        bookTitle: 'Основы программирования',
        returnDate: '2025-01-08T17:00:00',
        fine: 0
      }
    },
    {
      id: 11,
      title: 'Результаты тестирования',
      message: 'Доступны результаты промежуточного тестирования по курсу "Веб-разработка".',
      category: 'grade',
      type: 'info',
      priority: 'medium',
      date: '2024-12-31T14:20:00',
      sender: 'Автоматическая система',
      read: false,
      actionRequired: false,
      metadata: {
        subject: 'Веб-разработка',
        testType: 'Промежуточное тестирование',
        score: 85
      }
    },
    {
      id: 12,
      title: 'Обновление профиля',
      message: 'Пожалуйста, обновите контактную информацию в вашем профиле до 15 января.',
      category: 'profile',
      type: 'info',
      priority: 'low',
      date: '2024-12-30T16:00:00',
      sender: 'Администрация',
      read: false,
      actionRequired: true,
      metadata: {
        deadline: '2025-01-15T23:59:00',
        fieldsToUpdate: ['Телефон', 'Адрес', 'Email']
      }
    }
  ];

  // Категории уведомлений
  const categories = [
    { id: 'all', name: 'Все уведомления', icon: Bell, color: '#6b7280' },
    { id: 'assignment', name: 'Задания', icon: FileText, color: '#3b82f6' },
    { id: 'grade', name: 'Оценки', icon: Award, color: '#10b981' },
    { id: 'schedule', name: 'Расписание', icon: CalendarIcon, color: '#f59e0b' },
    { id: 'reminder', name: 'Напоминания', icon: Clock, color: '#ef4444' },
    { id: 'financial', name: 'Финансы', icon: TrendingUp, color: '#8b5cf6' },
    { id: 'announcement', name: 'Объявления', icon: MessageSquare, color: '#06b6d4' },
    { id: 'system', name: 'Система', icon: Settings, color: '#84cc16' },
    { id: 'event', name: 'Мероприятия', icon: Users, color: '#f97316' },
    { id: 'library', name: 'Библиотека', icon: BookOpen, color: '#6366f1' },
    { id: 'profile', name: 'Профиль', icon: User, color: '#ec4899' }
  ];

  // Статистика уведомлений
  const getNotificationStats = () => {
    // Фильтруем только не архивированные уведомления
    const activeNotifications = notificationsData.filter(notif => !archivedNotifications.includes(notif.id));
    
    const totalNotifications = activeNotifications.length;
    const unreadNotifications = activeNotifications.filter(notif => !readNotifications.includes(notif.id)).length;
    const todayNotifications = activeNotifications.filter(notif => isToday(parseISO(notif.date))).length;
    const highPriorityNotifications = activeNotifications.filter(notif => notif.priority === 'high').length;
    const actionRequiredNotifications = activeNotifications.filter(notif => notif.actionRequired && !readNotifications.includes(notif.id)).length;
    
    return {
      totalNotifications,
      unreadNotifications,
      todayNotifications,
      highPriorityNotifications,
      actionRequiredNotifications
    };
  };

  const notificationStats = getNotificationStats();

  // Статистические карточки
  const stats = [
    {
      icon: Bell,
      label: 'Всего уведомлений',
      value: notificationStats.totalNotifications,
      color: '#3b82f6',
      trend: '+3',
      description: 'За последние 24 часа'
    },
    {
      icon: EyeOff,
      label: 'Непрочитанных',
      value: notificationStats.unreadNotifications,
      color: '#ef4444',
      trend: 'новых',
      description: 'Требуют внимания'
    },
    {
      icon: Clock,
      label: 'За сегодня',
      value: notificationStats.todayNotifications,
      color: '#f59e0b',
      trend: '+2',
      description: 'Новых уведомлений'
    },
    {
      icon: AlertTriangle,
      label: 'Важных',
      value: notificationStats.highPriorityNotifications,
      color: '#8b5cf6',
      trend: 'высокий',
      description: 'Приоритет'
    }
  ];

  // Фильтрация уведомлений
  const filteredNotifications = notificationsData.filter(notif => {
    if (archivedNotifications.includes(notif.id)) return false;
    
    const matchesSearch = notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notif.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notif.sender.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || notif.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Сортировка уведомлений
  const sortedNotifications = [...filteredNotifications].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.date) - new Date(a.date);
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case 'status':
        const aRead = readNotifications.includes(a.id);
        const bRead = readNotifications.includes(b.id);
        return aRead - bRead;
      case 'sender':
        return a.sender.localeCompare(b.sender);
      default:
        return 0;
    }
  });

  // Пагинация
  const totalPages = Math.ceil(sortedNotifications.length / notificationsPerPage);
  const startIndex = (currentPage - 1) * notificationsPerPage;
  const endIndex = startIndex + notificationsPerPage;
  const currentNotifications = sortedNotifications.slice(startIndex, endIndex);

  // Прогресс чтения уведомлений
  const activeNotificationsForProgress = notificationsData.filter(notif => !archivedNotifications.includes(notif.id));
  const readActiveNotifications = readNotifications.filter(id => {
    const notification = notificationsData.find(notif => notif.id === id);
    return notification && !archivedNotifications.includes(id);
  });
  
  const readingProgress = {
    current: readActiveNotifications.length,
    total: activeNotificationsForProgress.length,
    percentage: activeNotificationsForProgress.length > 0 
      ? Math.round((readActiveNotifications.length / activeNotificationsForProgress.length) * 100)
      : 100
  };

  // Функции для взаимодействия с уведомлениями
  const markAsRead = (notificationId) => {
    setReadNotifications(prev => 
      prev.includes(notificationId) 
        ? prev 
        : [...prev, notificationId]
    );
  };

  const markAsUnread = (notificationId) => {
    setReadNotifications(prev => prev.filter(id => id !== notificationId));
  };

  const archiveNotification = (notificationId) => {
    setArchivedNotifications(prev => [...prev, notificationId]);
    markAsRead(notificationId);
  };

  const markAllAsRead = () => {
    const activeFilteredIds = filteredNotifications
      .filter(notif => !archivedNotifications.includes(notif.id))
      .map(notif => notif.id);
    setReadNotifications(prev => [...new Set([...prev, ...activeFilteredIds])]);
  };

  const formatDate = (dateString) => {
    const date = parseISO(dateString);
    const now = new Date();
    const diffDays = differenceInDays(now, date);
    
    if (isToday(date)) {
      return `Сегодня в ${format(date, 'HH:mm')}`;
    } else if (isYesterday(date)) {
      return `Вчера в ${format(date, 'HH:mm')}`;
    } else if (diffDays <= 7) {
      return `${diffDays} дн. назад`;
    } else {
      return format(date, 'd MMM yyyy, HH:mm', { locale: ru });
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'success': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'error': return '#ef4444';
      case 'info': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getCategoryInfo = (categoryId) => {
    return categories.find(cat => cat.id === categoryId) || categories[0];
  };

  return (
    <div className="notifications">
      <div className="container">
        {/* Header */}
        <div className="notifications-header">
          <div className="header-content">
            <div className="welcome-section">
              <h1>
                <Bell className="header-icon" />
                Уведомления
              </h1>
              <p className="header-subtitle">
                Важные сообщения и обновления • Группа {student.group}, {student.course} курс
              </p>
            </div>
            <div className="reading-progress-card">
              <div className="progress-info">
                <h3>Прогресс чтения</h3>
                <p>Прочитано {readingProgress.current} из {readingProgress.total}</p>
              </div>
              <div className="progress-circle">
                <CircularProgressbar
                  value={readingProgress.percentage}
                  text={`${readingProgress.percentage}%`}
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
                    preserveValue
                  />
                </div>
                <div className="stat-label">{stat.label}</div>
                <div className="stat-description">{stat.description}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Categories */}
        <div className="categories-section">
          <div className="categories-scroll">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
                style={{ 
                  borderColor: selectedCategory === category.id ? category.color : 'var(--border)',
                  backgroundColor: selectedCategory === category.id ? category.color : 'transparent',
                  color: selectedCategory === category.id ? 'white' : 'var(--foreground)'
                }}
              >
                <category.icon size={16} />
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="notifications-controls">
          <div className="search-section">
            <div className="search-input-wrapper">
              <Search size={20} />
              <input
                type="text"
                placeholder="Поиск уведомлений..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
          
          <div className="control-actions">
                         <button 
               className="btn btn-secondary"
               onClick={markAllAsRead}
               disabled={notificationStats.unreadNotifications === 0 || notificationStats.totalNotifications === 0}
             >
               <CheckCircle size={16} />
               Прочитать все
             </button>
            
            <div className="sort-dropdown">
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="date">По дате</option>
                <option value="priority">По важности</option>
                <option value="status">По статусу</option>
                <option value="sender">По отправителю</option>
              </select>
            </div>
            
            <div className="view-mode-toggle">
              <button 
                className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setViewMode('list')}
              >
                <List size={16} />
              </button>
              <button 
                className={`btn ${viewMode === 'compact' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setViewMode('compact')}
              >
                <Grid size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className={`notifications-content ${viewMode}`}>
          {currentNotifications.map((notification) => {
            const categoryInfo = getCategoryInfo(notification.category);
            const isRead = readNotifications.includes(notification.id);
            
            return (
              <div 
                key={notification.id} 
                className={`notification-card ${isRead ? 'read' : 'unread'} ${notification.priority}`}
              >
                <div className="notification-header">
                  <div className="notification-meta">
                    <div 
                      className="notification-category" 
                      style={{ backgroundColor: categoryInfo.color }}
                    >
                      <categoryInfo.icon size={14} />
                    </div>
                    <div 
                      className="notification-type"
                      style={{ backgroundColor: getTypeColor(notification.type) }}
                    ></div>
                    <div 
                      className="priority-indicator"
                      style={{ backgroundColor: getPriorityColor(notification.priority) }}
                    ></div>
                  </div>
                  
                  <div className="notification-actions">
                    <button 
                      className="action-btn"
                      onClick={() => isRead ? markAsUnread(notification.id) : markAsRead(notification.id)}
                      title={isRead ? 'Отметить как непрочитанное' : 'Отметить как прочитанное'}
                    >
                      {isRead ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    <button 
                      className="action-btn"
                      onClick={() => archiveNotification(notification.id)}
                      title="Архивировать"
                    >
                      <Archive size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="notification-content">
                  <div className="notification-main">
                    <h3 className="notification-title">{notification.title}</h3>
                    <p className="notification-message">{notification.message}</p>
                    
                    {notification.actionRequired && (
                      <div className="action-required">
                        <AlertTriangle size={14} />
                        <span>Требуется действие</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="notification-footer">
                    <div className="notification-sender">
                      <User size={14} />
                      <span>{notification.sender}</span>
                    </div>
                    <div className="notification-date">{formatDate(notification.date)}</div>
                  </div>
                </div>
                
                {!isRead && <div className="unread-indicator"></div>}
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {currentNotifications.length === 0 && (
          <div className="empty-state">
            <Bell size={64} />
            <h3>Уведомлений не найдено</h3>
            <p>Попробуйте изменить фильтры или поисковый запрос</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button 
              className="btn btn-secondary"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={16} />
              Назад
            </button>
            
            <div className="pagination-info">
              Страница {currentPage} из {totalPages}
            </div>
            
            <button 
              className="btn btn-secondary"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Вперед
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;