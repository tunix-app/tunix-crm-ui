import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon, FilterIcon } from 'lucide-react';
import CalendarView from '../components/Calendar/CalendarView';
import NewSession from '@/components/Calendar/scheduling/newSessionDialog';
import { Button } from '@/components/ui/button';
const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'day' | 'week' | 'month'>('week');
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };
  const navigatePrevious = () => {
    const newDate = new Date(currentDate);
    if (view === 'day') {
      newDate.setDate(newDate.getDate() - 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };
  const navigateNext = () => {
    const newDate = new Date(currentDate);
    if (view === 'day') {
      newDate.setDate(newDate.getDate() + 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };
  const navigateToday = () => {
    setCurrentDate(new Date());
  };
  return <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Calendar</h1>
        {/* <p className="text-gray-600">
          Manage your schedule and sessions
        </p> */}
      </div>
      <div className="bg-white rounded-lg shadow flex-1 flex flex-col">
        <div className="p-4 border-b flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center">
            <button onClick={navigateToday} className="px-4 py-2 bg-tan-600 text-white rounded-md text-sm font-medium hover:bg-tan-700" style={{ borderRadius: '24px' }}>
              Today
            </button>
            <div className="flex items-center mx-4">
              <button onClick={navigatePrevious} className="p-1 rounded-full hover:bg-gray-100">
                <ChevronLeftIcon size={20} />
              </button>
              <h2 className="mx-4 font-medium">{formatDate(currentDate)}</h2>
              <button onClick={navigateNext} className="p-1 rounded-full hover:bg-gray-100">
                <ChevronRightIcon size={20} />
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="bg-gray-100 p-1 rounded-md flex" style={{ borderRadius: '24px' }}>
              <Button className={`px-3 py-1 text-sm rounded-md ${view === 'day' ? 'bg-white shadow' : ''}`} onClick={() => setView('day')}>
                Day
              </Button>
              <Button className={`px-3 py-1 text-sm rounded-md ${view === 'week' ? 'bg-white shadow' : ''}`} onClick={() => setView('week')}>
                Week
              </Button>
              <Button className={`px-3 py-1 text-sm rounded-md ${view === 'month' ? 'bg-white shadow' : ''}`} onClick={() => setView('month')}>
                Month
              </Button>
            </div>
            <Button className="p-2 rounded-md hover:bg-gray-100">
              <FilterIcon size={18} />
            </Button>
            <NewSession />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <CalendarView currentDate={currentDate} view={view} />
        </div>
      </div>
    </div>;
};
export default Calendar;