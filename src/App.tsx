import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import MeAboutPage from './pages/MeAboutPage';
import { ROUTES } from './routes';

export default function App() {
    return (
        <HashRouter>
            <Header />
            <Routes>
                <Route path={ROUTES.HOME} element={<HomePage />} />
                <Route path={ROUTES.ABOUT} element={<AboutPage />} />
                <Route path={ROUTES.ME_ABOUT} element={<MeAboutPage />} />
                <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
            </Routes>
            <Footer />
        </HashRouter>
    );
}
