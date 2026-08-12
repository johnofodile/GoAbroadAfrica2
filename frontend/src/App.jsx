import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider }    from './context/AuthContext';
import ProtectedRoute      from './components/common/ProtectedRoute';
import Navbar              from './components/layout/Navbar';
import Footer              from './components/layout/Footer';
import Home                from './pages/Home';
import Programs            from './pages/Programs';
import ProgramDetail       from './pages/ProgramDetail';
import Experiences         from './pages/Experiences';
import ExperienceDetail    from './pages/ExperienceDetail';
import CreateExperience    from './pages/CreateExperience';
import Login               from './pages/Login';
import Register            from './pages/Register';
import Dashboard           from './pages/Dashboard';
import AdminDashboard      from './pages/AdminDashboard';
import ForgotPassword      from './pages/ForgotPassword';
import ResetPassword       from './pages/ResetPassword';


export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className='min-h-screen flex flex-col'>
          <Navbar />
          <main className='flex-1'>
            <Routes>
              {/* Public routes */}
              <Route path='/'               element={<Home />} />
              <Route path='/programs'        element={<Programs />} />
              <Route path='/programs/:id'    element={<ProgramDetail />} />
              <Route path='/experiences'     element={<Experiences />} />
              <Route path='/experiences/:id' element={<ExperienceDetail />} />
              <Route path='/login'           element={<Login />} />
              <Route path='/register'        element={<Register />} />
              <Route path='/forgot-password'       element={<ForgotPassword />} />
              <Route path='/reset-password/:token' element={<ResetPassword />} />


              {/* Protected — must be logged in */}
              <Route element={<ProtectedRoute />}>
                <Route path='/dashboard'         element={<Dashboard />} />
                <Route path='/create-experience' element={<CreateExperience />} />
              </Route>

              {/* Admin only */}
              <Route element={<ProtectedRoute requiredRole='admin' />}>
                <Route path='/admin' element={<AdminDashboard />} />
              </Route>
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}