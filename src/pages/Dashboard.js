import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import CountUp from 'react-countup';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { 
  Calendar as CalendarIcon, 
  Newspaper, 
  Bell, 
  Clock, 
  Users, 
  BookOpen,
  TrendingUp,
  GraduationCap,
  ArrowRight,
  Award,
  CheckCircle,
  Zap,
  BarChart3,
  Calendar as CalendarIconLucide,
  Timer,
  FileText,
  Mail,
  TrendingDown,
  AlertTriangle,
  Download,
  ExternalLink
} from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import 'react-circular-progressbar/dist/styles.css';
import './Dashboard.css';

const Dashboard = () => {
  const {
    student,
    subjects,
    tasks,
    notifications,
    calculateAverageGrade,
    getAttendanceRate,
    getCompletedTasksCount,
    getTotalTasksCount,
    getUnreadNotificationsCount,
    getScheduleForDay,
    getTasksForToday,
    getGradesChartData,
    getSubjectsChartData,
    getPerformanceAnalytics,
    getSubjectDistribution,
    toggleTaskCompleted,
    addQuickTask,
    updateTaskTitle,
    deleteTask,
    achievements
  } = useData();

  const [activeChartTab, setActiveChartTab] = useState('performance');

  // Данные для диаграмм из DataContext
  const gradesData = getGradesChartData();
  const subjectsData = getSubjectsChartData();
  const performanceData = getPerformanceAnalytics();
  const distributionData = getSubjectDistribution();

  // Статистика с динамическими данными
  const stats = [
    { 
      icon: BookOpen, 
      label: 'Изучено курсов', 
      value: subjects.length, 
      color: '#3b82f6',
      trend: '+2',
      description: 'За этот семестр'
    },
    { 
      icon: TrendingUp, 
      label: 'Средний балл', 
      value: calculateAverageGrade(), 
      color: '#10b981',
      trend: '+0.3',
      description: 'Улучшение за месяц',
      decimals: 1
    },
    { 
      icon: Clock, 
      label: 'Посещаемость', 
      value: getAttendanceRate(), 
      color: '#f59e0b',
      trend: '+5%',
      description: 'От общего количества',
      suffix: '%'
    },
    { 
      icon: Award, 
      label: 'Достижений', 
      value: achievements.length, 
      color: '#8b5cf6',
      trend: '+1',
      description: 'Новых наград'
    }
  ];

  // Быстрые действия с динамическими данными
  const quickActions = [
    {
      title: 'Расписание',
      description: 'Посмотреть занятия на сегодня',
      icon: CalendarIcon,
      path: '/schedule',
      color: '#3b82f6',
      badge: `${getScheduleForDay(new Date().getDay() - 1).length} пар`
    },
    {
      title: 'Новости',
      description: 'Последние обновления',
      icon: Newspaper,
      path: '/news',
      color: '#10b981',
      badge: '3 новых'
    },
    {
      title: 'Уведомления',
      description: 'Важные сообщения',
      icon: Bell,
      path: '/notifications',
      color: '#f59e0b',
      badge: getUnreadNotificationsCount().toString()
    },
    {
      title: 'Профиль',
      description: 'Управление аккаунтом',
      icon: Users,
      path: '/profile',
      color: '#8b5cf6',
      badge: null
    }
  ];

  // Ближайшие занятия из динамических данных
  const todaySchedule = getScheduleForDay(new Date().getDay() - 1);
  const upcomingClasses = todaySchedule.map((cls, index) => ({
    time: cls.time,
    subject: cls.subject?.name || 'Неизвестный предмет',
    room: cls.room,
    type: cls.type,
    professor: cls.subject?.teacher || 'Неизвестный преподаватель',
    status: index === 0 ? 'current' : index === 1 ? 'next' : 'upcoming',
    color: cls.subject?.color || '#6b7280'
  }));

  // Задачи на сегодня из динамических данных
  const todayTasks = getTasksForToday();

  // Уведомления из динамических данных
  const recentNotifications = notifications.slice(0, 3).map(notif => ({
    id: notif.id,
    title: notif.title,
    message: notif.message,
    time: notif.time,
    type: notif.type,
    unread: !notif.read
  }));

  // Быстрая статистика
  const quickStats = [
    {
      label: 'До экзаменов',
      value: '18',
      suffix: 'дней',
      color: '#ef4444',
      icon: AlertTriangle
    },
    {
      label: 'Невыполненных задач',
      value: (getTotalTasksCount() - getCompletedTasksCount()).toString(),
      suffix: 'шт.',
      color: '#f59e0b',
      icon: FileText
    },
    {
      label: 'Новых сообщений',
      value: getUnreadNotificationsCount().toString(),
      suffix: 'шт.',
      color: '#3b82f6',
      icon: Mail
    }
  ];

  // Документы для скачивания
  const documents = [
    {
      name: 'Учебный план',
      type: 'PDF',
      size: '2.3 МБ',
      updated: 'Вчера'
    },
    {
      name: 'Расписание экзаменов',
      type: 'PDF',
      size: '1.1 МБ',
      updated: '3 дня назад'
    },
    {
      name: 'Методические материалы',
      type: 'ZIP',
      size: '15.7 МБ',
      updated: '1 неделю назад'
    }
  ];

  // Прогресс семестра
  const semesterProgress = {
    current: 12,
    total: 18,
    percentage: Math.round((12 / 18) * 100)
  };

  const toggleTask = (taskId) => {
    toggleTaskCompleted(taskId);
  };

  // Компонент редактируемой задачи
  const EditableTask = ({ task, onUpdate, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(task.title);

    const handleEdit = () => {
      setIsEditing(true);
    };

    const handleSave = () => {
      if (title.trim()) {
        onUpdate(task.id, title);
      } else {
        onDelete(task.id);
      }
      setIsEditing(false);
    };

    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        handleSave();
      }
      if (e.key === 'Escape') {
        setTitle(task.title);
        setIsEditing(false);
      }
    };

    const handleBlur = () => {
      handleSave();
    };

    return (
      <div className="task-item">
        <label className="task-checkbox">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => toggleTask(task.id)}
          />
          <span className="checkmark"></span>
        </label>
        <div className="task-content">
          {isEditing ? (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyPress}
              className="task-input"
              autoFocus
            />
          ) : (
            <span 
              className={`task-title ${task.completed ? 'completed' : ''}`}
              onClick={handleEdit}
            >
              {task.title}
            </span>
          )}
          <div
            className="task-priority"
            style={{ backgroundColor: getPriorityColor(task.priority) }}
          ></div>
        </div>
      </div>
    );
  };

  // Компонент для добавления новой задачи
  const AddTaskInput = ({ onAdd }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [title, setTitle] = useState('');

    const handleAdd = () => {
      if (title.trim()) {
        onAdd(title);
        setTitle('');
      }
      setIsAdding(false);
    };

    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        handleAdd();
      }
      if (e.key === 'Escape') {
        setTitle('');
        setIsAdding(false);
      }
    };

    const handleBlur = () => {
      if (title.trim()) {
        handleAdd();
      } else {
        setIsAdding(false);
      }
    };

    if (isAdding) {
      return (
        <div className="task-item adding">
          <div className="task-checkbox">
            <span className="checkmark-placeholder"></span>
          </div>
          <div className="task-content">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyPress}
              className="task-input"
              placeholder="Введите новую задачу..."
              autoFocus
            />
          </div>
        </div>
      );
    }

    return (
      <div className="add-task-item" onClick={() => setIsAdding(true)}>
        <div className="add-task-icon">+</div>
        <span className="add-task-text">Добавить задачу</span>
      </div>
    );
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'current': return '#3b82f6';
      case 'next': return '#10b981';
      case 'upcoming': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'assignment': return FileText;
      case 'schedule': return Timer;
      case 'grade': return Award;
      default: return Bell;
    }
  };

  // Кастомный тултип для диаграмм
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p className="tooltip-label">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
              {entry.name === 'grade' || entry.name === 'Оценка' ? '' : 
               entry.name === 'attendance' || entry.name === 'Посещаемость' ? '%' :
               entry.name === 'activity' || entry.name === 'Активность' ? '%' :
               entry.name === 'assignments' || entry.name === 'Задания' ? ' шт.' :
               entry.name === 'performance' || entry.name === 'Успеваемость' ? '%' :
               entry.name === 'quality' || entry.name === 'Качество' ? '%' :
               entry.name === 'effort' || entry.name === 'Усилия' ? '%' :
               entry.name === 'consistency' || entry.name === 'Постоянство' ? '%' :
               entry.name === 'progress' || entry.name === 'Прогресс' ? '%' :
               entry.name === 'credits' || entry.name === 'Кредиты' ? ' з.е.' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="dashboard">
      <div className="container">
        {/* Header */}
        <div className="dashboard-header">
          <div className="header-content">
            <div className="welcome-section">
              <h1>
                <GraduationCap className="header-icon" />
                Добро пожаловать, {student.firstName}!
              </h1>
              <p className="header-subtitle">
                Сегодня {format(new Date(), 'EEEE, d MMMM yyyy', { locale: ru })}
              </p>
            </div>
            <div className="semester-progress-card">
              <div className="progress-info">
                <h3>Прогресс семестра</h3>
                <p>Неделя {semesterProgress.current} из {semesterProgress.total}</p>
              </div>
              <div className="progress-circle">
                <CircularProgressbar
                  value={semesterProgress.percentage}
                  text={`${semesterProgress.percentage}%`}
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
                  <TrendingUp size={16} />
                  {stat.trend}
                </div>
              </div>
              <div className="stat-content">
                <div className="stat-value">
                  <CountUp
                    end={stat.value}
                    duration={2}
                    decimals={stat.decimals || 0}
                    suffix={stat.suffix || ''}
                  />
                </div>
                <div className="stat-label">{stat.label}</div>
                <div className="stat-description">{stat.description}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="main-content-grid">
          {/* Quick Actions */}
          <div className="quick-actions-section card">
            <h3>
              <Zap size={16} />
              Быстрые действия
            </h3>
            <div className="quick-actions-grid">
              {quickActions.map((action, index) => (
                <Link key={index} to={action.path} className="quick-action-card">
                  <div className="action-header">
                    <div className="action-icon" style={{ backgroundColor: action.color }}>
                      <action.icon size={16} color="white" />
                    </div>
                    {action.badge && (
                      <span className="action-badge" style={{ backgroundColor: action.color }}>
                        {action.badge}
                      </span>
                    )}
                  </div>
                  <div className="action-content">
                    <h4>{action.title}</h4>
                    <p>{action.description}</p>
                  </div>
                  <ArrowRight className="action-arrow" size={12} />
                </Link>
              ))}
            </div>
          </div>



          {/* Today's Schedule */}
          <div className="schedule-widget card">
            <h3>
              <Timer size={16} />
              Расписание на сегодня
            </h3>
            <div className="schedule-list">
              {upcomingClasses.length > 0 ? (
                upcomingClasses.map((cls, index) => (
                  <div key={index} className="schedule-item">
                    <div className="schedule-time">
                      <span className="time">{cls.time}</span>
                      <div 
                        className="status-dot" 
                        style={{ backgroundColor: getStatusColor(cls.status) }}
                      ></div>
                    </div>
                    <div className="schedule-details">
                      <h4>{cls.subject}</h4>
                      <p>{cls.room} • {cls.type}</p>
                      <span className="professor">{cls.professor}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-classes">Сегодня занятий нет</p>
              )}
            </div>
            <Link to="/schedule" className="btn btn-outline full-width">
              Полное расписание
            </Link>
          </div>

          {/* Combined Widgets - Горизонтальная строка */}
          <div className="combined-widgets">
            {/* Quick Stats */}
            <div className="quick-stats-widget card">
              <h3>
                <TrendingDown size={14} />
                Быстрая статистика
              </h3>
              <div className="quick-stats-list">
                {quickStats.map((stat, index) => (
                  <div key={index} className="quick-stat-item">
                    <div className="quick-stat-icon" style={{ backgroundColor: stat.color }}>
                      <stat.icon size={10} color="white" />
                    </div>
                    <div className="quick-stat-content">
                      <div className="quick-stat-value">
                        {stat.value} {stat.suffix}
                      </div>
                      <div className="quick-stat-label">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Today's Tasks */}
            <div className="tasks-widget card">
              <h3>
                <CheckCircle size={14} />
                Задачи на сегодня
              </h3>
              <div className="tasks-list">
                {todayTasks.map((task) => (
                  <EditableTask
                    key={task.id}
                    task={task}
                    onUpdate={updateTaskTitle}
                    onDelete={deleteTask}
                  />
                ))}
                <AddTaskInput onAdd={addQuickTask} />
              </div>
            </div>

            {/* Recent Notifications */}
            <div className="notifications-widget card">
              <h3>
                <Bell size={14} />
                Уведомления
              </h3>
              <div className="notifications-list">
                {recentNotifications.map((notification) => {
                  const IconComponent = getNotificationIcon(notification.type);
                  return (
                    <div key={notification.id} className={`notification-item ${notification.unread ? 'unread' : ''}`}>
                      <div className="notification-icon">
                        <IconComponent size={12} />
                      </div>
                      <div className="notification-info">
                        <h4>{notification.title}</h4>
                        <p>{notification.message}</p>
                        <span className="notification-updated">{notification.time}</span>
                      </div>
                      {notification.unread && (
                        <div className="notification-status">
                          <div className="status-indicator"></div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <Link to="/notifications" className="btn btn-outline full-width">
                Все уведомления
              </Link>
            </div>

            {/* Documents */}
            <div className="documents-widget card">
              <h3>
                <FileText size={14} />
                Документы
              </h3>
              <div className="documents-list">
                {documents.map((doc, index) => (
                  <div key={index} className="document-item">
                    <div className="document-icon">
                      <FileText size={14} />
                    </div>
                    <div className="document-info">
                      <h4>{doc.name}</h4>
                      <p>{doc.type} • {doc.size}</p>
                      <span className="document-updated">{doc.updated}</span>
                    </div>
                    <button className="download-btn">
                      <Download size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Analytics Chart */}
          <div className="analytics-section card">
            <div className="analytics-header">
              <h3>
                <BarChart3 size={16} />
                Аналитика успеваемости
              </h3>
              <div className="chart-tabs">
                <button
                  className={`chart-tab ${activeChartTab === 'performance' ? 'active' : ''}`}
                  onClick={() => setActiveChartTab('performance')}
                >
                  Динамика
                </button>
                <button
                  className={`chart-tab ${activeChartTab === 'grades' ? 'active' : ''}`}
                  onClick={() => setActiveChartTab('grades')}
                >
                  Прогресс
                </button>
                <button
                  className={`chart-tab ${activeChartTab === 'subjects' ? 'active' : ''}`}
                  onClick={() => setActiveChartTab('subjects')}
                >
                  Предметы
                </button>
                <button
                  className={`chart-tab ${activeChartTab === 'distribution' ? 'active' : ''}`}
                  onClick={() => setActiveChartTab('distribution')}
                >
                  Нагрузка
                </button>
              </div>
            </div>
            <div className="chart-container">
              {activeChartTab === 'performance' ? (
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="performance" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                      name="Успеваемость"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="quality" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
                      name="Качество"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="consistency" 
                      stroke="#f59e0b" 
                      strokeWidth={2}
                      dot={{ fill: '#f59e0b', strokeWidth: 2, r: 3 }}
                      name="Постоянство"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : activeChartTab === 'grades' ? (
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={gradesData}>
                    <defs>
                      <linearGradient id="gradeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="grade" 
                      stroke="#3b82f6" 
                      fill="url(#gradeGradient)"
                      strokeWidth={2}
                      name="Оценка"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="attendance" 
                      stroke="#10b981" 
                      fill="url(#attendanceGradient)"
                      strokeWidth={2}
                      name="Посещаемость"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="activity" 
                      stroke="#f59e0b" 
                      fill="url(#activityGradient)"
                      strokeWidth={2}
                      name="Активность"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : activeChartTab === 'subjects' ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={subjectsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip 
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="chart-tooltip">
                              <p className="tooltip-label">{data.fullName}</p>
                              <p style={{ color: '#3b82f6' }}>Оценка: {data.grade.toFixed(1)}</p>
                              <p style={{ color: '#10b981' }}>Прогресс: {data.progress}%</p>
                              <p style={{ color: '#f59e0b' }}>Кредиты: {data.credits} з.е.</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar 
                      dataKey="grade" 
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={distributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {distributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="chart-tooltip">
                              <p className="tooltip-label">{data.name}</p>
                              <p style={{ color: data.color }}>Кредиты: {data.value} з.е.</p>
                              <p style={{ color: data.color }}>Доля: {data.percentage}%</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 