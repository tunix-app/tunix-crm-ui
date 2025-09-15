import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CalendarView from './CalendarView';
import { NewSession } from './scheduling/newSessionDialog';
export default function CalendarPage() {
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
            <Button onClick={navigateToday} variant="blue" size="sm">
              Today
            </Button>
            <div className="flex items-center mx-4">
              <button onClick={navigatePrevious} className="p-1 rounded-full hover:bg-gray-100">
                <ChevronLeft size={20} />
              </button>
              <h2 className="mx-4 font-medium">{formatDate(currentDate)}</h2>
              <button onClick={navigateNext} className="p-1 rounded-full hover:bg-gray-100">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="bg-gray-100 p-1 rounded-md flex">
              <button className={`px-3 py-1 text-sm rounded-md ${view === 'day' ? 'bg-white shadow' : ''}`} onClick={() => setView('day')}>
                Day
              </button>
              <button className={`px-3 py-1 text-sm rounded-md ${view === 'week' ? 'bg-white shadow' : ''}`} onClick={() => setView('week')}>
                Week
              </button>
              <button className={`px-3 py-1 text-sm rounded-md ${view === 'month' ? 'bg-white shadow' : ''}`} onClick={() => setView('month')}>
                Month
              </button>
            </div>
            <button className="p-2 rounded-md hover:bg-gray-100">
              <SlidersHorizontal size={18} />
            </button>
            <NewSession />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <CalendarView currentDate={currentDate} view={view} />
        </div>
      </div>
    </div>;
}