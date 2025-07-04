import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  Newspaper, 
  Bell, 
  MessageSquare, 
  Menu, 
  X,
  GraduationCap,
  User,
  BookOpen
} from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Главная' },
    { path: '/schedule', icon: Calendar, label: 'Расписание' },
    { path: '/grades', icon: BookOpen, label: 'Оценки' },
    { path: '/news', icon: Newspaper, label: 'Новости' },
    { path: '/notifications', icon: Bell, label: 'Уведомления' },
    { path: '/profile', icon: User, label: 'Профиль' },
    { path: '/feedback', icon: MessageSquare, label: 'Обратная связь' }
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Закрываем меню при изменении маршрута
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Закрываем меню при клике вне его на мобильных устройствах
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (isMenuOpen && !event.target.closest('.navbar') && !event.target.closest('.mobile-menu-btn')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [isMenuOpen]);

  return (
    <>
      <button 
        className="mobile-menu-btn" 
        onClick={toggleMenu}
        aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
      >
        {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      
      <nav className={`navbar ${isMenuOpen ? 'open' : ''}`}>
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            <div className="brand-content">
              <GraduationCap className="brand-icon" size={24} />
              <span className="brand-text">UniPortal</span>
              <span className="brand-subtitle">Студенческий портал</span>
            </div>
          </Link>

          <div className="navbar-menu">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className={`nav-link ${location.pathname === path ? 'active' : ''}`}
              >
                <div className="nav-link-content">
                  <Icon size={20} />
                  <span>{label}</span>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="navbar-footer">
            <div className="navbar-version">
              Версия 2.0
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar; 