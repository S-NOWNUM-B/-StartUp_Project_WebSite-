import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import CountUp from 'react-countup';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import {
  GraduationCap,
  BookOpen,
  TrendingUp,
  Award,
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  AlertCircle,
  XCircle,
  Target,
  Trophy
} from 'lucide-react';
import { useData } from '../contexts/DataContext';
import './Grades.css';

const Grades = () => {
  const { student } = useData();

  // Состояния
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewMode, setViewMode] = useState('table'); // table, cards, chart
  const [showFilters, setShowFilters] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState(null);

  // Принудительно прокручиваем страницу наверх при загрузке
  React.useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Данные об оценках
  const gradesData = [
    {
      id: 1,
      subject: 'Математический анализ',
      type: 'Экзамен',
      grade: 5,
      date: new Date('2024-01-15'),
      semester: 2,
      teacher: 'Иванов И.И.',
      credits: 4,
      hours: 144,
      category: 'Основной',
      weight: 1.0,
      maxScore: 100,
      score: 92,
      description: 'Теория пределов, дифференцирование'
    },
    {
      id: 2,
      subject: 'Программирование',
      type: 'Зачет',
      grade: 'зачет',
      date: new Date('2024-01-10'),
      semester: 2,
      teacher: 'Петров П.П.',
      credits: 3,
      hours: 108,
      category: 'Основной',
      weight: 0.8,
      maxScore: 100,
      score: 88,
      description: 'Основы программирования на Python'
    },
    {
      id: 3,
      subject: 'Физика',
      type: 'Экзамен',
      grade: 4,
      date: new Date('2024-01-20'),
      semester: 2,
      teacher: 'Сидоров С.С.',
      credits: 4,
      hours: 144,
      category: 'Основной',
      weight: 1.0,
      maxScore: 100,
      score: 78,
      description: 'Механика, термодинамика'
    },
    {
      id: 4,
      subject: 'Английский язык',
      type: 'Зачет',
      grade: 'зачет',
      date: new Date('2024-01-12'),
      semester: 2,
      teacher: 'Козлова А.В.',
      credits: 2,
      hours: 72,
      category: 'Гуманитарный',
      weight: 0.6,
      maxScore: 100,
      score: 85,
      description: 'Деловой английский'
    },
    {
      id: 5,
      subject: 'Линейная алгебра',
      type: 'Экзамен',
      grade: 5,
      date: new Date('2024-01-25'),
      semester: 2,
      teacher: 'Морозов В.И.',
      credits: 3,
      hours: 108,
      category: 'Основной',
      weight: 1.0,
      maxScore: 100,
      score: 95,
      description: 'Матрицы, определители, векторы'
    },
    {
      id: 6,
      subject: 'Дискретная математика',
      type: 'Экзамен',
      grade: 4,
      date: new Date('2024-01-18'),
      semester: 2,
      teacher: 'Белов Н.К.',
      credits: 3,
      hours: 108,
      category: 'Основной',
      weight: 1.0,
      maxScore: 100,
      score: 82,
      description: 'Теория графов, комбинаторика'
    },
    {
      id: 7,
      subject: 'История',
      type: 'Зачет',
      grade: 'зачет',
      date: new Date('2024-01-08'),
      semester: 2,
      teacher: 'Романова О.Л.',
      credits: 2,
      hours: 72,
      category: 'Гуманитарный',
      weight: 0.5,
      maxScore: 100,
      score: 90,
      description: 'История России XX века'
    },
    {
      id: 8,
      subject: 'Базы данных',
      type: 'Экзамен',
      grade: 5,
      date: new Date('2024-01-30'),
      semester: 2,
      teacher: 'Кузнецов А.М.',
      credits: 4,
      hours: 144,
      category: 'Специальный',
      weight: 1.2,
      maxScore: 100,
      score: 89,
      description: 'SQL, проектирование БД'
    },
    {
      id: 9,
      subject: 'Алгоритмы и структуры данных',
      type: 'Экзамен',
      grade: 4,
      date: new Date('2024-02-02'),
      semester: 2,
      teacher: 'Волков Д.С.',
      credits: 4,
      hours: 144,
      category: 'Специальный',
      weight: 1.2,
      maxScore: 100,
      score: 81,
      description: 'Сортировка, поиск, деревья'
    },
    {
      id: 10,
      subject: 'Веб-разработка',
      type: 'Зачет',
      grade: 'зачет',
      date: new Date('2024-02-05'),
      semester: 2,
      teacher: 'Лебедев И.Р.',
      credits: 3,
      hours: 108,
      category: 'Специальный',
      weight: 1.0,
      maxScore: 100,
      score: 93,
      description: 'HTML, CSS, JavaScript, React'
    }
  ];

  // Расчет статистики
  const calculateStats = () => {
    const numericGrades = gradesData.filter(g => typeof g.grade === 'number');
    const totalCredits = gradesData.reduce((sum, g) => sum + g.credits, 0);
    const weightedSum = numericGrades.reduce((sum, g) => sum + (g.grade * g.credits), 0);
    const creditSum = numericGrades.reduce((sum, g) => sum + g.credits, 0);
    const averageGrade = creditSum > 0 ? (weightedSum / creditSum).toFixed(2) : 0;

    const excellentGrades = numericGrades.filter(g => g.grade === 5).length;
    const goodGrades = numericGrades.filter(g => g.grade === 4).length;
    const passedSubjects = gradesData.filter(g => g.grade === 'зачет' || (typeof g.grade === 'number' && g.grade >= 3)).length;

    const qualityPercent = numericGrades.length > 0 ?
      Math.round(((excellentGrades + goodGrades) / numericGrades.length) * 100) : 0;

    return {
      totalSubjects: gradesData.length,
      averageGrade: parseFloat(averageGrade),
      qualityPercent,
      totalCredits,
      excellentGrades,
      goodGrades,
      passedSubjects
    };
  };

  const stats = calculateStats();

  // Фильтрация оценок
  const filteredGrades = gradesData.filter(grade => {
    const matchesSearch = grade.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         grade.teacher.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSemester = selectedSemester === 'all' || grade.semester.toString() === selectedSemester;
    const matchesSubject = selectedSubject === 'all' || grade.subject === selectedSubject;

    return matchesSearch && matchesSemester && matchesSubject;
  });

  // Сортировка оценок
  const sortedGrades = [...filteredGrades].sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case 'subject':
        aValue = a.subject;
        bValue = b.subject;
        break;
      case 'grade':
        aValue = typeof a.grade === 'number' ? a.grade : (a.grade === 'зачет' ? 3 : 0);
        bValue = typeof b.grade === 'number' ? b.grade : (b.grade === 'зачет' ? 3 : 0);
        break;
      case 'date':
        aValue = a.date;
        bValue = b.date;
        break;
      case 'credits':
        aValue = a.credits;
        bValue = b.credits;
        break;
      default:
        aValue = a.date;
        bValue = b.date;
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Уникальные предметы для фильтра
  const uniqueSubjects = [...new Set(gradesData.map(g => g.subject))];
  const uniqueSemesters = [...new Set(gradesData.map(g => g.semester))].sort();

  // Получение цвета оценки
  const getGradeColor = (grade) => {
    if (typeof grade === 'number') {
      switch (grade) {
        case 5: return '#10b981'; // зеленый
        case 4: return '#3b82f6'; // синий
        case 3: return '#f59e0b'; // желтый
        case 2: return '#ef4444'; // красный
        default: return '#6b7280'; // серый
      }
    }
    return '#10b981'; // зеленый для зачета
  };

  // Получение иконки оценки
  const getGradeIcon = (grade) => {
    if (typeof grade === 'number') {
      switch (grade) {
        case 5: return <Trophy size={16} />;
        case 4: return <Award size={16} />;
        case 3: return <CheckCircle size={16} />;
        case 2: return <XCircle size={16} />;
        default: return <AlertCircle size={16} />;
      }
    }
    return <CheckCircle size={16} />;
  };

  // Статистические карточки
  const statCards = [
    {
      icon: BookOpen,
      label: 'Всего предметов',
      value: stats.totalSubjects,
      color: '#3b82f6',
      trend: '+2',
      description: 'За семестр'
    },
    {
      icon: TrendingUp,
      label: 'Средний балл',
      value: stats.averageGrade,
      color: '#10b981',
      trend: '+0.2',
      description: 'По всем предметам',
      suffix: ''
    },
    {
      icon: Target,
      label: 'Качество знаний',
      value: stats.qualityPercent,
      color: '#f59e0b',
      trend: '+5%',
      description: 'Оценки 4 и 5',
      suffix: '%'
    },
    {
      icon: GraduationCap,
      label: 'Зачетные единицы',
      value: stats.totalCredits,
      color: '#8b5cf6',
      trend: '+12',
      description: 'Всего кредитов'
    }
  ];

  // Форматирование даты
  const formatDate = (date) => {
    return format(date, 'd MMM yyyy', { locale: ru });
  };

  // Экспорт данных
  const exportGrades = () => {
    const csvContent = [
      ['Предмет', 'Тип', 'Оценка', 'Дата', 'Семестр', 'Преподаватель', 'Кредиты'].join(','),
      ...sortedGrades.map(g => [
        g.subject,
        g.type,
        g.grade,
        formatDate(g.date),
        g.semester,
        g.teacher,
        g.credits
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `grades_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };

  return (
    <div className="grades">
      <div className="container">
        {/* Header */}
        <div className="grades-header">
          <div className="header-content">
            <div className="welcome-section">
              <h1>
                <GraduationCap className="header-icon" />
                Академические оценки
              </h1>
              <p className="header-subtitle">
                Результаты обучения • {student.firstName} {student.lastName}, группа {student.group}
              </p>
            </div>
            <div className="semester-info-card">
              <div className="semester-info">
                <h3>Текущий семестр</h3>
                <p>2 семестр • 2024 год</p>
              </div>
                <div className="progress-circle">
                <CircularProgressbar
                  value={stats.qualityPercent}
                  text={`${stats.qualityPercent}%`}
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
          {statCards.map((stat, index) => (
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
                    decimals={stat.suffix === '' && stat.value % 1 !== 0 ? 1 : 0}
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

        {/* Controls */}
        <div className="grades-controls">
          <div className="controls-left">
            <div className="search-container">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Поиск по предметам или преподавателям..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>

            <button
              className={`btn btn-secondary ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={16} />
              Фильтры
            </button>
          </div>

          <div className="controls-right">
            <div className="view-mode-toggle">
              <button
                className={`btn btn-secondary ${viewMode === 'table' ? 'active' : ''}`}
                onClick={() => setViewMode('table')}
              >
                Таблица
              </button>
              <button
                className={`btn btn-secondary ${viewMode === 'cards' ? 'active' : ''}`}
                onClick={() => setViewMode('cards')}
              >
                Карточки
              </button>
            </div>

            <button className="btn btn-primary" onClick={exportGrades}>
              <Download size={16} />
              Экспорт
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="filters-panel">
            <div className="filter-group">
              <label>Семестр:</label>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
              >
                <option value="all">Все семестры</option>
                {uniqueSemesters.map(sem => (
                  <option key={sem} value={sem}>{sem} семестр</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Предмет:</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                <option value="all">Все предметы</option>
                {uniqueSubjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Сортировка:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="date">По дате</option>
                <option value="subject">По предмету</option>
                <option value="grade">По оценке</option>
                <option value="credits">По кредитам</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Порядок:</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="desc">По убыванию</option>
                <option value="asc">По возрастанию</option>
              </select>
            </div>
          </div>
        )}

        {/* Grades Table/Cards */}
        {viewMode === 'table' ? (
          <div className="grades-table-container card">
            <div className="table-header">
              <h3>Список оценок</h3>
              <span className="results-count">Показано: {sortedGrades.length} из {gradesData.length}</span>
            </div>

            <div className="table-wrapper">
              <table className="grades-table">
                <thead>
                  <tr>
                    <th>Предмет</th>
                    <th>Тип</th>
                    <th>Оценка</th>
                    <th>Дата</th>
                    <th>Семестр</th>
                    <th>Преподаватель</th>
                    <th>Кредиты</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedGrades.map(grade => (
                    <tr key={grade.id}>
                      <td>
                        <div className="subject-cell">
                          <div className="subject-name">{grade.subject}</div>
                          <div className="subject-category">{grade.category}</div>
                        </div>
                      </td>
                      <td>
                        <span className={`type-badge ${grade.type.toLowerCase()}`}>
                          {grade.type}
                        </span>
                      </td>
                      <td>
                        <div className="grade-cell">
                          <div
                            className="grade-badge"
                            style={{ backgroundColor: getGradeColor(grade.grade) }}
                          >
                            {getGradeIcon(grade.grade)}
                            {grade.grade}
                          </div>
                          <div className="grade-score">{grade.score}/100</div>
                        </div>
                      </td>
                      <td>{formatDate(grade.date)}</td>
                      <td>{grade.semester}</td>
                      <td>{grade.teacher}</td>
                      <td>{grade.credits}</td>
                      <td>
                        <button
                          className="btn btn-small btn-secondary"
                          onClick={() => setSelectedGrade(grade)}
                        >
                          <Eye size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grades-cards-container">
            <div className="grades-cards-grid">
              {sortedGrades.map(grade => (
                <div key={grade.id} className="grade-card">
                  <div className="card-header">
                    <div className="subject-info">
                      <h4>{grade.subject}</h4>
                      <span className="category-badge">{grade.category}</span>
                    </div>
                    <div
                      className="grade-badge large"
                      style={{ backgroundColor: getGradeColor(grade.grade) }}
                    >
                      {getGradeIcon(grade.grade)}
                      {grade.grade}
                    </div>
                  </div>

                  <div className="card-content">
                    <div className="grade-details">
                      <div className="detail-row">
                        <span className="label">Тип:</span>
                        <span className={`type-badge ${grade.type.toLowerCase()}`}>
                          {grade.type}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Баллы:</span>
                        <span className="value">{grade.score}/100</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Дата:</span>
                        <span className="value">{formatDate(grade.date)}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Семестр:</span>
                        <span className="value">{grade.semester}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Преподаватель:</span>
                        <span className="value">{grade.teacher}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Кредиты:</span>
                        <span className="value">{grade.credits}</span>
                      </div>
                    </div>

                    {grade.description && (
                      <div className="grade-description">
                        <p>{grade.description}</p>
                      </div>
                    )}
                  </div>

                  <div className="card-actions">
                    <button
                      className="btn btn-small btn-primary"
                      onClick={() => setSelectedGrade(grade)}
                    >
                      <Eye size={14} />
                      Подробнее
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Grade Detail Modal */}
        {selectedGrade && (
          <div className="modal-overlay" onClick={() => setSelectedGrade(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{selectedGrade.subject}</h3>
                <button
                  className="modal-close"
                  onClick={() => setSelectedGrade(null)}
                >
                  ×
                </button>
              </div>

              <div className="modal-body">
                <div className="grade-detail-info">
                  <div className="detail-section">
                    <h4>Основная информация</h4>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <span className="label">Оценка:</span>
                        <div
                          className="grade-badge large"
                          style={{ backgroundColor: getGradeColor(selectedGrade.grade) }}
                        >
                          {getGradeIcon(selectedGrade.grade)}
                          {selectedGrade.grade}
                        </div>
                      </div>
                      <div className="detail-item">
                        <span className="label">Баллы:</span>
                        <span className="value">{selectedGrade.score}/100</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Тип контроля:</span>
                        <span className={`type-badge ${selectedGrade.type.toLowerCase()}`}>
                          {selectedGrade.type}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Категория:</span>
                        <span className="value">{selectedGrade.category}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Дата:</span>
                        <span className="value">{formatDate(selectedGrade.date)}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Семестр:</span>
                        <span className="value">{selectedGrade.semester}</span>
                      </div>
                    </div>
                  </div>

                  <div className="detail-section">
                    <h4>Учебная нагрузка</h4>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <span className="label">Кредиты:</span>
                        <span className="value">{selectedGrade.credits}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Часы:</span>
                        <span className="value">{selectedGrade.hours}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Весовой коэффициент:</span>
                        <span className="value">{selectedGrade.weight}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Преподаватель:</span>
                        <span className="value">{selectedGrade.teacher}</span>
                      </div>
                    </div>
                  </div>

                  {selectedGrade.description && (
                    <div className="detail-section">
                      <h4>Описание курса</h4>
                      <p>{selectedGrade.description}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Grades;