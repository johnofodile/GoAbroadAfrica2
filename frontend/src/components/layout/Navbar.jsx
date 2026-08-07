import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className='bg-primary text-white shadow-lg sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto px-4 flex items-center justify-between h-16'>

        {/* Logo */}
        <Link to='/' className='text-xl font-bold text-secondary'>
          GoAbroadAfrica
        </Link>

        {/* Navigation links */}
        <div className='hidden md:flex gap-6 text-sm font-medium'>
          <NavLink to='/programs'    className={({isActive}) => isActive ? 'text-secondary' : 'hover:text-secondary transition'}>Programs</NavLink>
          <NavLink to='/experiences' className={({isActive}) => isActive ? 'text-secondary' : 'hover:text-secondary transition'}>Experiences</NavLink>
        </div>

        {/* Auth buttons */}
        <div className='flex gap-3 items-center text-sm'>
          {isLoggedIn ? (
            <>
              <span className='text-gray-300'>Hi, {user?.name}</span>
              <Link to='/dashboard' className='hover:text-secondary transition'>Dashboard</Link>
              {user?.role === 'admin' && (
                <Link to='/admin' className='hover:text-secondary transition'>Admin</Link>
              )}
              <button onClick={handleLogout} className='bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition'>Logout</button>
            </>
          ) : (
            <>
              <Link to='/login'    className='hover:text-secondary transition'>Login</Link>
              <Link to='/register' className='btn-secondary text-sm px-3 py-1 rounded'>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}