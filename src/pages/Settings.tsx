import React, { useState } from 'react';
import { UserIcon, BellIcon, CreditCardIcon, LockIcon, GlobeIcon, PaletteIcon, SaveIcon, CheckIcon } from 'lucide-react';
const Settings = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'billing' | 'security' | 'appearance'>('profile');
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    title: 'Head Trainer',
    bio: 'Certified personal trainer with 8+ years of experience specializing in strength training and rehabilitation.'
  });
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    sessionReminders: true,
    clientUpdates: true,
    marketingEmails: false
  });
  const [appearance, setAppearance] = useState({
    theme: 'light',
    compactMode: false,
    showClientPhotos: true,
    defaultCalendarView: 'week'
  });
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {
      name,
      value
    } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      checked
    } = e.target;
    setNotificationSettings(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  const handleAppearanceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {
      name,
      value,
      type
    } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setAppearance(prev => ({
      ...prev,
      [name]: newValue
    }));
  };
  return <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-600">Manage your account and preferences</p>
      </div>
      <div className="bg-white rounded-lg shadow flex-1 flex flex-col md:flex-row">
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-200">
          <nav className="p-4">
            <ul className="space-y-1">
              <li>
                <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'profile' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}>
                  <UserIcon size={18} className={`mr-3 ${activeTab === 'profile' ? 'text-blue-500' : 'text-gray-400'}`} />
                  <span>Profile</span>
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('notifications')} className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'notifications' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}>
                  <BellIcon size={18} className={`mr-3 ${activeTab === 'notifications' ? 'text-blue-500' : 'text-gray-400'}`} />
                  <span>Notifications</span>
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('billing')} className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'billing' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}>
                  <CreditCardIcon size={18} className={`mr-3 ${activeTab === 'billing' ? 'text-blue-500' : 'text-gray-400'}`} />
                  <span>Billing</span>
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('security')} className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'security' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}>
                  <LockIcon size={18} className={`mr-3 ${activeTab === 'security' ? 'text-blue-500' : 'text-gray-400'}`} />
                  <span>Security</span>
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('appearance')} className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'appearance' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}>
                  <PaletteIcon size={18} className={`mr-3 ${activeTab === 'appearance' ? 'text-blue-500' : 'text-gray-400'}`} />
                  <span>Appearance</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
        <div className="flex-1 p-6 overflow-y-auto">
          {activeTab === 'profile' && <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Profile Information
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Update your personal information and how it appears to
                  clients.
                </p>
              </div>
              <div className="flex items-center">
                <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Profile" className="h-full w-full object-cover" />
                </div>
                <div className="ml-5">
                  <button className="px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    Change photo
                  </button>
                  <p className="mt-1 text-xs text-gray-500">
                    JPG, GIF or PNG. 1MB max.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First name
                  </label>
                  <div className="mt-1">
                    <input type="text" name="firstName" id="firstName" value={profileData.firstName} onChange={handleProfileChange} className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md" />
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last name
                  </label>
                  <div className="mt-1">
                    <input type="text" name="lastName" id="lastName" value={profileData.lastName} onChange={handleProfileChange} className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md" />
                  </div>
                </div>
                <div className="sm:col-span-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1">
                    <input type="email" name="email" id="email" value={profileData.email} onChange={handleProfileChange} className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md" />
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone number
                  </label>
                  <div className="mt-1">
                    <input type="text" name="phone" id="phone" value={profileData.phone} onChange={handleProfileChange} className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md" />
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Job title
                  </label>
                  <div className="mt-1">
                    <input type="text" name="title" id="title" value={profileData.title} onChange={handleProfileChange} className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md" />
                  </div>
                </div>
                <div className="sm:col-span-6">
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                    Bio
                  </label>
                  <div className="mt-1">
                    <textarea id="bio" name="bio" rows={4} value={profileData.bio} onChange={handleProfileChange} className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md" />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Brief description for your profile. This will be visible to
                    clients.
                  </p>
                </div>
              </div>
              <div className="flex justify-end">
                <button type="button" className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Save
                </button>
              </div>
            </div>}
          {activeTab === 'notifications' && <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Notification Settings
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Manage how and when you receive notifications.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input id="emailNotifications" name="emailNotifications" type="checkbox" checked={notificationSettings.emailNotifications} onChange={handleNotificationChange} className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded" />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="emailNotifications" className="font-medium text-gray-700">
                      Email notifications
                    </label>
                    <p className="text-gray-500">
                      Receive notifications via email.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input id="pushNotifications" name="pushNotifications" type="checkbox" checked={notificationSettings.pushNotifications} onChange={handleNotificationChange} className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded" />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="pushNotifications" className="font-medium text-gray-700">
                      Push notifications
                    </label>
                    <p className="text-gray-500">
                      Receive notifications on your device.
                    </p>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900">
                    Notification types
                  </h4>
                  <div className="mt-4 space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input id="sessionReminders" name="sessionReminders" type="checkbox" checked={notificationSettings.sessionReminders} onChange={handleNotificationChange} className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded" />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="sessionReminders" className="font-medium text-gray-700">
                          Session reminders
                        </label>
                        <p className="text-gray-500">
                          Get notified about upcoming training sessions.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input id="clientUpdates" name="clientUpdates" type="checkbox" checked={notificationSettings.clientUpdates} onChange={handleNotificationChange} className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded" />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="clientUpdates" className="font-medium text-gray-700">
                          Client updates
                        </label>
                        <p className="text-gray-500">
                          Get notified when clients make changes or progress.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input id="marketingEmails" name="marketingEmails" type="checkbox" checked={notificationSettings.marketingEmails} onChange={handleNotificationChange} className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded" />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="marketingEmails" className="font-medium text-gray-700">
                          Marketing emails
                        </label>
                        <p className="text-gray-500">
                          Receive emails about new features and promotions.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <button type="button" className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Save
                </button>
              </div>
            </div>}
          {activeTab === 'billing' && <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Billing Information
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Manage your subscription and payment methods.
                </p>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-md font-medium text-gray-900">
                    Current Plan
                  </h3>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">
                        Professional Plan
                      </h4>
                      <p className="mt-1 text-sm text-gray-500">
                        $49.99 / month
                      </p>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <CheckIcon size={16} className="text-green-500 mr-1.5" />
                        <p>Unlimited clients</p>
                      </div>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <CheckIcon size={16} className="text-green-500 mr-1.5" />
                        <p>Advanced analytics</p>
                      </div>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <CheckIcon size={16} className="text-green-500 mr-1.5" />
                        <p>Custom branding</p>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <button type="button" className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                        Change Plan
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-md font-medium text-gray-900">
                    Payment Methods
                  </h3>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <CreditCardIcon size={24} className="text-gray-400" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          Visa ending in 4242
                        </div>
                        <div className="text-sm text-gray-500">
                          Expires 12/2024
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <button type="button" className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                        Edit
                      </button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <button type="button" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                      <PlusIcon size={16} className="mr-2" />
                      Add payment method
                    </button>
                  </div>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-md font-medium text-gray-900">
                    Billing History
                  </h3>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex flex-col">
                    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                      <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                        <div className="overflow-hidden border border-gray-200 sm:rounded-lg">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Date
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Description
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Amount
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Status
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  Jun 1, 2023
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  Professional Plan
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  $49.99
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                                  Paid
                                </td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  May 1, 2023
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  Professional Plan
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  $49.99
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                                  Paid
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>}
          {activeTab === 'security' && <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Security Settings
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Manage your password and account security.
                </p>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-md font-medium text-gray-900">
                    Change Password
                  </h3>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-4">
                      <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                        Current password
                      </label>
                      <div className="mt-1">
                        <input type="password" name="current-password" id="current-password" className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md" />
                      </div>
                    </div>
                    <div className="sm:col-span-4">
                      <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                        New password
                      </label>
                      <div className="mt-1">
                        <input type="password" name="new-password" id="new-password" className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md" />
                      </div>
                    </div>
                    <div className="sm:col-span-4">
                      <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                        Confirm password
                      </label>
                      <div className="mt-1">
                        <input type="password" name="confirm-password" id="confirm-password" className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md" />
                      </div>
                    </div>
                  </div>
                  <div className="mt-5">
                    <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                      <SaveIcon size={16} className="mr-2" />
                      Update password
                    </button>
                  </div>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-md font-medium text-gray-900">
                    Two-Factor Authentication
                  </h3>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-medium text-gray-900">
                        Two-factor authentication is disabled
                      </h4>
                      <p className="mt-1 text-sm text-gray-500">
                        Add an extra layer of security to your account by
                        requiring both your password and a verification code.
                      </p>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <button type="button" className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                        Enable
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-md font-medium text-gray-900">
                    Sessions
                  </h3>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-base font-medium text-gray-900">
                          Current session
                        </h4>
                        <p className="mt-1 text-sm text-gray-500">
                          This is your current active session.
                        </p>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      </div>
                    </div>
                    <button type="button" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700">
                      Sign out of all sessions
                    </button>
                  </div>
                </div>
              </div>
            </div>}
          {activeTab === 'appearance' && <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Appearance Settings
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Customize how FitnessCRM looks and behaves.
                </p>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-md font-medium text-gray-900">Theme</h3>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input id="theme-light" name="theme" type="radio" value="light" checked={appearance.theme === 'light'} onChange={handleAppearanceChange} className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300" />
                      <label htmlFor="theme-light" className="ml-3 block text-sm font-medium text-gray-700">
                        Light
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input id="theme-dark" name="theme" type="radio" value="dark" checked={appearance.theme === 'dark'} onChange={handleAppearanceChange} className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300" />
                      <label htmlFor="theme-dark" className="ml-3 block text-sm font-medium text-gray-700">
                        Dark
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input id="theme-system" name="theme" type="radio" value="system" checked={appearance.theme === 'system'} onChange={handleAppearanceChange} className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300" />
                      <label htmlFor="theme-system" className="ml-3 block text-sm font-medium text-gray-700">
                        System default
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-md font-medium text-gray-900">
                    Display Options
                  </h3>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input id="compactMode" name="compactMode" type="checkbox" checked={appearance.compactMode} onChange={handleAppearanceChange} className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded" />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="compactMode" className="font-medium text-gray-700">
                          Compact mode
                        </label>
                        <p className="text-gray-500">
                          Display more information with less spacing.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input id="showClientPhotos" name="showClientPhotos" type="checkbox" checked={appearance.showClientPhotos} onChange={handleAppearanceChange} className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded" />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="showClientPhotos" className="font-medium text-gray-700">
                          Show client photos
                        </label>
                        <p className="text-gray-500">
                          Display client profile pictures in lists and tables.
                        </p>
                      </div>
                    </div>
                    <div className="sm:col-span-3 mt-4">
                      <label htmlFor="defaultCalendarView" className="block text-sm font-medium text-gray-700">
                        Default calendar view
                      </label>
                      <div className="mt-1">
                        <select id="defaultCalendarView" name="defaultCalendarView" value={appearance.defaultCalendarView} onChange={handleAppearanceChange} className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md">
                          <option value="day">Day</option>
                          <option value="week">Week</option>
                          <option value="month">Month</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <button type="button" className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Reset to defaults
                </button>
                <button type="submit" className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Save
                </button>
              </div>
            </div>}
        </div>
      </div>
    </div>;
};
export default Settings;