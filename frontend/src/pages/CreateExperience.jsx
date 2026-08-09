import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createExperience } from '../services/experienceService';

const CATEGORIES = ['student-life','cost-of-living','work','housing','culture','visa','general'];
const COUNTRIES  = ['Sweden','UK','Canada','Germany','Netherlands','Australia','Norway','USA','France','Denmark'];

export default function CreateExperience() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', country: 'Sweden', city: '', category: 'student-life', content: '', tags: '',
  });
  const [images,  setImages]  = useState([]);
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.content.length < 50) { setError('Please write at least 50 characters'); return; }
    setError('');
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v]) => fd.append(k, v));
      images.forEach(img => fd.append('images', img));
      await createExperience(fd);
      navigate('/experiences');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='page-container max-w-3xl mx-auto'>
      <h1 className='section-title'>Share Your Experience</h1>
      <p className='text-gray-500 mb-8'>Help thousands of Africans by sharing your real story</p>

      {error && <div className='bg-red-50 text-red-600 p-3 rounded mb-4'>{error}</div>}

      <form onSubmit={handleSubmit} className='card p-6 space-y-5'>
        <div>
          <label className='label'>Title *</label>
          <input name='title' required className='input' value={form.title}
            onChange={handleChange} placeholder='e.g. My first year studying in Sweden' />
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='label'>Country *</label>
            <select name='country' className='input' value={form.country} onChange={handleChange}>
              {COUNTRIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className='label'>City</label>
            <input name='city' className='input' value={form.city}
              onChange={handleChange} placeholder='e.g. Stockholm' />
          </div>
        </div>

        <div>
          <label className='label'>Category *</label>
          <select name='category' className='input' value={form.category} onChange={handleChange}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c.replace('-',' ')}</option>)}
          </select>
        </div>

        <div>
          <label className='label'>Your Story * (min 50 characters)</label>
          <textarea name='content' required rows={10} className='input resize-y'
            value={form.content} onChange={handleChange}
            placeholder='Write your full experience here...' />
          <p className='text-xs text-gray-400 mt-1'>{form.content.length} characters</p>
        </div>

        <div>
          <label className='label'>Tags (comma separated)</label>
          <input name='tags' className='input' value={form.tags}
            onChange={handleChange} placeholder='e.g. scholarship, visa, housing' />
        </div>

        <div>
          <label className='label'>Photos (up to 5)</label>
          <input type='file' accept='image/*' multiple
            onChange={e => setImages(Array.from(e.target.files).slice(0,5))}
            className='input' />
          {images.length > 0 && <p className='text-xs text-green-600 mt-1'>{images.length} image(s) selected</p>}
        </div>

        <div className='bg-yellow-50 p-3 rounded text-sm text-yellow-700'>
          Your story will be reviewed by our team before being published.
        </div>

        <button type='submit' disabled={loading} className='btn-primary w-full py-3 text-base'>
          {loading ? 'Submitting...' : 'Submit Experience'}
        </button>
      </form>
    </div>
  );
}