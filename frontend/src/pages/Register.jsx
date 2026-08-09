import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { register as registerApi } from '../services/authService';

const COUNTRIES = ['Nigeria','Ghana','Kenya','South Africa','Ethiopia','Tanzania','Egypt','Morocco','Uganda','Cameroon','Other'];

export default function Register() {
  const [form, setForm]       = useState({ name:'', email:'', password:'', country:'Nigeria' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const { login }             = useAuth();
  const navigate              = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setError('');
    setLoading(true);
    try {
      const res = await registerApi(form);
      login(res.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-neutral px-4 py-12'>
      <div className='card w-full max-w-md p-8'>
        <h1 className='text-2xl font-bold text-primary mb-6 text-center'>Create Account</h1>
        {error && <div className='bg-red-50 text-red-600 p-3 rounded mb-4 text-sm'>{error}</div>}
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='label'>Full Name</label>
            <input name='name' required className='input' value={form.name}
              onChange={handleChange} placeholder='John Odile' />
          </div>
          <div>
            <label className='label'>Email</label>
            <input name='email' type='email' required className='input'
              value={form.email} onChange={handleChange} placeholder='john@email.com' />
          </div>
          <div>
            <label className='label'>Country of Origin</label>
            <select name='country' className='input' value={form.country} onChange={handleChange}>
              {COUNTRIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className='label'>Password</label>
            <input name='password' type='password' required className='input'
              value={form.password} onChange={handleChange} placeholder='Min 6 characters' />
          </div>
          <button type='submit' disabled={loading} className='btn-primary w-full py-2'>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p className='text-center text-sm text-gray-500 mt-6'>
          Already have an account? <Link to='/login' className='text-primary font-medium hover:underline'>Login</Link>
        </p>
      </div>
    </div>
  );
}