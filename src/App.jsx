import { Routes, Route, BrowserRouter } from 'react-router';

import { LanguageProvider } from './context/LanguageContext';
import { UIProvider } from './context/UIContext';
import { AuthProvider } from './context/AuthContext';

import Home from './pages/Home';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import About from './pages/About';

// Import Global CSS - these will be bundled by Webpack
import './styles/global/reset.css';
import './styles/global/base.css';
import CreateAppointmentForm from './pages/CreateAppointmentForm';

const App = () => {
  return (
    <>
      <UIProvider>
        <LanguageProvider>
          <AuthProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path='/appointment' element={<CreateAppointmentForm isActive={true} />} />
                <Route path="/about" element={<About />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </LanguageProvider>
      </UIProvider>
    </>
  );
};

export default App;
