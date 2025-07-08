import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { 
  Settings, 
  Plus, 
  Star, 
  Bell, 
  FileText, 
  BarChart3,
  X,
  Check,
  AlertTriangle 
} from 'lucide-react';
import './AdminPanel.css';

const AdminPanel = ({ isOpen, onClose }) => {
  const {
    subjects,
    addGrade,
    addTask,
    addNews,
    addAchievement,
    notifications,
    calculateAverageGrade
  } = useData();

  const [activeTab, setActiveTab] = useState('grades');
  const [feedback, setFeedback] = useState('');

  const addSampleGrade = () => {
    const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
    const grades = [3, 4, 5];
    const randomGrade = grades[Math.floor(Math.random() * grades.length)];
    const types = ['exam', 'lab', 'homework', 'test'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    
    const newGrade = {
      subjectId: randomSubject.id,
      value: randomGrade,
      date: new Date().toISOString().split('T')[0],
      type: randomType,
      weight: randomType === 'exam' ? 1.0 : randomType === 'test' ? 0.7 : 0.5
    };

    addGrade(newGrade);
    setFeedback(`Добавлена оценка ${randomGrade} по предмету "${randomSubject.name}"`);
    setTimeout(() => setFeedback(''), 3000);
  };

  const addSampleTask = () => {
    const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
    const tasks = [
      'Выполнить лабораторную работу',
      'Подготовить отчет',
      'Изучить материал лекции',
      'Решить практические задания',
      'Подготовиться к экзамену'
    ];
    const randomTask = tasks[Math.floor(Math.random() * tasks.length)];
    const priorities = ['high', 'medium', 'low'];
    const randomPriority = priorities[Math.floor(Math.random() * priorities.length)];
    
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 7) + 1);
    
    const newTask = {
      title: `${randomTask} по предмету "${randomSubject.name}"`,
      subjectId: randomSubject.id,
      completed: false,
      priority: randomPriority,
      dueDate: futureDate.toISOString().split('T')[0]
    };

    addTask(newTask);
    setFeedback(`Добавлена задача: "${newTask.title}"`);
    setTimeout(() => setFeedback(''), 3000);
  };

  const addSampleNews = () => {
    const newsTypes = [
      {
        title: 'Новые материалы по программированию',
        content: 'Добавлены дополнительные материалы для изучения современных технологий.',
        category: 'academic',
        tags: ['программирование', 'материалы', 'обучение']
      },
      {
        title: 'Студенческий конкурс проектов',
        content: 'Объявляется конкурс на лучший IT-проект среди студентов.',
        category: 'events',
        tags: ['конкурс', 'проекты', 'IT']
      },
      {
        title: 'Обновление системы оценок',
        content: 'Система электронного журнала обновлена с новыми функциями.',
        category: 'announcements',
        tags: ['система', 'обновление', 'функции']
      }
    ];
    
    const randomNews = newsTypes[Math.floor(Math.random() * newsTypes.length)];
    
    const newNews = {
      ...randomNews,
      fullContent: randomNews.content + ' Подробности будут опубликованы дополнительно.',
      date: new Date().toLocaleDateString('ru-RU'),
      author: 'Администрация портала',
      image: null
    };

    addNews(newNews);
    setFeedback(`Добавлена новость: "${newNews.title}"`);
    setTimeout(() => setFeedback(''), 3000);
  };

  const addSampleAchievement = () => {
    const achievements = [
      {
        title: 'Первая оценка "5"',
        description: 'Получена первая отличная оценка',
        icon: '🌟'
      },
      {
        title: 'Активный студент месяца',
        description: 'За активное участие в учебном процессе',
        icon: '🏅'
      },
      {
        title: 'Мастер программирования',
        description: 'За отличные результаты по программированию',
        icon: '💻'
      }
    ];
    
    const randomAchievement = achievements[Math.floor(Math.random() * achievements.length)];
    
    const newAchievement = {
      ...randomAchievement,
      date: new Date().toLocaleDateString('ru-RU'),
      criteria: 'demo_achievement'
    };

    addAchievement(newAchievement);
    setFeedback(`Получено достижение: "${newAchievement.title}"`);
    setTimeout(() => setFeedback(''), 3000);
  };

  const getStatistics = () => {
    return {
      averageGrade: calculateAverageGrade(),
      totalSubjects: subjects.length,
      unreadNotifications: notifications.filter(n => !n.read).length,
      totalNotifications: notifications.length
    };
  };

  const stats = getStatistics();

  if (!isOpen) return null;

  return (
    <div className="admin-panel-overlay">
      <div className="admin-panel">
        <div className="admin-panel-header">
          <h2>
            <Settings size={24} />
            Панель демонстрации
          </h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {feedback && (
          <div className="feedback-message">
            <Check size={16} />
            {feedback}
          </div>
        )}

        <div className="admin-tabs">
          <button 
            className={`tab ${activeTab === 'grades' ? 'active' : ''}`}
            onClick={() => setActiveTab('grades')}
          >
            <Star size={16} />
            Оценки
          </button>
          <button 
            className={`tab ${activeTab === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tasks')}
          >
            <FileText size={16} />
            Задачи
          </button>
          <button 
            className={`tab ${activeTab === 'news' ? 'active' : ''}`}
            onClick={() => setActiveTab('news')}
          >
            <Bell size={16} />
            Новости
          </button>
          <button 
            className={`tab ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            <BarChart3 size={16} />
            Статистика
          </button>
        </div>

        <div className="admin-content">
          {activeTab === 'grades' && (
            <div className="admin-section">
              <h3>Управление оценками</h3>
              <p>Добавьте случайную оценку для демонстрации динамических данных</p>
              <div className="action-buttons">
                <button className="btn btn-primary" onClick={addSampleGrade}>
                  <Plus size={16} />
                  Добавить оценку
                </button>
              </div>
              <div className="info-box">
                <AlertTriangle size={16} />
                При добавлении оценки автоматически обновится средний балл и создастся уведомление
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="admin-section">
              <h3>Управление задачами</h3>
              <p>Добавьте новую задачу в систему</p>
              <div className="action-buttons">
                <button className="btn btn-primary" onClick={addSampleTask}>
                  <Plus size={16} />
                  Добавить задачу
                </button>
              </div>
              <div className="info-box">
                <AlertTriangle size={16} />
                Новая задача появится в дашборде и счетчики обновятся автоматически
              </div>
            </div>
          )}

          {activeTab === 'news' && (
            <div className="admin-section">
              <h3>Управление новостями</h3>
              <p>Добавьте новость или достижение</p>
              <div className="action-buttons">
                <button className="btn btn-primary" onClick={addSampleNews}>
                  <Plus size={16} />
                  Добавить новость
                </button>
                <button className="btn btn-secondary" onClick={addSampleAchievement}>
                  <Star size={16} />
                  Добавить достижение
                </button>
              </div>
              <div className="info-box">
                <AlertTriangle size={16} />
                Новости отобразятся в разделе "Новости", достижения - в профиле
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="admin-section">
              <h3>Статистика системы</h3>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-label">Средний балл</div>
                  <div className="stat-value">{stats.averageGrade}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Предметов</div>
                  <div className="stat-value">{stats.totalSubjects}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Непрочитанных уведомлений</div>
                  <div className="stat-value">{stats.unreadNotifications}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Всего уведомлений</div>
                  <div className="stat-value">{stats.totalNotifications}</div>
                </div>
              </div>
              <div className="info-box">
                <AlertTriangle size={16} />
                Статистика обновляется в реальном времени при изменении данных
              </div>
            </div>
          )}
        </div>

        <div className="admin-footer">
          <p>🎯 Используйте эту панель для демонстрации связанности данных на всех страницах</p>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel; 