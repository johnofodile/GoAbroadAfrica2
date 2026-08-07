import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className='bg-primary text-white mt-16 py-10'>
      <div className='max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8'>
        <div>
          <h3 className='text-secondary text-lg font-bold mb-3'>GoAbroadAfrica</h3>
          <p className='text-gray-300 text-sm'>Helping Africans discover world-class education and life opportunities abroad.</p>
        </div>
        <div>
          <h4 className='font-semibold mb-3'>Explore</h4>
          <ul className='text-gray-300 text-sm space-y-1'>
            <li><Link to='/programs'    className='hover:text-secondary'>Study Programs</Link></li>
            <li><Link to='/experiences' className='hover:text-secondary'>Experiences</Link></li>
          </ul>
        </div>
        <div>
          <h4 className='font-semibold mb-3'>Account</h4>
          <ul className='text-gray-300 text-sm space-y-1'>
            <li><Link to='/login'    className='hover:text-secondary'>Login</Link></li>
            <li><Link to='/register' className='hover:text-secondary'>Register</Link></li>
          </ul>
        </div>
      </div>
      <p className='text-center text-gray-400 text-xs mt-8'>
        &copy; {new Date().getFullYear()} GoAbroadAfrica. All rights reserved.
      </p>
    </footer>
  );
}