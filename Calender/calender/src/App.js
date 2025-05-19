import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, Trash2 } from 'lucide-react';

// Mock data for demonstration purposes
const INITIAL_EVENTS = [
  { id: '1', title: 'Team Meeting', date: '2025-05-20', startTime: '10:00', endTime: '11:00', color: 'bg-blue-500' },
  { id: '2', title: 'Project Deadline', date: '2025-05-22', startTime: '09:00', endTime: '17:00', color: 'bg-red-500' },
  { id: '3', title: 'Lunch with Client', date: '2025-05-19', startTime: '12:30', endTime: '13:30', color: 'bg-green-500' },
  { id: '4', title: 'Code Review', date: '2025-05-21', startTime: '14:00', endTime: '15:00', color: 'bg-purple-500' },
];

// Available event colors
const EVENT_COLORS = [
  'bg-blue-500',
  'bg-red-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-indigo-500',
];

export default function App() {
  const [currentDate, setCurrentDate] = useState(new Date('2025-05-19'));
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    color: 'bg-blue-500',
  });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [viewMode, setViewMode] = useState('month'); // 'month', 'week', 'day'
  
  // Get current month days
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Get the first day of the month
    const firstDay = new Date(year, month, 1);
    const firstDayIndex = firstDay.getDay();
    
    // Get the last day of the month
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Calculate previous month days to display
    const prevMonthDays = [];
    if (firstDayIndex > 0) {
      const prevLastDay = new Date(year, month, 0).getDate();
      for (let i = firstDayIndex - 1; i >= 0; i--) {
        prevMonthDays.push({
          date: new Date(year, month - 1, prevLastDay - i),
          isCurrentMonth: false
        });
      }
    }
    
    // Current month days
    const currentMonthDays = [];
    for (let i = 1; i <= daysInMonth; i++) {
      currentMonthDays.push({
        date: new Date(year, month, i),
        isCurrentMonth: true
      });
    }
    
    // Calculate next month days to display
    const totalDaysDisplayed = prevMonthDays.length + currentMonthDays.length;
    const nextMonthDays = [];
    const remainingDays = 42 - totalDaysDisplayed; // 6 rows of 7 days
    
    for (let i = 1; i <= remainingDays; i++) {
      nextMonthDays.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false
      });
    }
    
    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  };

  // Get week days
  const getWeekDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const date = currentDate.getDate();
    
    // Get the day of the week (0-6, where 0 is Sunday)
    const dayOfWeek = currentDate.getDay();
    
    // Calculate the start date of the week (Sunday)
    const startDate = new Date(year, month, date - dayOfWeek);
    
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      weekDays.push({
        date: day,
        isCurrentMonth: day.getMonth() === month
      });
    }
    
    return weekDays;
  };

  // Get hours for day view
  const getHoursForDay = () => {
    const hours = [];
    for (let i = 0; i < 24; i++) {
      const hour = i % 12 || 12;
      const ampm = i < 12 ? 'AM' : 'PM';
      hours.push(`${hour}:00 ${ampm}`);
    }
    return hours;
  };

  // Get events for a specific day
  const getEventsForDay = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateStr);
  };

  // Format date to YYYY-MM-DD
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Navigate to previous month/week/day
  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() - 1);
    }
    setCurrentDate(newDate);
  };

  // Navigate to next month/week/day
  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  // Open add event modal
  const handleOpenAddEventModal = (date = null) => {
    if (date) {
      setNewEvent({
        ...newEvent,
        date: formatDate(date)
      });
    }
    setShowAddEventModal(true);
  };

  // Close add event modal
  const handleCloseAddEventModal = () => {
    setShowAddEventModal(false);
    setNewEvent({
      title: '',
      date: '',
      startTime: '',
      endTime: '',
      color: 'bg-blue-500',
    });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({
      ...newEvent,
      [name]: value
    });
  };

  // Add new event
  const handleAddEvent = () => {
    const newEventWithId = {
      ...newEvent,
      id: Date.now().toString(),
    };
    
    setEvents([...events, newEventWithId]);
    handleCloseAddEventModal();
  };

  // Delete event
  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter(event => event.id !== eventId));
    setShowEventDetails(false);
  };

  // Show event details
  const handleShowEventDetails = (event) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  // Navigate to today
  const handleToday = () => {
    setCurrentDate(new Date('2025-05-19')); // We're using the current date from the prompt
  };

  // Format month and year display
  const formatMonthYear = () => {
    const options = { month: 'long', year: 'numeric' };
    return currentDate.toLocaleDateString('en-US', options);
  };

  // Format week display
  const formatWeekDisplay = () => {
    const weekDays = getWeekDays();
    const firstDay = weekDays[0].date;
    const lastDay = weekDays[6].date;
    
    const firstOptions = { month: 'short', day: 'numeric' };
    const lastOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    
    return `${firstDay.toLocaleDateString('en-US', firstOptions)} - ${lastDay.toLocaleDateString('en-US', lastOptions)}`;
  };

  // Format day display
  const formatDayDisplay = () => {
    const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    return currentDate.toLocaleDateString('en-US', options);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow p-4">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-800">Calendar App</h1>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleToday} 
              className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md"
            >
              Today
            </button>
            <button 
              onClick={handlePrevious} 
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <button 
              onClick={handleNext} 
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
            <div className="text-lg font-semibold text-gray-900 w-64 text-center">
              {viewMode === 'month' && formatMonthYear()}
              {viewMode === 'week' && formatWeekDisplay()}
              {viewMode === 'day' && formatDayDisplay()}
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('month')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${viewMode === 'month' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${viewMode === 'week' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${viewMode === 'day' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              Day
            </button>
            <button
              onClick={() => handleOpenAddEventModal()}
              className="ml-4 flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              <span>Add Event</span>
            </button>
          </div>
        </div>
      </header>

      {/* Calendar View */}
      <main className="flex-1 overflow-y-auto p-4">
        <div className="mx-auto max-w-7xl bg-white rounded-lg shadow">
          {/* Month View */}
          {viewMode === 'month' && (
            <div className="grid grid-cols-7 text-center">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                <div key={index} className="py-2 font-semibold text-gray-600 border-b">
                  {day}
                </div>
              ))}
              
              {getDaysInMonth().map((day, index) => {
                const dateStr = formatDate(day.date);
                const dayEvents = events.filter(event => event.date === dateStr);
                const isToday = dateStr === '2025-05-19';
                
                return (
                  <div 
                    key={index} 
                    className={`h-32 p-1 border-b border-r ${day.isCurrentMonth ? 'bg-white' : 'bg-gray-50'} ${isToday ? 'bg-blue-50' : ''}`}
                    onClick={() => handleOpenAddEventModal(day.date)}
                  >
                    <div className="flex justify-between">
                      <span className={`inline-flex items-center justify-center w-6 h-6 text-sm ${isToday ? 'bg-blue-600 text-white rounded-full' : day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}`}>
                        {day.date.getDate()}
                      </span>
                    </div>
                    <div className="mt-1 space-y-1 max-h-24 overflow-y-auto">
                      {dayEvents.map((event) => (
                        <div 
                          key={event.id} 
                          className={`px-2 py-1 text-xs text-white rounded truncate ${event.color}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShowEventDetails(event);
                          }}
                        >
                          {event.startTime} - {event.title}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Week View */}
          {viewMode === 'week' && (
            <div>
              <div className="grid grid-cols-8 text-center border-b">
                <div className="py-2 font-semibold text-gray-600"></div>
                {getWeekDays().map((day, index) => {
                  const dateStr = formatDate(day.date);
                  const isToday = dateStr === '2025-05-19';
                  return (
                    <div key={index} className={`py-2 font-semibold ${isToday ? 'bg-blue-50' : ''}`}>
                      <div className="text-gray-600">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][index]}</div>
                      <div className={`inline-flex items-center justify-center w-8 h-8 mt-1 ${isToday ? 'bg-blue-600 text-white rounded-full' : 'text-gray-900'}`}>
                        {day.date.getDate()}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="grid grid-cols-8 divide-x">
                <div className="divide-y">
                  {Array.from({ length: 12 }, (_, i) => {
                    const hour = i + 8; // Start from 8 AM
                    const hourFormat = hour % 12 || 12;
                    const ampm = hour < 12 || hour === 24 ? 'AM' : 'PM';
                    return (
                      <div key={i} className="h-16 text-xs text-gray-500 text-right pr-2 pt-1">
                        {`${hourFormat} ${ampm}`}
                      </div>
                    );
                  })}
                </div>
                
                {getWeekDays().map((day, dayIndex) => {
                  const dateStr = formatDate(day.date);
                  const dayEvents = events.filter(event => event.date === dateStr);
                  
                  return (
                    <div key={dayIndex} className="relative divide-y">
                      {Array.from({ length: 12 }, (_, hourIndex) => (
                        <div 
                          key={hourIndex} 
                          className="h-16 bg-gray-50 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            const newDate = new Date(day.date);
                            setNewEvent({
                              ...newEvent,
                              date: formatDate(newDate),
                              startTime: `${(hourIndex + 8).toString().padStart(2, '0')}:00`,
                              endTime: `${(hourIndex + 9).toString().padStart(2, '0')}:00`
                            });
                            setShowAddEventModal(true);
                          }}
                        ></div>
                      ))}
                      
                      {dayEvents.map((event) => {
                        const startHour = parseInt(event.startTime.split(':')[0]);
                        const startMinute = parseInt(event.startTime.split(':')[1]);
                        const endHour = parseInt(event.endTime.split(':')[0]);
                        const endMinute = parseInt(event.endTime.split(':')[1]);
                        
                        const startFromTop = (startHour - 8) * 64 + (startMinute / 60) * 64;
                        const height = ((endHour - startHour) + (endMinute - startMinute) / 60) * 64;
                        
                        // Only show events between 8 AM and 8 PM
                        if (startHour >= 8 && startHour < 20) {
                          return (
                            <div
                              key={event.id}
                              className={`absolute left-0 right-0 mx-1 px-2 py-1 rounded text-xs text-white overflow-hidden ${event.color}`}
                              style={{
                                top: `${startFromTop}px`,
                                height: `${height}px`,
                                zIndex: 10
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleShowEventDetails(event);
                              }}
                            >
                              <div className="font-semibold">{event.title}</div>
                              <div>{event.startTime} - {event.endTime}</div>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Day View */}
          {viewMode === 'day' && (
            <div className="grid grid-cols-1 divide-y">
              <div className="py-4 text-center font-semibold text-lg border-b">
                {formatDayDisplay()}
              </div>
              
              {Array.from({ length: 12 }, (_, i) => {
                const hour = i + 8; // Start from 8 AM
                const hourFormat = hour % 12 || 12;
                const ampm = hour < 12 || hour === 24 ? 'AM' : 'PM';
                const hourStr = `${hour.toString().padStart(2, '0')}:00`;
                const dateStr = formatDate(currentDate);
                const hourEvents = events.filter(event => 
                  event.date === dateStr && 
                  event.startTime.split(':')[0] === hour.toString().padStart(2, '0')
                );
                
                return (
                  <div key={i} className="grid grid-cols-6 h-20">
                    <div className="text-right pr-4 py-2 text-gray-500 self-start">
                      {`${hourFormat} ${ampm}`}
                    </div>
                    <div 
                      className="col-span-5 bg-gray-50 hover:bg-gray-100 p-2 cursor-pointer"
                      onClick={() => {
                        setNewEvent({
                          ...newEvent,
                          date: dateStr,
                          startTime: hourStr,
                          endTime: `${(hour + 1).toString().padStart(2, '0')}:00`
                        });
                        setShowAddEventModal(true);
                      }}
                    >
                      {hourEvents.map(event => (
                        <div 
                          key={event.id}
                          className={`px-3 py-2 rounded text-white mb-1 ${event.color}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShowEventDetails(event);
                          }}
                        >
                          <div className="font-semibold">{event.title}</div>
                          <div className="text-sm">{event.startTime} - {event.endTime}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Add Event Modal */}
      {showAddEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-semibold text-gray-800">Add New Event</h2>
            </div>
            <div className="p-6">
              <form>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Event Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={newEvent.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter event title"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={newEvent.date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      name="startTime"
                      value={newEvent.startTime}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      name="endTime"
                      value={newEvent.endTime}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Color
                  </label>
                  <div className="flex space-x-2">
                    {EVENT_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`w-6 h-6 rounded-full ${color} ${newEvent.color === color ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                        onClick={() => setNewEvent({ ...newEvent, color })}
                      ></button>
                    ))}
                  </div>
                </div>
              </form>
            </div>
            <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end space-x-2">
              <button
                onClick={handleCloseAddEventModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleAddEvent}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                disabled={!newEvent.title || !newEvent.date || !newEvent.startTime || !newEvent.endTime}
              >
                Add Event
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Event Details Modal */}
      {showEventDetails && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className={`px-6 py-4 rounded-t-lg text-white ${selectedEvent.color}`}>
              <h2 className="text-xl font-semibold">{selectedEvent.title}</h2>
            </div>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <CalendarIcon className="h-5 w-5 text-gray-500 mr-2" />
                <span>{selectedEvent.date}</span>
              </div>
              <div className="flex items-center mb-4">
                <Clock className="h-5 w-5 text-gray-500 mr-2" />
                <span>{selectedEvent.startTime} - {selectedEvent.endTime}</span>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-between">
              <button
                onClick={() => handleDeleteEvent(selectedEvent.id)}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md flex items-center"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </button>
              <button
                onClick={() => setShowEventDetails(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}