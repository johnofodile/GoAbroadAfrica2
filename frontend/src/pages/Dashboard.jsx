import { useAuth } from '../context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { deleteExperience } from '../services/experienceService';


export default function Dashboard() {
  const { user } = useAuth();

  const { data: myExperiences } = useQuery({
    queryKey: ['my-experiences'],
    queryFn: () => api.get('/experiences?mine=true').then(r => r.data.experiences),
  });

    const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteExperience,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-experiences'] }),
  });

  const handleDelete = (id) => {
    if (window.confirm('Delete this experience? This cannot be undone.')) {
      deleteMutation.mutate(id);
    }
  };


  return (
    <div className='page-container'>
      <div className='flex items-center gap-4 mb-8'>
        <img src={user?.avatar || '/default-avatar.png'}
          className='w-16 h-16 rounded-full object-cover border-2 border-primary' alt='' />
        <div>
          <h1 className='text-2xl font-bold text-primary'>Welcome, {user?.name}</h1>
          <p className='text-gray-500'>{user?.email} — {user?.country}</p>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-10'>
        <div className='card p-6 text-center'>
          <p className='text-3xl font-bold text-primary'>{myExperiences?.length || 0}</p>
          <p className='text-gray-500 mt-1'>Experiences Shared</p>
        </div>
        <div className='card p-6 text-center'>
          <p className='text-3xl font-bold text-secondary'>{user?.savedPrograms?.length || 0}</p>
          <p className='text-gray-500 mt-1'>Saved Programs</p>
        </div>
        <div className='card p-6 text-center border-2 border-dashed border-secondary cursor-pointer hover:bg-yellow-50 transition'
          onClick={() => window.location.href='/create-experience'}>
          <p className='text-3xl'>✍️</p>
          <p className='text-secondary font-semibold mt-1'>Share New Experience</p>
        </div>
      </div>

      <h2 className='text-xl font-bold text-primary mb-4'>My Experiences</h2>
      {(!myExperiences || myExperiences.length === 0) ? (
        <div className='card p-10 text-center text-gray-400'>
          <p>You haven't shared any experiences yet.</p>
          <Link to='/create-experience' className='btn-primary mt-4 inline-block'>
            Share Your First Story
          </Link>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {myExperiences.map(exp => (
                       <div key={exp._id} className='card p-4 flex justify-between items-start'>
              <div>
                <p className='font-semibold text-gray-800'>{exp.title}</p>
                <p className='text-xs text-gray-400 mt-1'>{exp.country} • {exp.category?.replace('-',' ')}</p>
              </div>
              <div className='flex items-center gap-2'>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  exp.status === 'approved' ? 'bg-green-100 text-green-600' :
                  exp.status === 'rejected' ? 'bg-red-100 text-red-600' :
                  'bg-yellow-100 text-yellow-600'}`}>
                  {exp.status}
                </span>
                <button onClick={() => handleDelete(exp._id)}
                  className='text-xs text-red-500 hover:text-red-700 hover:underline'>
                  Delete
                </button>
              </div>
            </div>

          ))}
        </div>
      )}
    </div>
  );
}