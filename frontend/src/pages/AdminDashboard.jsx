import { useState, useEffect } from 'react';
import { getExperiences, updateExperienceStatus } from '../services/adminService';

export default function AdminDashboard() {
  const [experiences, setExperiences] = useState([]);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchExperiences = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getExperiences({ status: statusFilter });
      setExperiences(res.data.experiences);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load experiences');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, [statusFilter]);

  const handleStatusChange = async (id, status) => {
    try {
      await updateExperienceStatus(id, status);
      setExperiences(prev => prev.filter(exp => exp._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    }
  };

  return (
    <div className='page-container'>
      <h1 className='section-title'>Admin Dashboard</h1>
      <p className='text-gray-500 mb-6'>Moderate shared experiences</p>

      <div className='flex gap-2 mb-6'>
        {['pending', 'approved', 'rejected'].map(status => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium capitalize ${
              statusFilter === status ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {error && <div className='bg-red-50 text-red-600 p-3 rounded mb-4 text-sm'>{error}</div>}

      {loading ? (
        <p>Loading...</p>
      ) : experiences.length === 0 ? (
        <p className='text-gray-500'>No {statusFilter} experiences.</p>
      ) : (
        <div className='space-y-4'>
          {experiences.map(exp => (
            <div key={exp._id} className='card p-6'>
              <div className='flex justify-between items-start mb-2'>
                <h2 className='text-lg font-bold text-primary'>{exp.title}</h2>
                <span className='text-sm text-gray-500'>{exp.country} · {exp.category}</span>
              </div>
              <p className='text-sm text-gray-500 mb-3'>
                By {exp.userId?.name} ({exp.userId?.email})
              </p>
              <p className='text-gray-700 mb-4'>{exp.content.slice(0, 200)}...</p>

              {statusFilter === 'pending' && (
                <div className='flex gap-3'>
                  <button onClick={() => handleStatusChange(exp._id, 'approved')} className='btn-primary'>
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusChange(exp._id, 'rejected')}
                    className='bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-medium'
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
