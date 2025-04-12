
import React, { ReactNode } from 'react';
import Navbar from './Navbar';
import JarvisEffect from './JarvisEffect';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <JarvisEffect />
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default Layout;
