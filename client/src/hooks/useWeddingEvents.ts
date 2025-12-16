'use client';

import { useState, useEffect, useMemo } from 'react';

export interface WeddingEvent {
  name: string;
  date: string;
  displayDate: string; // e.g., "December 16, 2025"
  displayTime: string; // e.g., "Tuesday • Starts at 4:00 PM"
  location: string;
  venue: string;
  message: string;
}

export function useWeddingEvents() {
  const [currentEvent, setCurrentEvent] = useState<WeddingEvent | null>(null);
  const [allEventsCompleted, setAllEventsCompleted] = useState(false);

  // Define all wedding events in chronological order
  const weddingEvents: WeddingEvent[] = useMemo(() => [
    {
      name: 'Holud',
      date: '2025-12-16T16:00:00+06:00', // December 16, 4:00 PM
      displayDate: 'December 16, 2025',
      displayTime: 'Tuesday • Starts at 4:00 PM',
      location: 'Dhaka, Bangladesh',
      venue: 'Fortis Platinum Lounge',
      message: 'Until the Holud Ceremony'
    },
    {
      name: 'Akdh',
      date: '2025-12-17T19:00:00+06:00', // December 17, 7:00 PM
      displayDate: 'December 17, 2025',
      displayTime: 'Wednesday • Starts at 7:00 PM',
      location: 'Dhaka, Bangladesh',
      venue: 'Sheraton Dhaka',
      message: 'Until the Wedding Ceremony'
    },
    {
      name: 'Grand Reception',
      date: '2025-12-18T19:00:00+06:00', // December 18, 7:00 PM
      displayDate: 'December 18, 2025',
      displayTime: 'Thursday • Starts at 7:00 PM',
      location: 'Dhaka, Bangladesh',
      venue: 'Bangladesh-China Friendship Conference Centre',
      message: 'Until the Grand Reception'
    }
  ], []);

  useEffect(() => {
    const updateCurrentEvent = () => {
      // Check for mock date in localStorage (for testing purposes)
      const mockDate = typeof window !== 'undefined' ? localStorage.getItem('mockCurrentDate') : null;
      const now = mockDate ? new Date(mockDate).getTime() : new Date().getTime();
      
      // Find the next upcoming event
      let nextEvent: WeddingEvent | null = null;
      for (const event of weddingEvents) {
        const eventTime = new Date(event.date).getTime();
        if (eventTime > now) {
          nextEvent = event;
          break;
        }
      }

      // If no upcoming events, all events are completed
      if (!nextEvent) {
        setAllEventsCompleted(true);
        setCurrentEvent(null);
      } else {
        setAllEventsCompleted(false);
        setCurrentEvent(nextEvent);
      }
    };

    // Update immediately
    updateCurrentEvent();

    // Update every minute to check for event transitions
    const timer = setInterval(updateCurrentEvent, 60000);

    // Also listen for storage changes (when mock date is updated)
    const handleStorageChange = () => {
      updateCurrentEvent();
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
    }

    return () => {
      clearInterval(timer);
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', handleStorageChange);
      }
    };
  }, [weddingEvents]);

  return {
    currentEvent,
    allEventsCompleted,
    weddingEvents
  };
}
