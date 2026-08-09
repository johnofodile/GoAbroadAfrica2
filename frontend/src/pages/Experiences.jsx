import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { getExperiences } from '../services/experienceService';

const CATEGORIES = ['all','student-life','cost-of-living','work','housing','culture','visa'];
const COUNTRIES  = ['all','Sweden','UK','Canada','Germany','Netherlands','Australia','Norway'];

export default function Experiences() {
  const [searchParams, setSearchParams] = useSearchParams();
  const country  = searchParams.get('country')  || 'all';
  const category = searchParams.get('category') || 'all';
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['experiences', country, category, page],
    queryFn: () => getExperiences({
      country:  country  !== 'all' ? country  : undefined,
      category: category !== 'all' ? category : undefined,
      page,
    }).then(r => r.data),
  });

  const updateFilter = (key, val) => {
    setSearchParams(p => { p.set(key, val); return p; });
    setPage(1);
  };

  return (
    <div className='page-container'>
      <h1 className='section-title'>Life Abroad Experiences</h1>
      <p className='text-gray-500 mb-8'>Real stories from Africans living and studying abroad</p>

      {/* Filters */}
      <div className='flex flex-wrap gap-3 mb-8'>
        <select className='input w-auto' value={country} onChange={e => updateFilter('country', e.target.value)}>
          {COUNTRIES.map(c => <option key={c} value={c}>{c === 'all' ? 'All Countries' : c}</option>)}
        </select>
        <select className='input w-auto' value={category} onChange={e => updateFilter('category', e.target.value)}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c === 'all' ? 'All Topics' : c.replace('-',' ')}</option>)}
        </select>
        <Link to='/create-experience' className='btn-primary px-4 py-2 ml-auto'>+ Share Experience</Link>
      </div>

      {isLoading && <div className='text-center py-20 text-gray-400'>Loading...</div>}
      {isError   && <div className='text-center py-20 text-red-400'>Failed to load. Try again.</div>}

      {/* Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {data?.experiences.map(exp => (
          <Link key={exp._id} to={`/experiences/${exp._id}`} className='card hover:shadow-lg transition-shadow'>
            {exp.images?.[0] && (
              <img src={exp.images[0]} alt={exp.title} className='w-full h-48 object-cover' />
            )}
            <div className='p-4'>
              <span className='text-xs bg-primary/10 text-primary px-2 py-1 rounded-full'>
                {exp.country} • {exp.category?.replace('-',' ')}
              </span>
              <h2 className='font-bold text-gray-800 mt-2 mb-1 line-clamp-2'>{exp.title}</h2>
              <p className='text-gray-500 text-sm line-clamp-2'>{exp.content}</p>
              <div className='flex items-center gap-2 mt-3 text-xs text-gray-400'>
                <img src={exp.userId?.avatar || '/default-avatar.png'} className='w-6 h-6 rounded-full object-cover' alt='' />
                <span>{exp.userId?.name}</span>
                <span className='ml-auto'>❤ {exp.likes?.length || 0}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {data && data.pages > 1 && (
        <div className='flex justify-center gap-2 mt-10'>
          {Array.from({ length: data.pages }, (_, i) => i+1).map(n => (
            <button key={n} onClick={() => setPage(n)}
              className={`px-3 py-1 rounded ${n === page ? 'bg-primary text-white' : 'bg-white border border-gray-300 hover:bg-gray-50'}`}>
              {n}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}