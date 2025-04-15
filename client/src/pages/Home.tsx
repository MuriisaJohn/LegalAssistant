import React from 'react';
import MainLayout from '../features/layout/MainLayout';

const Home: React.FC = () => {
  return (
    <MainLayout>
      {/* Add Home page content here */}
      <div className="p-4">
        <h1 className="text-2xl font-bold">Welcome to the Legal Assistant</h1>
        <p>Navigate using the sidebar to access features.</p>
      </div>
    </MainLayout>
  );
};

export default Home;