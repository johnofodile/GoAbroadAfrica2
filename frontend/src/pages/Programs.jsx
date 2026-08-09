import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { getPrograms, getCountries } from '../services/programService';

const LEVELS = ['all','bachelor','master','phd','diploma'];

export default function Programs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const country = searchParams.get('country') || 'all';
  const level   = searchParams.get('level')   || 'all';
  const [page, setPage] = useState(1);

  const { data: countryData } = useQuery({
    queryKey: ['countries'],
    queryFn: () => getCountries().then(r => r.data.countries),
  });

  const { data, isLoading } = useQuery({
    queryKey: ['programs', country, level, page],
    queryFn: () => getPrograms({
      country: country !== 'all' ? country : undefined,
      level:   level   !== 'all' ? level   : undefined,
      page,
    }).then(r => r.data),
  });

  const updateFilter = (key, val) => {
    setSearchParams(p => { p.set(key, val); return p; });
    setPage(1);
  };

  return (
    <div className='page-container'>
      <h1 className='section-title'>Study Abroad Programs</h1>
      <p className='text-gray-500 mb-8'>Discover universities and programs in top countries</p>

      {/* Filters */}
      <div className='flex flex-wrap gap-3 mb-8'>
        <select className='input w-auto' value={country} onChange={e => updateFilter('country', e.target.value)}>
          <option value='all'>All Countries</option>
          {countryData?.map(c => <option key={c}>{c}</option>)}
        </select>
        <select className='input w-auto' value={level} onChange={e => updateFilter('level', e.target.value)}>
          {LEVELS.map(l => <option key={l} value={l}>{l === 'all' ? 'All Levels' : l}</option>)}
        </select>
      </div>

      {isLoading && <div className='text-center py-20 text-gray-400'>Loading programs...</div>}

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {data?.programs.map(prog => (
          <Link key={prog._id} to={`/programs/${prog._id}`}
            className='card hover:shadow-lg transition-shadow p-5'>
            <div className='flex items-center gap-3 mb-3'>
              {prog.logo && <img src={prog.logo} className='w-12 h-12 object-contain' alt='' />}
              <div>
                <p className='font-bold text-primary text-sm line-clamp-1'>{prog.university}</p>
                <p className='text-xs text-gray-400'>{prog.country}</p>
              </div>
            </div>
            <h2 className='font-semibold text-gray-800 mb-2 line-clamp-2'>{prog.programName}</h2>
            <div className='flex flex-wrap gap-2 text-xs'>
              <span className='bg-blue-50 text-blue-600 px-2 py-1 rounded'>{prog.level}</span>
              <span className='bg-green-50 text-green-600 px-2 py-1 rounded'>{prog.language}</span>
              {prog.tuitionFee > 0 && <span className='bg-yellow-50 text-yellow-700 px-2 py-1 rounded'>${prog.tuitionFee?.toLocaleString()}/yr</span>}
              {prog.scholarships && <span className='bg-purple-50 text-purple-600 px-2 py-1 rounded'>Scholarships</span>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}