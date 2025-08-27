import React from 'react';
interface CalendarViewProps {
  currentDate: Date;
  view: 'day' | 'week' | 'month';
}
interface CalendarEvent {
  id: number;
  title: string;
  client: string;
  start: string;
  end: string;
  type: 'strength' | 'mobility' | 'rehab' | 'assessment';
}
const CalendarView = ({
  currentDate,
  view
}: CalendarViewProps) => {
  // Mock events data
  const events: CalendarEvent[] = [{
    id: 1,
    title: 'Strength Session',
    client: 'Emma Wilson',
    start: '09:00',
    end: '10:00',
    type: 'strength'
  }, {
    id: 2,
    title: 'Mobility Work',
    client: 'Mike Johnson',
    start: '11:30',
    end: '12:15',
    type: 'mobility'
  }, {
    id: 3,
    title: 'Rehab Session',
    client: 'Sarah Lee',
    start: '14:15',
    end: '15:15',
    type: 'rehab'
  }, {
    id: 4,
    title: 'Initial Assessment',
    client: 'Tom Garcia',
    start: '16:00',
    end: '16:30',
    type: 'assessment'
  }];
  // Generate time slots for the day view
  const timeSlots = Array.from({
    length: 12
  }, (_, i) => {
    const hour = i + 8; // Start from 8 AM
    return `${hour}:00 ${hour < 12 ? 'AM' : hour === 12 ? 'PM' : hour - 12 + ' PM'}`;
  });
  // Generate days for the week view
  const generateWeekDays = () => {
    const days = [];
    const firstDay = new Date(currentDate);
    // Adjust to start from Sunday or Monday as needed
    const day = firstDay.getDay();
    firstDay.setDate(firstDay.getDate() - day + (day === 0 ? -6 : 1)); // Start from Monday
    for (let i = 0; i < 7; i++) {
      const date = new Date(firstDay);
      date.setDate(firstDay.getDate() + i);
      days.push(date);
    }
    return days;
  };
  const weekDays = generateWeekDays();
  // Generate days for the month view
  const generateMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const days = [];
    // Previous month days to fill the first week
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDay - 1; i >= 0; i--) {
      days.push({
        date: prevMonthLastDay - i,
        currentMonth: false
      });
    }
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: i,
        currentMonth: true
      });
    }
    // Next month days to fill the last week
    const remainingDays = 42 - days.length; // 6 rows x 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: i,
        currentMonth: false
      });
    }
    return days;
  };
  const monthDays = generateMonthDays();
  // Render the calendar based on the selected view
  const renderCalendar = () => {
    switch (view) {
      case 'day':
        return <div className="h-full">
            <div className="grid grid-cols-1 h-full">
              {timeSlots.map((timeSlot, index) => <div key={index} className="border-b border-gray-200 relative h-24">
                  <div className="absolute left-0 -top-3 text-xs text-gray-500 bg-white px-2">
                    {timeSlot}
                  </div>
                  {/* Render events for this time slot */}
                  {events.filter(event => {
                const [eventHour] = event.start.split(':').map(Number);
                const slotHour = index + 8; // Start from 8 AM
                return eventHour === slotHour;
              }).map(event => {
                const [startHour, startMinute] = event.start.split(':').map(Number);
                const [endHour, endMinute] = event.end.split(':').map(Number);
                // Calculate duration in minutes
                const durationMinutes = endHour * 60 + endMinute - (startHour * 60 + startMinute);
                const heightPercentage = durationMinutes / 60 * 100;
                // Calculate top position based on minutes
                const topPercentage = startMinute / 60 * 100;
                return <div key={event.id} className={`absolute left-16 right-4 p-2 rounded-md cursor-pointer ${event.type === 'strength' ? 'bg-blue-100 border-l-4 border-blue-500' : event.type === 'mobility' ? 'bg-green-100 border-l-4 border-green-500' : event.type === 'rehab' ? 'bg-yellow-100 border-l-4 border-yellow-500' : 'bg-purple-100 border-l-4 border-purple-500'}`} style={{
                  top: `${topPercentage}%`,
                  height: `${heightPercentage}%`,
                  maxHeight: '95%'
                }}>
                          <h3 className="font-medium text-sm truncate">
                            {event.title}
                          </h3>
                          <p className="text-xs text-gray-600 truncate">
                            {event.client}
                          </p>
                          <p className="text-xs text-gray-500">
                            {event.start} - {event.end}
                          </p>
                        </div>;
              })}
                </div>)}
            </div>
          </div>;
      case 'week':
        return <div className="h-full">
            <div className="grid grid-cols-8 h-full border-b">
              <div className="border-r border-gray-200 pt-16">
                {timeSlots.map((timeSlot, index) => <div key={index} className="h-24 border-t border-gray-200 text-xs text-gray-500 px-2">
                    {timeSlot}
                  </div>)}
              </div>
              {weekDays.map((date, dayIndex) => <div key={dayIndex} className="border-r border-gray-200 flex flex-col">
                  <div className="h-16 border-b border-gray-200 flex flex-col items-center justify-center">
                    <div className="text-sm font-medium">
                      {date.toLocaleDateString('en-US', {
                    weekday: 'short'
                  })}
                    </div>
                    <div className={`text-2xl font-semibold mt-1 w-10 h-10 flex items-center justify-center rounded-full ${date.toDateString() === new Date().toDateString() ? 'bg-blue-600 text-white' : ''}`}>
                      {date.getDate()}
                    </div>
                  </div>
                  {timeSlots.map((_, timeIndex) => <div key={timeIndex} className="h-24 border-t border-gray-200 relative">
                      {/* Render events for this day and time slot */}
                      {events.filter(event => {
                  // In a real app, you'd check if the event is on this date and time
                  // For this prototype, just show events on the current day view
                  const [eventHour] = event.start.split(':').map(Number);
                  const slotHour = timeIndex + 8; // Start from 8 AM
                  return dayIndex === new Date().getDay() - 1 && eventHour === slotHour;
                }).map(event => {
                  const [startHour, startMinute] = event.start.split(':').map(Number);
                  const [endHour, endMinute] = event.end.split(':').map(Number);
                  // Calculate duration in minutes
                  const durationMinutes = endHour * 60 + endMinute - (startHour * 60 + startMinute);
                  const heightPercentage = durationMinutes / 60 * 100;
                  // Calculate top position based on minutes
                  const topPercentage = startMinute / 60 * 100;
                  return <div key={event.id} className={`absolute left-0 right-0 mx-1 p-1 rounded-sm text-xs cursor-pointer ${event.type === 'strength' ? 'bg-blue-100 border-l-2 border-blue-500' : event.type === 'mobility' ? 'bg-green-100 border-l-2 border-green-500' : event.type === 'rehab' ? 'bg-yellow-100 border-l-2 border-yellow-500' : 'bg-purple-100 border-l-2 border-purple-500'}`} style={{
                    top: `${topPercentage}%`,
                    height: `${heightPercentage}%`,
                    maxHeight: '95%'
                  }}>
                              <div className="truncate font-medium">
                                {event.title}
                              </div>
                              <div className="truncate text-gray-600">
                                {event.client}
                              </div>
                            </div>;
                })}
                    </div>)}
                </div>)}
            </div>
          </div>;
      case 'month':
        return <div className="h-full">
            <div className="grid grid-cols-7 gap-px bg-gray-200">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => <div key={day} className="bg-gray-100 p-2 text-center text-sm font-medium">
                  {day}
                </div>)}
              {monthDays.map((day, index) => <div key={index} className={`bg-white p-2 h-32 ${!day.currentMonth ? 'text-gray-400' : ''} ${day.currentMonth && day.date === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() ? 'ring-2 ring-inset ring-blue-500' : ''}`}>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">{day.date}</span>
                    {day.currentMonth && day.date === 15 && <span className="text-xs bg-blue-100 text-blue-800 px-1.5 rounded-full">
                        3
                      </span>}
                  </div>
                  {/* Show sample events on a few days */}
                  {day.currentMonth && [5, 12, 15, 20].includes(day.date) && <div className="mt-2 space-y-1">
                      {(day.date === 15 ? events.slice(0, 3) : events.slice(0, 1)).map(event => <div key={event.id} className={`text-xs p-1 rounded truncate ${event.type === 'strength' ? 'bg-blue-100 text-blue-800' : event.type === 'mobility' ? 'bg-green-100 text-green-800' : event.type === 'rehab' ? 'bg-yellow-100 text-yellow-800' : 'bg-purple-100 text-purple-800'}`}>
                          {event.start} {event.title}
                        </div>)}
                    </div>}
                </div>)}
            </div>
          </div>;
    }
  };
  return <div className="h-full overflow-y-auto">{renderCalendar()}</div>;
};
export default CalendarView;