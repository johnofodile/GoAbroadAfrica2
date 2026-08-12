import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as loginApi } from '../services/authService';

export default function Login() {
  const [form, setForm]       = useState({ email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const { login }             = useAuth();
  const navigate              = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await loginApi(form);
      login(res.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-neutral px-4'>
      <div className='card w-full max-w-md p-8'>
        <h1 className='text-2xl font-bold text-primary mb-6 text-center'>Welcome Back</h1>

        {error && <div className='bg-red-50 text-red-600 p-3 rounded mb-4 text-sm'>{error}</div>}

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='label'>Email</label>
            <input name='email' type='email' required className='input'
              value={form.email} onChange={handleChange} placeholder='your@email.com' />
          </div>
          <div>
            <label className='label'>Password</label>
            <input name='password' type='password' required className='input'
              value={form.password} onChange={handleChange} placeholder='Your password' />
          </div>
          <div className='text-right'>
  <Link to='/forgot-password' className='text-sm text-primary hover:underline'>Forgot password?</Link>
</div>

          <button type='submit' disabled={loading} className='btn-primary w-full py-2 text-center'>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className='text-center text-sm text-gray-500 mt-6'>
          No account? <Link to='/register' className='text-primary font-medium hover:underline'>Register here</Link>
        </p>
      </div>
    </div>
  );
}