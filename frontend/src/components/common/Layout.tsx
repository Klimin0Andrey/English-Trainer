import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { PageTransition } from './PageTransition';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="bg-primary text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold">
              📚 English Trainer
            </Link>
            <nav className="flex items-center gap-6">
              <Link to="/" className="hover:text-gray-200 transition">Главная</Link>
              <Link to="/words" className="hover:text-gray-200 transition">Словарь</Link>
              <Link to="/study" className="hover:text-gray-200 transition">Карточки</Link>
              <Link to="/quiz" className="hover:text-gray-200 transition">🎯 Викторина</Link>
              <Link to="/import" className="hover:text-gray-200 transition">📝 Импорт</Link>
              <Link to="/add" className="hover:text-gray-200 transition">+ Добавить</Link>
              <ThemeToggle />
              {user && (
                <>
                  <span className="text-sm text-gray-200">
                    {user.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-sm hover:text-gray-200 transition"
                  >
                    Выйти
                  </button>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <PageTransition key={location.pathname}>
          {children}
        </PageTransition>
      </main>

      <footer className="bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 py-4 transition-colors">
        <div className="container mx-auto px-4 text-center text-sm">
          English Trainer © 2026
        </div>
      </footer>
    </div>
  );
};