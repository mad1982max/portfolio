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
        <div className="min-h-screen flex flex-col bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
          <Header />
          <main className="flex-1 w-full max-w-5xl mx-auto px-4 md:px-8 py-8">
            <Routes>
              <Route path={ROUTES.HOME} element={<HomePage />} />
              <Route path={ROUTES.ABOUT} element={<AboutPage />} />
              <Route path={ROUTES.ADMIN} element={<MeAboutPage />} />
              <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}
