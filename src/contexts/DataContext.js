import React, { createContext, useContext, useState, useEffect } from 'react';
import { format, addDays, subDays } from 'date-fns';
import { ru } from 'date-fns/locale';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  // Базовые данные студента
  const [student, setStudent] = useState({
    id: 1,
    firstName: 'Александр',
    lastName: 'Петров',
    email: 'alex.petrov@student.university.ru',
    phone: '+7 (999) 123-45-67',
    birthDate: '1998-03-15',
    address: 'г. Москва, ул. Студенческая, д. 10, кв. 25',
    group: 'ИТ-21',
    course: 3,
    specialty: 'Информационные технологии',
    bio: 'Студент 3 курса факультета информационных технологий. Увлекаюсь программированием и веб-разработкой.',
    avatar: null,
    enrollmentDate: '2021-09-01'
  });

  // Предметы
  const [subjects] = useState([
    { id: 1, name: 'Программирование', teacher: 'Иванов А.А.', credits: 4, color: '#3b82f6' },
    { id: 2, name: 'Математический анализ', teacher: 'Петрова М.В.', credits: 3, color: '#10b981' },
    { id: 3, name: 'Веб-разработка', teacher: 'Волков Д.М.', credits: 3, color: '#f59e0b' },
    { id: 4, name: 'Базы данных', teacher: 'Козлов В.П.', credits: 4, color: '#8b5cf6' },
    { id: 5, name: 'Алгоритмы и структуры данных', teacher: 'Иванов А.А.', credits: 3, color: '#ef4444' },
    { id: 6, name: 'Английский язык', teacher: 'Смирнова О.И.', credits: 2, color: '#06b6d4' },
    { id: 7, name: 'Физика', teacher: 'Николаев С.С.', credits: 3, color: '#84cc16' },
    { id: 8, name: 'Философия', teacher: 'Морозова Л.К.', credits: 2, color: '#f97316' },
    { id: 9, name: 'История', teacher: 'Белова Н.Р.', credits: 2, color: '#ec4899' },
    { id: 10, name: 'Физическая культура', teacher: 'Соколов И.Н.', credits: 1, color: '#14b8a6' }
  ]);

  // Оценки
  const [grades, setGrades] = useState([
    { id: 1, subjectId: 1, value: 5, date: '2024-03-01', type: 'exam', weight: 1.0 },
    { id: 2, subjectId: 1, value: 4, date: '2024-02-15', type: 'lab', weight: 0.5 },
    { id: 3, subjectId: 1, value: 5, date: '2024-02-01', type: 'homework', weight: 0.3 },
    { id: 4, subjectId: 2, value: 4, date: '2024-03-05', type: 'exam', weight: 1.0 },
    { id: 5, subjectId: 2, value: 5, date: '2024-02-20', type: 'test', weight: 0.7 },
    { id: 6, subjectId: 3, value: 5, date: '2024-03-10', type: 'project', weight: 1.0 },
    { id: 7, subjectId: 3, value: 4, date: '2024-02-25', type: 'lab', weight: 0.5 },
    { id: 8, subjectId: 4, value: 4, date: '2024-03-08', type: 'exam', weight: 1.0 },
    { id: 9, subjectId: 4, value: 5, date: '2024-02-18', type: 'lab', weight: 0.5 },
    { id: 10, subjectId: 5, value: 3, date: '2024-02-10', type: 'test', weight: 0.7 }
  ]);

  // Расписание
  const [schedule] = useState({
    0: { // Понедельник
      '09:00': { subjectId: 1, type: 'Лекция', room: 'Ауд. 205', duration: 90 },
      '10:45': { subjectId: 2, type: 'Семинар', room: 'Ауд. 301', duration: 90 },
      '12:30': { subjectId: 6, type: 'Практика', room: 'Ауд. 112', duration: 90 }
    },
    1: { // Вторник
      '09:00': { subjectId: 4, type: 'Лекция', room: 'Ауд. 308', duration: 90 },
      '10:45': { subjectId: 7, type: 'Лабораторная', room: 'Лаб. 15', duration: 90 }
    },
    2: { // Среда
      '09:00': { subjectId: 5, type: 'Лекция', room: 'Ауд. 205', duration: 90 },
      '12:30': { subjectId: 8, type: 'Семинар', room: 'Ауд. 401', duration: 90 }
    },
    3: { // Четверг
      '10:45': { subjectId: 3, type: 'Практика', room: 'Комп. класс 1', duration: 90 },
      '14:15': { subjectId: 9, type: 'Лекция', room: 'Ауд. 201', duration: 90 }
    },
    4: { // Пятница
      '09:00': { subjectId: 1, type: 'Практика', room: 'Комп. класс 2', duration: 90 },
      '10:45': { subjectId: 2, type: 'Лекция', room: 'Ауд. 301', duration: 90 }
    },
    5: { // Суббота
      '09:00': { subjectId: 10, type: 'Практика', room: 'Спортзал', duration: 90 }
    }
  });

  // Задачи
  const [tasks, setTasks] = useState([
    { 
      id: 1, 
      title: 'Сдать лабораторную по программированию', 
      subjectId: 1, 
      completed: false, 
      priority: 'high', 
      dueDate: '2024-03-20',
      createdAt: '2024-03-15'
    },
    { 
      id: 2, 
      title: 'Прочитать главу 5 по математике', 
      subjectId: 2, 
      completed: true, 
      priority: 'medium', 
      dueDate: '2024-03-18',
      createdAt: '2024-03-10'
    },
    { 
      id: 3, 
      title: 'Подготовить презентацию по веб-разработке', 
      subjectId: 3, 
      completed: false, 
      priority: 'high', 
      dueDate: '2024-03-25',
      createdAt: '2024-03-16'
    },
    { 
      id: 4, 
      title: 'Повторить алгоритмы сортировки', 
      subjectId: 5, 
      completed: false, 
      priority: 'low', 
      dueDate: '2024-03-22',
      createdAt: '2024-03-14'
    },
    { 
      id: 5, 
      title: 'Выполнить практическую работу по БД', 
      subjectId: 4, 
      completed: false, 
      priority: 'medium', 
      dueDate: '2024-03-21',
      createdAt: '2024-03-12'
    }
  ]);

  // Уведомления
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'urgent',
      title: 'Изменения в расписании',
      message: 'Занятие по математике 16 марта переносится на 14:00',
      time: '10 минут назад',
      read: false,
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      relatedSubjectId: 2
    },
    {
      id: 2,
      type: 'info',
      title: 'Новое задание',
      message: 'Преподаватель добавил новое задание по программированию',
      time: '1 час назад',
      read: false,
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      relatedSubjectId: 1
    },
    {
      id: 3,
      type: 'success',
      title: 'Оценка выставлена',
      message: 'За лабораторную работу №3 по базам данных выставлена оценка "отлично"',
      time: '3 часа назад',
      read: true,
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      relatedSubjectId: 4
    },
    {
      id: 4,
      type: 'warning',
      title: 'Приближается дедлайн',
      message: 'До сдачи курсовой работы осталось 3 дня',
      time: '6 часов назад',
      read: false,
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      relatedSubjectId: 3
    }
  ]);

  // Новости
  const [news, setNews] = useState([
    {
      id: 1,
      title: 'Новая система электронного обучения',
      content: 'Университет запускает новую платформу для дистанционного обучения. Система включает в себя интерактивные лекции, онлайн-тестирование и возможность обратной связи с преподавателями в реальном времени.',
      fullContent: 'Университет анонсировал запуск революционной системы электронного обучения, которая станет новым стандартом образования. Платформа разработана с учетом современных требований и включает множество инновационных функций для студентов и преподавателей.',
      date: '15 мар 2024',
      author: 'Администрация',
      category: 'academic',
      image: null,
      tags: ['образование', 'технологии', 'онлайн']
    },
    {
      id: 2,
      title: 'Студенческая научная конференция',
      content: 'Приглашаем всех студентов принять участие в ежегодной конференции "Молодая наука - 2024". Прием заявок до 25 марта.',
      fullContent: 'Научная конференция "Молодая наука - 2024" пройдет в формате очно-заочного участия. Студенты смогут представить свои исследования в различных секциях по информационным технологиям, математике и другим дисциплинам.',
      date: '10 мар 2024',
      author: 'Научная часть',
      category: 'events',
      image: null,
      tags: ['конференция', 'наука', 'студенты']
    },
    {
      id: 3,
      title: 'Изменения в расписании',
      content: 'Внимание! С 18 марта временно изменяется расписание занятий для групп ИТ-21 и ИТ-22 в связи с ремонтными работами.',
      fullContent: 'В связи с плановыми ремонтными работами в учебном корпусе №2, администрация уведомляет об изменениях в расписании. Занятия будут перенесены в резервные аудитории.',
      date: '8 мар 2024',
      author: 'Учебная часть',
      category: 'announcements',
      image: null,
      tags: ['расписание', 'ремонт', 'важно']
    }
  ]);

  // Достижения
  const [achievements, setAchievements] = useState([
    { 
      id: 1,
      title: 'Отличник учёбы', 
      description: 'За высокие академические результаты', 
      date: '2024-01-15', 
      icon: '🏆',
      criteria: 'average_grade >= 4.5'
    },
    { 
      id: 2,
      title: 'Лучший проект', 
      description: 'За инновационный веб-проект', 
      date: '2023-12-10', 
      icon: '💻',
      criteria: 'project_grade >= 5'
    },
    { 
      id: 3,
      title: 'Активный студент', 
      description: 'За участие в студенческой жизни', 
      date: '2023-10-05', 
      icon: '⭐',
      criteria: 'activity_score >= 80'
    }
  ]);

  // Настройки
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyReport: true,
    gradeNotifications: true,
    theme: 'light',
    language: 'ru'
  });

  // Загрузка данных из localStorage при инициализации
  useEffect(() => {
    const savedData = localStorage.getItem('uniportal_data');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        if (parsedData.student) setStudent(parsedData.student);
        if (parsedData.grades) setGrades(parsedData.grades);
        if (parsedData.tasks) setTasks(parsedData.tasks);
        if (parsedData.notifications) setNotifications(parsedData.notifications);
        if (parsedData.news) setNews(parsedData.news);
        if (parsedData.achievements) setAchievements(parsedData.achievements);
        if (parsedData.settings) setSettings(parsedData.settings);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      }
    }
    
    // Синхронизация с данными профиля
    syncWithProfile();
  }, []);

  // Синхронизация с данными профиля
  const syncWithProfile = () => {
    const profileData = localStorage.getItem('studentProfile');
    if (profileData) {
      try {
        const parsedProfile = JSON.parse(profileData);
        setStudent(prev => ({
          ...prev,
          firstName: parsedProfile.firstName || prev.firstName,
          lastName: parsedProfile.lastName || prev.lastName,
          email: parsedProfile.email || prev.email,
          phone: parsedProfile.phone || prev.phone,
          birthDate: parsedProfile.birthDate || prev.birthDate,
          group: parsedProfile.group || prev.group,
          course: parsedProfile.course || prev.course,
          specialty: parsedProfile.specialty || prev.specialty,
          bio: parsedProfile.bio || prev.bio,
          avatar: parsedProfile.avatar || prev.avatar
        }));
      } catch (error) {
        console.error('Ошибка синхронизации с профилем:', error);
      }
    }
  };

  // Слушаем изменения в localStorage профиля
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'studentProfile') {
        syncWithProfile();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Сохранение данных в localStorage при изменении
  useEffect(() => {
    const dataToSave = {
      student,
      grades,
      tasks,
      notifications,
      news,
      achievements,
      settings
    };
    localStorage.setItem('uniportal_data', JSON.stringify(dataToSave));
  }, [student, grades, tasks, notifications, news, achievements, settings]);

  // Вычисляемые значения
  const getSubjectById = (id) => subjects.find(s => s.id === id);
  
  const getGradesBySubject = (subjectId) => 
    grades.filter(g => g.subjectId === subjectId);
  
  const calculateAverageGrade = () => {
    if (grades.length === 0) return 0;
    const totalWeight = grades.reduce((sum, grade) => sum + grade.weight, 0);
    const weightedSum = grades.reduce((sum, grade) => sum + grade.value * grade.weight, 0);
    return Math.round((weightedSum / totalWeight) * 10) / 10;
  };

  const getSubjectAverageGrade = (subjectId) => {
    const subjectGrades = getGradesBySubject(subjectId);
    if (subjectGrades.length === 0) return null;
    const totalWeight = subjectGrades.reduce((sum, grade) => sum + grade.weight, 0);
    const weightedSum = subjectGrades.reduce((sum, grade) => sum + grade.value * grade.weight, 0);
    return Math.round((weightedSum / totalWeight) * 10) / 10;
  };

  const getAttendanceRate = () => {
    // Симуляция расчета посещаемости
    const totalClasses = 48;
    const attendedClasses = 44;
    return Math.round((attendedClasses / totalClasses) * 100);
  };

  const getCompletedTasksCount = () => 
    tasks.filter(task => task.completed).length;

  const getTotalTasksCount = () => tasks.length;

  const getUnreadNotificationsCount = () => 
    notifications.filter(notif => !notif.read).length;

  const getScheduleForDay = (dayIndex) => {
    const daySchedule = schedule[dayIndex] || {};
    return Object.entries(daySchedule).map(([time, classInfo]) => ({
      time,
      ...classInfo,
      subject: getSubjectById(classInfo.subjectId)
    }));
  };

  const getTasksForToday = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return tasks.filter(task => task.dueDate === today);
  };

  const getOverdueTasks = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return tasks.filter(task => task.dueDate < today && !task.completed);
  };

  const getUpcomingTasks = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const nextWeek = format(addDays(new Date(), 7), 'yyyy-MM-dd');
    return tasks.filter(task => task.dueDate > today && task.dueDate <= nextWeek);
  };

  // Функции для изменения данных
  const updateStudent = (newData) => {
    setStudent(prev => ({ ...prev, ...newData }));
  };

  const addGrade = (newGrade) => {
    const gradeWithId = { ...newGrade, id: Date.now() };
    setGrades(prev => [...prev, gradeWithId]);
    
    // Создаем уведомление о новой оценке
    const subject = getSubjectById(newGrade.subjectId);
    const notification = {
      id: Date.now() + 1,
      type: 'success',
      title: 'Новая оценка',
      message: `Выставлена оценка ${newGrade.value} по предмету "${subject.name}"`,
      time: 'Только что',
      read: false,
      timestamp: new Date(),
      relatedSubjectId: newGrade.subjectId
    };
    setNotifications(prev => [notification, ...prev]);
  };

  const updateGrade = (gradeId, newValue) => {
    setGrades(prev => prev.map(grade => 
      grade.id === gradeId ? { ...grade, value: newValue } : grade
    ));
  };

  const addTask = (newTask) => {
    const taskWithId = { 
      ...newTask, 
      id: Date.now(), 
      createdAt: format(new Date(), 'yyyy-MM-dd') 
    };
    setTasks(prev => [...prev, taskWithId]);
  };

  const updateTask = (taskId, updates) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    ));
  };

  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  // Функции для быстрого редактирования задач
  const addQuickTask = (title) => {
    if (!title.trim()) return;
    const newTask = {
      id: Date.now(),
      title: title.trim(),
      subjectId: null,
      completed: false,
      priority: 'medium',
      dueDate: format(new Date(), 'yyyy-MM-dd'),
      createdAt: format(new Date(), 'yyyy-MM-dd')
    };
    setTasks(prev => [...prev, newTask]);
    return newTask.id;
  };

  const updateTaskTitle = (taskId, newTitle) => {
    if (!newTitle.trim()) {
      deleteTask(taskId);
      return;
    }
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, title: newTitle.trim() } : task
    ));
  };

  const toggleTaskCompleted = (taskId) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const markNotificationAsRead = (notificationId) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === notificationId ? { ...notif, read: true } : notif
    ));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const deleteNotification = (notificationId) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  };

  const addNews = (newNews) => {
    const newsWithId = { ...newNews, id: Date.now() };
    setNews(prev => [newsWithId, ...prev]);
  };

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const addAchievement = (newAchievement) => {
    const achievementWithId = { ...newAchievement, id: Date.now() };
    setAchievements(prev => [...prev, achievementWithId]);
  };

  // Статистические данные для диаграмм
  const getGradesChartData = () => {
    const months = ['Сен', 'Окт', 'Ноя', 'Дек', 'Янв', 'Фев', 'Мар'];
    
    // Создаем реалистичную прогрессию с трендом улучшения
    const baseGrades = [3.6, 3.8, 4.1, 4.3, 4.5, 4.6, 4.7];
    const attendance = [82, 85, 88, 90, 92, 94, 95];
    const activity = [65, 70, 75, 80, 85, 87, 90];
    const assignments = [8, 10, 12, 14, 16, 18, 20];
    
    return months.map((month, index) => ({
      month,
      grade: baseGrades[index],
      attendance: attendance[index],
      activity: activity[index],
      assignments: assignments[index],
      trend: index > 0 ? baseGrades[index] - baseGrades[index - 1] : 0
    }));
  };

  const getSubjectsChartData = () => {
    return subjects.slice(0, 6).map(subject => {
      const avgGrade = getSubjectAverageGrade(subject.id);
      const complexity = {
        1: 85, // Программирование
        2: 78, // Математический анализ
        3: 92, // Веб-разработка
        4: 88, // Базы данных
        5: 82, // Алгоритмы
        6: 95  // Английский язык
      };
      
      return {
        name: subject.name.length > 15 ? subject.name.substring(0, 15) + '...' : subject.name,
        fullName: subject.name,
        grade: avgGrade || (3.5 + Math.random() * 1.5),
        progress: complexity[subject.id] || 85,
        credits: subject.credits,
        color: subject.color,
        difficulty: subject.id === 2 || subject.id === 5 ? 'hard' : 
                   subject.id === 6 || subject.id === 10 ? 'easy' : 'medium'
      };
    });
  };

  const getPerformanceAnalytics = () => {
    const currentMonth = new Date().getMonth();
    const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
    
    // Данные за последние 12 месяцев
    const data = [];
    for (let i = 11; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      const progress = Math.max(0, Math.min(100, 60 + (11 - i) * 3 + Math.random() * 10));
      
      data.push({
        month: months[monthIndex],
        performance: Math.round(progress * 10) / 10,
        quality: Math.round((progress * 0.9 + Math.random() * 10) * 10) / 10,
        effort: Math.round((progress * 1.1 - Math.random() * 5) * 10) / 10,
        consistency: Math.round((85 + Math.random() * 15) * 10) / 10
      });
    }
    
    return data;
  };

  const getSubjectDistribution = () => {
    const totalCredits = subjects.reduce((sum, subject) => sum + subject.credits, 0);
    
    return subjects.map(subject => ({
      name: subject.name,
      value: subject.credits,
      percentage: Math.round((subject.credits / totalCredits) * 100),
      color: subject.color,
      status: getSubjectAverageGrade(subject.id) >= 4.5 ? 'excellent' : 
              getSubjectAverageGrade(subject.id) >= 4.0 ? 'good' : 
              getSubjectAverageGrade(subject.id) >= 3.5 ? 'satisfactory' : 'needs_improvement'
    }));
  };

  const value = {
    // Данные
    student,
    subjects,
    grades,
    schedule,
    tasks,
    notifications,
    news,
    achievements,
    settings,
    
    // Вычисляемые значения
    getSubjectById,
    getGradesBySubject,
    calculateAverageGrade,
    getSubjectAverageGrade,
    getAttendanceRate,
    getCompletedTasksCount,
    getTotalTasksCount,
    getUnreadNotificationsCount,
    getScheduleForDay,
    getTasksForToday,
    getOverdueTasks,
    getUpcomingTasks,
    getGradesChartData,
    getSubjectsChartData,
    getPerformanceAnalytics,
    getSubjectDistribution,
    
    // Функции изменения данных
    updateStudent,
    addGrade,
    updateGrade,
    addTask,
    updateTask,
    deleteTask,
    addQuickTask,
    updateTaskTitle,
    toggleTaskCompleted,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    addNews,
    updateSettings,
    addAchievement,
    syncWithProfile
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}; 