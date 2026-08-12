import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { resetPassword } from '../services/authService';

export default function ResetPassword() {
  const { token }               = useParams();
  const navigate                 = useNavigate();
  const [password, setPassword]  = useState('');
  const [error, setError]        = useState('');
  const [loading, setLoading]    = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await resetPassword(token, { password });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-neutral px-4'>
      <div className='card w-full max-w-md p-8'>
        <h1 className='text-2xl font-bold text-primary mb-6 text-center'>Reset Password</h1>

        {error && <div className='bg-red-50 text-red-600 p-3 rounded mb-4 text-sm'>{error}</div>}

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='label'>New Password</label>
            <input name='password' type='password' required minLength={6} className='input'
              value={password} onChange={e => setPassword(e.target.value)} placeholder='New password' />
          </div>
          <button type='submit' disabled={loading} className='btn-primary w-full py-2 text-center'>
            {loading ? 'Resetting...' : 'Reset password'}
          </button>
        </form>

        <p className='text-center text-sm text-gray-500 mt-6'>
          <Link to='/login' className='text-primary font-medium hover:underline'>Back to login</Link>
        </p>
      </div>
    </div>
  );
}
