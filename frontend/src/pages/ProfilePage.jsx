import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

const ProfilePage = () => {
  const { user, updateUserProfile, updatePassword, logout } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    jobTitle: '',
    bio: '',
    notificationsEnabled: true
  });
  
  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // In a real app, this would come from the auth context or an API call
        // For now we'll simulate with setTimeout
        setTimeout(() => {
          setProfileData({
            name: user?.name || 'John Doe',
            email: user?.email || 'john.doe@example.com',
            jobTitle: user?.jobTitle || 'Project Manager',
            bio: user?.bio || 'Experienced project manager with a focus on web development projects.',
            notificationsEnabled: user?.notificationsEnabled || true
          });
          setIsLoading(false);
        }, 800);
      } catch (error) {
        setErrorMessage('Failed to load profile data. Please refresh the page.');
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user]);
  
  const handleProfileChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      // In a real app, call the updateUserProfile function from auth context
      await updateUserProfile(profileData);
      
      setSuccessMessage('Profile updated successfully!');
      setErrorMessage('');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      setErrorMessage('Failed to update profile. Please try again.');
      setSuccessMessage('');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMessage('New passwords do not match');
      setSuccessMessage('');
      return;
    }
    
    // Validate password strength
    if (passwordData.newPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters long');
      setSuccessMessage('');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // In a real app, call the updatePassword function from auth context
      await updatePassword(passwordData.currentPassword, passwordData.newPassword);
      
      setSuccessMessage('Password updated successfully!');
      setErrorMessage('');
      
      // Clear form and success message
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      setErrorMessage('Failed to update password. Please check your current password.');
      setSuccessMessage('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        setIsLoading(true);
        // In a real app, this would call an API endpoint to delete the account
        // await deleteUserAccount();
        
        // Redirect to homepage or login page after successful deletion
        logout();
      } catch (error) {
        setErrorMessage('Failed to delete account. Please try again later.');
        setIsLoading(false);
      }
    }
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Profile Settings</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Loading profile data...</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
            <div className="flex border-b overflow-x-auto">
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === 'profile' 
                    ? 'border-b-2 border-blue-600 text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === 'security' 
                    ? 'border-b-2 border-blue-600 text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Security
              </button>
              <button
                onClick={() => setActiveTab('preferences')}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === 'preferences' 
                    ? 'border-b-2 border-blue-600 text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Preferences
              </button>
            </div>
            
            <div className="p-6">
              {/* Success and Error Messages */}
              {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                  {successMessage}
                </div>
              )}
              
              {errorMessage && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {errorMessage}
                </div>
              )}
              
              {/* Profile Information Tab */}
              {activeTab === 'profile' && (
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={profileData.name}
                        onChange={handleProfileChange}
                        required
                        className="w-full border rounded-md px-3 py-2"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleProfileChange}
                        required
                        className="w-full border rounded-md px-3 py-2"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="jobTitle" className="block text-sm font-medium mb-1">
                        Job Title
                      </label>
                      <input
                        type="text"
                        id="jobTitle"
                        name="jobTitle"
                        value={profileData.jobTitle}
                        onChange={handleProfileChange}
                        className="w-full border rounded-md px-3 py-2"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium mb-1">
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={profileData.bio}
                      onChange={handleProfileChange}
                      rows="4"
                      className="w-full border rounded-md px-3 py-2"
                    ></textarea>
                    <p className="text-sm text-gray-500 mt-1">
                      Brief description for your profile. URLs are hyperlinked.
                    </p>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              )}
              
              {/* Security Tab */}
              {activeTab === 'security' && (
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        required
                        className="w-full border rounded-md px-3 py-2"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        required
                        className="w-full border rounded-md px-3 py-2"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Password must be at least 8 characters long.
                      </p>
                    </div>
                    
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                        className="w-full border rounded-md px-3 py-2"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </form>
              )}
              
              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Notification Settings</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="notificationsEnabled"
                            name="notificationsEnabled"
                            type="checkbox"
                            checked={profileData.notificationsEnabled}
                            onChange={handleProfileChange}
                            className="h-4 w-4 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="notificationsEnabled" className="font-medium">
                            Email Notifications
                          </label>
                          <p className="text-gray-500">
                            Receive email notifications for task updates and assignments.
                          </p>
                        </div>
                      </div>
                      
                      {/* Additional notification preferences */}
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="marketingEmails"
                            name="marketingEmails"
                            type="checkbox"
                            checked={profileData.marketingEmails}
                            onChange={handleProfileChange}
                            className="h-4 w-4 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="marketingEmails" className="font-medium">
                            Marketing Emails
                          </label>
                          <p className="text-gray-500">
                            Receive updates about new features and promotional offers.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="securityAlerts"
                            name="securityAlerts"
                            type="checkbox"
                            checked={profileData.securityAlerts !== false}
                            onChange={handleProfileChange}
                            className="h-4 w-4 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="securityAlerts" className="font-medium">
                            Security Alerts
                          </label>
                          <p className="text-gray-500">
                            Receive notifications about important security updates.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Display Settings</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <label htmlFor="language" className="block text-sm font-medium mb-1">
                          Language Preference
                        </label>
                        <select
                          id="language"
                          name="language"
                          value={profileData.language || 'en'}
                          onChange={handleProfileChange}
                          className="w-full border rounded-md px-3 py-2"
                        >
                          <option value="en">English</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                          <option value="de">German</option>
                          <option value="zh">Chinese</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="theme" className="block text-sm font-medium mb-1">
                          Theme
                        </label>
                        <select
                          id="theme"
                          name="theme"
                          value={profileData.theme || 'light'}
                          onChange={handleProfileChange}
                          className="w-full border rounded-md px-3 py-2"
                        >
                          <option value="light">Light</option>
                          <option value="dark">Dark</option>
                          <option value="system">System Default</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Saving...' : 'Save Preferences'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Account Actions</h2>
            <div className="flex flex-wrap gap-4">
              <button 
                className="border border-red-500 text-red-500 px-4 py-2 rounded-md hover:bg-red-50 disabled:opacity-50"
                onClick={() => {
                  if (window.confirm('Are you sure you want to log out?')) {
                    logout();
                  }
                }}
                disabled={isLoading}
              >
                Log Out
              </button>
              
              <button 
                className="border border-red-700 text-red-700 px-4 py-2 rounded-md hover:bg-red-50 disabled:opacity-50"
                onClick={handleDeleteAccount}
                disabled={isLoading}
              >
                Delete Account
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfilePage;