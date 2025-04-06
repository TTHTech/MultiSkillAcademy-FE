const Header = ({ title }) => {
  return (
    <header className='bg-gradient-to-r from-slate-900/90 to-slate-800/90 backdrop-blur-md shadow-md border-b border-slate-700/40'>
      <div className='max-w-7xl mx-auto py-5 px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center'>
          <div className='w-1.5 h-8 bg-blue-500 rounded-r mr-3'></div>
          <h1 className='text-xl font-semibold text-white tracking-tight'>{title}</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;