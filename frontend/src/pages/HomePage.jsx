import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Welcome to Task Manager</h1>
        <p className="text-xl mb-8">Organize, track, and accomplish your tasks with ease</p>
        <div className="flex justify-center gap-4">
          <Link to="/auth/login" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
            Login
          </Link>
          <Link to="/auth/register" className="bg-gray-200 px-6 py-2 rounded-md hover:bg-gray-300">
            Register
          </Link>
        </div>
      </section>
      
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="border rounded-lg p-6 text-center">
          <h2 className="text-2xl font-semibold mb-4">Task Organization</h2>
          <p>Easily organize your tasks into categories and set priorities</p>
        </div>
        <div className="border rounded-lg p-6 text-center">
          <h2 className="text-2xl font-semibold mb-4">Progress Tracking</h2>
          <p>Monitor your progress and stay on top of deadlines</p>
        </div>
        <div className="border rounded-lg p-6 text-center">
          <h2 className="text-2xl font-semibold mb-4">Collaboration</h2>
          <p>Share tasks with team members and collaborate effectively</p>
        </div>
      </section>
      
      <section className="text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
        <Link to="/auth/register" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700">
          Create your account
        </Link>
      </section>
    </div>
  );
};

export default HomePage;