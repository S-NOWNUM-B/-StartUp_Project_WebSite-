import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import CountUp from 'react-countup';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  User, 
  ChevronLeft, 
  ChevronRight,
  BookOpen,
  Coffee,
  TrendingUp,
  Award,
  Timer,
  Users,
  Target,
  Activity,
  CheckCircle,
  BarChart3,
  Filter,
  Settings,
  Download,
  RefreshCw
} from 'lucide-react';
import { format, addDays, startOfWeek, getWeek } from 'date-fns';
import { ru } from 'date-fns/locale';
import './Schedule.css';

const Schedule = () => {
  const {
    student,
    schedule,
    subjects,
    getScheduleForDay,
    getSubjectById
  } = useData();

  const [selectedWeek, setSelectedWeek] = useState(0);
  const [selectedDay, setSelectedDay] = useState(new Date().getDay() - 1);
  const [viewMode, setViewMode] = useState('week');

  const weekDays = [
    'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'
  ];

  const getTypeColor = (type) => {
    switch (type) {
      case 'Лекция': return '#3b82f6';
      case 'Семинар': return '#10b981';
      case 'Практика': return '#f59e0b';
      case 'Лабораторная': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Лекция': return BookOpen;
      case 'Семинар': return Users;
      case 'Практика': return Target;
      case 'Лабораторная': return Activity;
      default: return Clock;
    }
  };

  // Статистика расписания
  const getScheduleStats = () => {
    const allClasses = weekDays.flatMap((_, index) => getScheduleForDay(index));
    const totalClasses = allClasses.length;
    const totalHours = allClasses.reduce((sum, cls) => sum + (cls.duration || 90), 0) / 60;
    
    const typeStats = allClasses.reduce((acc, cls) => {
      acc[cls.type] = (acc[cls.type] || 0) + 1;
      return acc;
    }, {});

    const freeHours = (6 * 10) - totalHours;
    
    return {
      totalClasses,
      totalHours: Math.round(totalHours * 10) / 10,
      freeHours: Math.round(freeHours * 10) / 10,
      typeStats,
      busyDays: weekDays.filter((_, index) => getScheduleForDay(index).length > 0).length
    };
  };

  const scheduleStats = getScheduleStats();

  // Получение текущей недели
  const getCurrentWeekDates = () => {
    const today = new Date();
    const monday = startOfWeek(today, { weekStartsOn: 1 });
    const weekStart = addDays(monday, selectedWeek * 7);
    
    return weekDays.map((_, index) => {
      return addDays(weekStart, index);
    });
  };

  const weekDates = getCurrentWeekDates();
  const currentWeekNumber = getWeek(weekDates[0], { weekStartsOn: 1 });

  // Недельная статистика
  const getWeekStats = () => {
    return weekDays.map((day, index) => {
      const dayClasses = getScheduleForDay(index);
      const dayHours = dayClasses.reduce((sum, cls) => sum + (cls.duration || 90), 0) / 60;
      
      return {
        day,
        dayShort: day.slice(0, 2),
        date: weekDates[index],
        classesCount: dayClasses.length,
        hours: Math.round(dayHours * 10) / 10,
        classes: dayClasses.map(cls => ({
          ...cls,
          subject: getSubjectById(cls.subjectId),
          color: getTypeColor(cls.type)
        })),
        isToday: index === new Date().getDay() - 1
      };
    });
  };

  const weekStats = getWeekStats();

  // Статистические карточки
  const stats = [
    {
      icon: BookOpen,
      label: 'Занятий в неделю',
      value: scheduleStats.totalClasses,
      color: '#3b82f6',
      trend: '+2',
      description: 'По сравнению с прошлой неделей'
    },
    {
      icon: Clock,
      label: 'Часов учёбы',
      value: scheduleStats.totalHours,
      color: '#10b981',
      trend: '+1.5ч',
      description: 'Академических часов',
      decimals: 1
    },
    {
      icon: Coffee,
      label: 'Свободного времени',
      value: scheduleStats.freeHours,
      color: '#f59e0b',
      trend: '-30мин',
      description: 'Часов для отдыха',
      decimals: 1
    },
    {
      icon: CalendarIcon,
      label: 'Учебных дней',
      value: scheduleStats.busyDays,
      color: '#8b5cf6',
      trend: 'стабильно',
      description: 'Из 6 дней недели'
    }
  ];

  // Прогресс недели
  const weekProgress = {
    completed: Math.min(new Date().getDay() - 1, 6),
    total: 6,
    percentage: Math.round((Math.min(new Date().getDay() - 1, 6) / 6) * 100)
  };

  return (
    <div className="schedule">
      <div className="container">
        {/* Header */}
        <div className="schedule-header">
          <div className="header-content">
            <div className="welcome-section">
              <h1>
                <CalendarIcon className="header-icon" />
                Расписание занятий
              </h1>
              <p className="header-subtitle">
                Группа {student.group}, {student.course} курс • Неделя {currentWeekNumber}
              </p>
            </div>
            <div className="week-progress-card">
              <div className="progress-info">
                <h3>Прогресс недели</h3>
                <p>День {weekProgress.completed + 1} из {weekProgress.total}</p>
              </div>
              <div className="progress-circle">
                <CircularProgressbar
                  value={weekProgress.percentage}
                  text={`${weekProgress.percentage}%`}
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
                    decimals={stat.decimals || 0}
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

        {/* Overview Widgets */}
        <div className="overview-widgets-row">
          {/* Week Overview */}
          <div className="week-overview-widget card">
            <h3>
              <BarChart3 size={16} />
              Обзор недели
            </h3>
            <div className="week-stats">
              {weekStats.map((dayStat, index) => (
                <div 
                  key={index} 
                  className={`day-summary ${dayStat.isToday ? 'today' : ''} ${selectedDay === index ? 'selected' : ''}`}
                  onClick={() => setSelectedDay(index)}
                >
                  <div className="day-summary-header">
                    <span className="day-short">{dayStat.dayShort}</span>
                    <span className="day-date">{format(dayStat.date, 'd')}</span>
                  </div>
                  <div className="day-summary-stats">
                    <div className="classes-count">{dayStat.classesCount} пар</div>
                    <div className="hours-count">{dayStat.hours}ч</div>
                  </div>
                  <div className="day-summary-classes">
                    {dayStat.classes.slice(0, 4).map((cls, idx) => (
                      <div 
                        key={idx}
                        className="mini-class"
                        style={{ backgroundColor: cls.color }}
                        title={`${cls.subject?.name || 'Неизвестный предмет'} (${cls.type})`}
                      />
                    ))}
                    {dayStat.classes.length > 4 && (
                      <div className="more-classes">+{dayStat.classes.length - 4}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Today Stats */}
          <div className="quick-stats-widget card">
            <h3>
              <TrendingUp size={16} />
              Сегодня
            </h3>
            <div className="today-stats">
              <div className="today-stat-item">
                <div className="today-stat-icon" style={{ backgroundColor: '#3b82f6' }}>
                  <BookOpen size={16} color="white" />
                </div>
                <div className="today-stat-content">
                  <div className="today-stat-value">
                    {weekStats[Math.max(0, new Date().getDay() - 1)]?.classesCount || 0}
                  </div>
                  <div className="today-stat-label">Пар</div>
                </div>
              </div>
              <div className="today-stat-item">
                <div className="today-stat-icon" style={{ backgroundColor: '#10b981' }}>
                  <Clock size={16} color="white" />
                </div>
                <div className="today-stat-content">
                  <div className="today-stat-value">
                    {weekStats[Math.max(0, new Date().getDay() - 1)]?.hours || 0}
                  </div>
                  <div className="today-stat-label">Часов</div>
                </div>
              </div>
              <div className="today-stat-item">
                <div className="today-stat-icon" style={{ backgroundColor: '#f59e0b' }}>
                  <Coffee size={16} color="white" />
                </div>
                <div className="today-stat-content">
                  <div className="today-stat-value">
                    {Math.max(0, 10 - (weekStats[Math.max(0, new Date().getDay() - 1)]?.hours || 0))}
                  </div>
                  <div className="today-stat-label">Свободно</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation and Controls */}
        <div className="schedule-controls">
          <div className="week-navigation">
            <button 
              className="btn btn-secondary"
              onClick={() => setSelectedWeek(selectedWeek - 1)}
            >
              <ChevronLeft size={20} />
              Предыдущая
            </button>
            <div className="current-week">
              <span className="week-title">
                {selectedWeek === 0 ? 'Текущая неделя' : 
                 selectedWeek > 0 ? `+${selectedWeek} неделя` : `${selectedWeek} неделя`}
              </span>
              <span className="week-dates">
                {format(weekDates[0], 'd MMM', { locale: ru })} - {format(weekDates[5], 'd MMM yyyy', { locale: ru })}
              </span>
            </div>
            <button 
              className="btn btn-secondary"
              onClick={() => setSelectedWeek(selectedWeek + 1)}
            >
              Следующая
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="view-controls">
            <div className="view-mode-toggle">
              <button 
                className={`btn ${viewMode === 'week' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setViewMode('week')}
              >
                Неделя
              </button>
              <button 
                className={`btn ${viewMode === 'day' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setViewMode('day')}
              >
                День
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content-grid">
          {/* Schedule Display - Main Widget */}
          <div className="schedule-display card">
            <div className="schedule-display-header">
              <h3>
                <Clock size={16} />
                {viewMode === 'week' ? 'Расписание недели' : `${weekDays[selectedDay]}, ${format(weekDates[selectedDay], 'd MMMM', { locale: ru })}`}
              </h3>
              <div className="schedule-actions">
                <button className="btn btn-ghost">
                  <Download size={16} />
                </button>
                <button className="btn btn-ghost">
                  <RefreshCw size={16} />
                </button>
              </div>
            </div>

            <div className="schedule-content">
              {viewMode === 'week' ? (
                <div className="week-schedule">
                  {weekStats.map((dayStat, dayIndex) => (
                    <div key={dayIndex} className="day-column">
                      <div className="day-header">
                        <h4>{dayStat.day}</h4>
                        <span className="day-date">{format(dayStat.date, 'd MMM', { locale: ru })}</span>
                      </div>
                      <div className="day-classes">
                        {dayStat.classes.map((cls, clsIndex) => {
                          const IconComponent = getTypeIcon(cls.type);
                          return (
                            <div key={clsIndex} className="class-card mini">
                              <div className="class-time">{cls.time}</div>
                              <div className="class-type" style={{ backgroundColor: cls.color }}>
                                <IconComponent size={14} />
                              </div>
                              <div className="class-info">
                                <h5>{cls.subject?.name || 'Неизвестный предмет'}</h5>
                                <p>{cls.room}</p>
                              </div>
                            </div>
                          );
                        })}
                        {dayStat.classes.length === 0 && (
                          <div className="no-classes">Занятий нет</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="day-schedule">
                  {(weekStats[selectedDay]?.classes || []).map((cls, index) => {
                    const IconComponent = getTypeIcon(cls.type);
                    return (
                      <div key={index} className="class-card detailed">
                        <div className="class-time-indicator">
                          <Clock size={16} />
                          <span>{cls.time}</span>
                        </div>
                        <div 
                          className="class-type-badge"
                          style={{ backgroundColor: cls.color }}
                        >
                          <IconComponent size={16} />
                          {cls.type}
                        </div>
                        <div className="class-main-info">
                          <h4>{cls.subject?.name || 'Неизвестный предмет'}</h4>
                          <div className="class-details">
                            <div className="detail-item">
                              <MapPin size={16} />
                              {cls.room}
                            </div>
                            <div className="detail-item">
                              <User size={16} />
                              {cls.subject?.teacher || 'Неизвестный преподаватель'}
                            </div>
                            <div className="detail-item">
                              <Timer size={16} />
                              {cls.duration || 90} мин
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {(weekStats[selectedDay]?.classes || []).length === 0 && (
                    <div className="no-classes-day">
                      <CalendarIcon size={48} />
                      <h4>Занятий нет</h4>
                      <p>Свободный день для самостоятельной работы</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule; 