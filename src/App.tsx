import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import HomePage from './pages/HomePage/HomePage';
import AboutPage from './pages/AboutPage/AboutPage';
import MeAboutPage from './pages/Admin/Admin';
import { ROUTES } from './routes';
import { ThemeProvider } from './context/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
          <Header />
          <Routes>
            <Route path={ROUTES.HOME} element={<HomePage />} />
            <Route path={ROUTES.ABOUT} element={<AboutPage />} />
            <Route path={ROUTES.ADMIN} element={<MeAboutPage />} />
            <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}
