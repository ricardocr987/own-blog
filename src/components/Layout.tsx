import React from 'react';
import Header from './Header';

const Layout = ({ children }: { children: React.ReactNode }) => (  
  <>
    <Header />
    <div className='flex-grow'>
      {children}
    </div>
  </>
);

export default Layout;
