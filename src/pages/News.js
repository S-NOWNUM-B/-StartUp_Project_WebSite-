import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { 
  Newspaper, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Eye,
  Heart,
  Share2,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Clock,
  Tag,
  TrendingUp,
  AlertCircle,
  Star,
  Bookmark,
  ExternalLink,
  Download,
  Settings,
  RefreshCw,
  Grid,
  List,
  SortDesc,
  Bell,
  Users,
  BookOpen,
  GraduationCap,
  Award,
  Calendar as CalendarIcon,
  Zap
} from 'lucide-react';
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import CountUp from 'react-countup';
import './News.css';

const News = () => {
  const { student } = useData();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('date');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedNews, setSelectedNews] = useState(null);
  const [bookmarkedNews, setBookmarkedNews] = useState([]);
  const [likedNews, setLikedNews] = useState([]);

  const newsPerPage = 6;

  // Данные новостей
  const newsData = [
    {
      id: 1,
      title: 'Новая система электронного обучения запущена',
      summary: 'Университет внедрил современную платформу для дистанционного обучения с интерактивными возможностями',
      content: 'Университет объявил о запуске новой системы электронного обучения, которая предоставит студентам доступ к современным образовательным технологиям. Платформа включает интерактивные лекции, виртуальные лаборатории и систему онлайн-тестирования.',
      category: 'technology',
      author: 'Администрация',
      date: '2025-01-03T10:30:00',
      views: 245,
      likes: 18,
      comments: 12,
      image: null,
      tags: ['обучение', 'технологии', 'дистанционное'],
      priority: 'high',
      featured: true
    },
    {
      id: 2,
      title: 'Студенческий совет объявляет конкурс проектов',
      summary: 'Приглашаем всех студентов принять участие в ежегодном конкурсе инновационных проектов',
      content: 'Студенческий совет объявляет о проведении конкурса инновационных проектов среди студентов всех курсов. Победители получат денежные призы и возможность представить свои проекты на региональной выставке.',
      category: 'student',
      author: 'Студенческий совет',
      date: '2025-01-02T14:20:00',
      views: 189,
      likes: 25,
      comments: 8,
      image: null,
      tags: ['конкурс', 'проекты', 'студенты'],
      priority: 'medium',
      featured: false
    },
    {
      id: 3,
      title: 'Изменения в расписании экзаменов',
      summary: 'Важная информация об изменениях в расписании зимней экзаменационной сессии',
      content: 'В связи с техническими работами в здании корпуса №2, некоторые экзамены перенесены на другие даты. Подробная информация доступна в личном кабинете студента.',
      category: 'academic',
      author: 'Учебный отдел',
      date: '2025-01-01T09:15:00',
      views: 156,
      likes: 8,
      comments: 15,
      image: null,
      tags: ['экзамены', 'расписание', 'важно'],
      priority: 'high',
      featured: true
    },
    {
      id: 4,
      title: 'Новый спортивный комплекс открывается',
      summary: 'Долгожданное открытие современного спортивного комплекса для студентов',
      content: 'Университет торжественно открывает новый спортивный комплекс, оснащенный современным оборудованием. Комплекс включает тренажерный зал, бассейн, спортивные площадки и зоны отдыха.',
      category: 'sports',
      author: 'Спортивный отдел',
      date: '2024-12-30T16:45:00',
      views: 203,
      likes: 31,
      comments: 6,
      image: null,
      tags: ['спорт', 'новости', 'студенты'],
      priority: 'medium',
      featured: false
    },
    {
      id: 5,
      title: 'Международная конференция по ИТ',
      summary: 'Студенты приглашаются на участие в международной конференции по информационным технологиям',
      content: 'Университет организует международную конференцию по информационным технологиям. Студенты могут подать заявки на участие с докладами и постерными презентациями.',
      category: 'events',
      author: 'Деканат ИТ',
      date: '2024-12-28T11:00:00',
      views: 134,
      likes: 12,
      comments: 4,
      image: null,
      tags: ['конференция', 'IT', 'международное'],
      priority: 'low',
      featured: false
    },
    {
      id: 6,
      title: 'Стипендиальная программа для отличников',
      summary: 'Объявлена новая стипендиальная программа для студентов с высокими академическими достижениями',
      content: 'Университет запускает специальную стипендиальную программу для студентов, демонстрирующих выдающиеся академические результаты. Размер стипендии увеличен на 50%.',
      category: 'academic',
      author: 'Финансовый отдел',
      date: '2024-12-25T13:30:00',
      views: 298,
      likes: 42,
      comments: 18,
      image: null,
      tags: ['стипендия', 'академия', 'отличники'],
      priority: 'high',
      featured: true
    },
    {
      id: 7,
      title: 'Карьерная ярмарка 2025',
      summary: 'Приглашаем студентов на ярмарку вакансий ведущих компаний региона',
      content: 'В университете пройдет крупная карьерная ярмарка, где студенты смогут познакомиться с работодателями, узнать о вакансиях и стажировках в ведущих компаниях.',
      category: 'career',
      author: 'Центр карьеры',
      date: '2024-12-23T10:00:00',
      views: 176,
      likes: 22,
      comments: 9,
      image: null,
      tags: ['карьера', 'вакансии', 'студенты'],
      priority: 'medium',
      featured: false
    },
    {
      id: 8,
      title: 'Обновление библиотечного фонда',
      summary: 'Библиотека пополнилась новыми учебными материалами и цифровыми ресурсами',
      content: 'Университетская библиотека объявляет о значительном обновлении фонда. Добавлены новые учебники, научные журналы и доступ к международным базам данных.',
      category: 'library',
      author: 'Библиотека',
      date: '2024-12-20T15:20:00',
      views: 89,
      likes: 7,
      comments: 3,
      image: null,
      tags: ['библиотека', 'книги', 'ресурсы'],
      priority: 'low',
      featured: false
    }
  ];

  // Категории новостей
  const categories = [
    { id: 'all', name: 'Все новости', icon: Newspaper, color: '#6b7280' },
    { id: 'academic', name: 'Академические', icon: BookOpen, color: '#3b82f6' },
    { id: 'student', name: 'Студенческие', icon: Users, color: '#10b981' },
    { id: 'technology', name: 'Технологии', icon: Zap, color: '#8b5cf6' },
    { id: 'sports', name: 'Спорт', icon: Award, color: '#f59e0b' },
    { id: 'events', name: 'Мероприятия', icon: CalendarIcon, color: '#ef4444' },
    { id: 'career', name: 'Карьера', icon: TrendingUp, color: '#06b6d4' },
    { id: 'library', name: 'Библиотека', icon: BookOpen, color: '#84cc16' }
  ];

  // Статистика новостей
  const getNewsStats = () => {
    const totalNews = newsData.length;
    const featuredNews = newsData.filter(news => news.featured).length;
    const todayNews = newsData.filter(news => isToday(parseISO(news.date))).length;
    const totalViews = newsData.reduce((sum, news) => sum + news.views, 0);
    const avgViews = Math.round(totalViews / totalNews);
    
    return {
      totalNews,
      featuredNews,
      todayNews,
      avgViews
    };
  };

  const newsStats = getNewsStats();

  // Статистические карточки
  const stats = [
    {
      icon: Newspaper,
      label: 'Всего новостей',
      value: newsStats.totalNews,
      color: '#3b82f6',
      trend: '+2',
      description: 'За последнюю неделю'
    },
    {
      icon: Star,
      label: 'Рекомендуемых',
      value: newsStats.featuredNews,
      color: '#10b981',
      trend: '+1',
      description: 'Важных новостей'
    },
    {
      icon: Clock,
      label: 'Сегодня',
      value: newsStats.todayNews,
      color: '#f59e0b',
      trend: 'новых',
      description: 'Публикаций за день'
    },
    {
      icon: Eye,
      label: 'Среднее просмотров',
      value: newsStats.avgViews,
      color: '#8b5cf6',
      trend: '+15%',
      description: 'Рост популярности'
    }
  ];

  // Фильтрация новостей
  const filteredNews = newsData.filter(news => {
    const matchesSearch = news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         news.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         news.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || news.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Сортировка новостей
  const sortedNews = [...filteredNews].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.date) - new Date(a.date);
      case 'views':
        return b.views - a.views;
      case 'likes':
        return b.likes - a.likes;
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  // Пагинация
  const totalPages = Math.ceil(sortedNews.length / newsPerPage);
  const startIndex = (currentPage - 1) * newsPerPage;
  const endIndex = startIndex + newsPerPage;
  const currentNews = sortedNews.slice(startIndex, endIndex);

  // Прогресс чтения новостей
  const readingProgress = {
    current: 5,
    total: 8,
    percentage: Math.round((5 / 8) * 100)
  };

  // Функции для взаимодействия с новостями
  const handleLike = (newsId) => {
    setLikedNews(prev => 
      prev.includes(newsId) 
        ? prev.filter(id => id !== newsId)
        : [...prev, newsId]
    );
  };

  const handleBookmark = (newsId) => {
    setBookmarkedNews(prev => 
      prev.includes(newsId) 
        ? prev.filter(id => id !== newsId)
        : [...prev, newsId]
    );
  };

  const formatDate = (dateString) => {
    const date = parseISO(dateString);
    if (isToday(date)) {
      return `Сегодня в ${format(date, 'HH:mm')}`;
    } else if (isYesterday(date)) {
      return `Вчера в ${format(date, 'HH:mm')}`;
    } else {
      return format(date, 'd MMMM yyyy, HH:mm', { locale: ru });
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

  const getCategoryInfo = (categoryId) => {
    return categories.find(cat => cat.id === categoryId) || categories[0];
  };

  return (
    <div className="news">
      <div className="container">
        {/* Header */}
        <div className="news-header">
          <div className="header-content">
            <div className="welcome-section">
              <h1>
                <Newspaper className="header-icon" />
                Новости университета
              </h1>
              <p className="header-subtitle">
                Актуальные события и объявления • Группа {student.group}, {student.course} курс
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
        <div className="news-controls">
          <div className="search-section">
            <div className="search-input-wrapper">
              <Search size={20} />
              <input
                type="text"
                placeholder="Поиск новостей..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
          
          <div className="control-actions">
            <div className="sort-dropdown">
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="date">По дате</option>
                <option value="views">По просмотрам</option>
                <option value="likes">По лайкам</option>
                <option value="title">По названию</option>
              </select>
            </div>
            
            <div className="view-mode-toggle">
              <button 
                className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setViewMode('grid')}
              >
                <Grid size={16} />
              </button>
              <button 
                className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setViewMode('list')}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* News Grid/List */}
        <div className={`news-content ${viewMode}`}>
          {currentNews.map((news) => {
            const categoryInfo = getCategoryInfo(news.category);
            const isLiked = likedNews.includes(news.id);
            const isBookmarked = bookmarkedNews.includes(news.id);
            
            return (
              <div key={news.id} className="news-card">
                <div className="news-card-header">
                  <div className="news-image">
                    {news.image ? (
                      <img src={news.image} alt={news.title} />
                    ) : (
                      <div 
                        className="news-image-placeholder"
                        style={{ 
                          background: `linear-gradient(135deg, ${categoryInfo.color}15, ${categoryInfo.color}30)`
                        }}
                      >
                        <categoryInfo.icon size={48} style={{ color: categoryInfo.color }} />
                      </div>
                    )}
                    {news.featured && (
                      <div className="featured-badge">
                        <Star size={14} />
                      </div>
                    )}
                    <div 
                      className="priority-indicator"
                      style={{ backgroundColor: getPriorityColor(news.priority) }}
                    ></div>
                  </div>
                </div>
                
                <div className="news-card-content">
                  <div className="news-meta">
                    <div className="news-category" style={{ backgroundColor: categoryInfo.color }}>
                      <categoryInfo.icon size={12} />
                      {categoryInfo.name}
                    </div>
                    <span className="news-date">{formatDate(news.date)}</span>
                  </div>
                  
                  <h3 className="news-title">{news.title}</h3>
                  <p className="news-summary">{news.summary}</p>
                  
                  <div className="news-tags">
                    {news.tags.map((tag, index) => (
                      <span key={index} className="news-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="news-stats">
                    <div className="stat-item">
                      <Eye size={14} />
                      <span>{news.views}</span>
                    </div>
                    <div className="stat-item">
                      <MessageSquare size={14} />
                      <span>{news.comments}</span>
                    </div>
                    <div className="stat-item">
                      <Heart size={14} />
                      <span>{news.likes}</span>
                    </div>
                  </div>
                  
                  <div className="news-actions">
                    <button 
                      className={`action-btn ${isLiked ? 'active' : ''}`}
                      onClick={() => handleLike(news.id)}
                    >
                      <Heart size={16} />
                    </button>
                    <button 
                      className={`action-btn ${isBookmarked ? 'active' : ''}`}
                      onClick={() => handleBookmark(news.id)}
                    >
                      <Bookmark size={16} />
                    </button>
                    <button className="action-btn">
                      <Share2 size={16} />
                    </button>
                    <button className="action-btn">
                      <ExternalLink size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

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

export default News;