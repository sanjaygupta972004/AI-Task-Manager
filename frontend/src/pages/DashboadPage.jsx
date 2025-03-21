import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    upcomingDeadlines: []
  });
  
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate fetching dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // In a real app, this would be an API call
        // Simulating API response with dummy data
        setTimeout(() => {
          setStats({
            totalTasks: 12,
            completedTasks: 5,
            pendingTasks: 7,
            upcomingDeadlines: [
              { id: 1, title: 'Complete project proposal', dueDate: '2025-03-25' },
              { id: 2, title: 'Review client feedback', dueDate: '2025-03-22' },
              { id: 3, title: 'Team meeting preparation', dueDate: '2025-03-23' }
            ]
          });
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link to="/tasks" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          View All Tasks
        </Link>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Loading dashboard data...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Total Tasks</h2>
              <p className="text-3xl font-bold">{stats.totalTasks}</p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Completed Tasks</h2>
              <p className="text-3xl font-bold text-green-600">{stats.completedTasks}</p>
              <p className="text-sm text-gray-500">
                {Math.round((stats.completedTasks / stats.totalTasks) * 100)}% completion rate
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Pending Tasks</h2>
              <p className="text-3xl font-bold text-orange-500">{stats.pendingTasks}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Upcoming Deadlines</h2>
              <Link to="/tasks" className="text-blue-600 hover:underline text-sm">
                View All
              </Link>
            </div>
            
            {stats.upcomingDeadlines.length > 0 ? (
              <div className="divide-y">
                {stats.upcomingDeadlines.map(task => (
                  <div key={task.id} className="py-3 flex justify-between items-center">
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-gray-500">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Link to={`/tasks?id=${task.id}`} className="text-blue-600 hover:underline">
                      View
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No upcoming deadlines</p>
            )}
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button className="p-4 border rounded-md hover:bg-gray-50 flex items-center gap-2">
                <span className="font-medium">Add New Task</span>
              </button>
              <button className="p-4 border rounded-md hover:bg-gray-50 flex items-center gap-2">
                <span className="font-medium">Generate Report</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;