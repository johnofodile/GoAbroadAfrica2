import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../services/authService';

export default function ForgotPassword() {
  const [email, setEmail]     = useState('');
  const [message, setMessage] = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const res = await forgotPassword({ email });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-neutral px-4'>
      <div className='card w-full max-w-md p-8'>
        <h1 className='text-2xl font-bold text-primary mb-6 text-center'>Forgot Password</h1>

        {error && <div className='bg-red-50 text-red-600 p-3 rounded mb-4 text-sm'>{error}</div>}
        {message && <div className='bg-green-50 text-green-700 p-3 rounded mb-4 text-sm'>{message}</div>}

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='label'>Email</label>
            <input name='email' type='email' required className='input'
              value={email} onChange={e => setEmail(e.target.value)} placeholder='your@email.com' />
          </div>
          <button type='submit' disabled={loading} className='btn-primary w-full py-2 text-center'>
            {loading ? 'Sending...' : 'Send reset link'}
          </button>
        </form>

        <p className='text-center text-sm text-gray-500 mt-6'>
          <Link to='/login' className='text-primary font-medium hover:underline'>Back to login</Link>
        </p>
      </div>
    </div>
  );
}
