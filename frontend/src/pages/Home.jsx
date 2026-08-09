import { Link } from 'react-router-dom';

export default function Home() {
  const countries = ['Sweden','UK','Canada','Germany','Netherlands','Australia'];
  const categories = [
    { label: 'Student Life',   emoji: '🎓', value: 'student-life' },
    { label: 'Cost of Living', emoji: '💰', value: 'cost-of-living' },
    { label: 'Work & Career',  emoji: '💼', value: 'work' },
    { label: 'Housing',        emoji: '🏠', value: 'housing' },
    { label: 'Culture & Food', emoji: '🌍', value: 'culture' },
    { label: 'Visa & Travel',  emoji: '✈️',  value: 'visa' },
  ];

  return (
    <div>
      {/* Hero */}
      <section className='bg-primary text-white py-24 px-4 text-center'>
        <h1 className='text-4xl md:text-6xl font-bold mb-4'>
          Your Journey Abroad <span className='text-secondary'>Starts Here</span>
        </h1>
        <p className='text-xl text-gray-200 max-w-2xl mx-auto mb-8'>
          Real stories, study programs, and expert guidance for Africans ready to go global.
        </p>
        <div className='flex gap-4 justify-center flex-wrap'>
          <Link to='/programs' className='btn-secondary text-lg px-8 py-3 rounded-lg'>Explore Programs</Link>
          <Link to='/experiences' className='border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-primary transition text-lg'>Read Experiences</Link>
        </div>
      </section>

      {/* Countries */}
      <section className='page-container'>
        <h2 className='section-title text-center'>Popular Destinations</h2>
        <p className='text-center text-gray-500 mb-10'>Browse programs in these countries</p>
        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4'>
          {countries.map(c => (
            <Link key={c} to={`/programs?country=${c}`}
              className='card p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer'>
              <p className='font-semibold text-primary'>{c}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className='bg-gray-50 py-16'>
        <div className='page-container'>
          <h2 className='section-title text-center'>Life Abroad Topics</h2>
          <p className='text-center text-gray-500 mb-10'>Read real experiences about every aspect of living abroad</p>
          <div className='grid grid-cols-2 md:grid-cols-3 gap-6'>
            {categories.map(cat => (
              <Link key={cat.value} to={`/experiences?category=${cat.value}`}
                className='card p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1'>
                <p className='text-4xl mb-3'>{cat.emoji}</p>
                <p className='font-semibold text-primary'>{cat.label}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className='bg-secondary text-white py-16 text-center'>
        <h2 className='text-3xl font-bold mb-4'>Have you lived or studied abroad?</h2>
        <p className='text-xl mb-8'>Share your experience and help thousands of Africans make better decisions.</p>
        <Link to='/register' className='bg-white text-secondary px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition text-lg'>
          Share Your Story
        </Link>
      </section>
    </div>
  );
}