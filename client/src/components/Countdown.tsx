'use client';

import { useState, useEffect, useMemo } from 'react';
import { HeartIcon } from '@heroicons/react/24/outline'

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface WeddingEvent {
  name: string;
  date: string;
  message: string;
}

interface CountdownProps {
  className?: string;
}

export default function Countdown({ className = '' }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [currentEvent, setCurrentEvent] = useState<WeddingEvent | null>(null);
  const [allEventsCompleted, setAllEventsCompleted] = useState(false);

  // Define all wedding events in chronological order
  const weddingEvents: WeddingEvent[] = useMemo(() => [
    {
      name: 'Holud',
      date: '2025-12-16T16:00:00+06:00', // December 16, 4:00 PM
      message: 'Until the Holud Ceremony'
    },
    {
      name: 'Akdh',
      date: '2025-12-17T19:00:00+06:00', // December 17, 7:00 PM
      message: 'Until the Wedding Ceremony'
    },
    {
      name: 'Grand Reception',
      date: '2025-12-18T19:00:00+06:00', // December 18, 7:00 PM
      message: 'Until the Grand Reception'
    }
  ], []);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      
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
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      // Calculate time remaining to next event
      setCurrentEvent(nextEvent);
      const target = new Date(nextEvent.date).getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    // Calculate immediately
    calculateTimeLeft();

    // Update every second
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [weddingEvents]);

  if (allEventsCompleted) {
    return (
      <div className={`text-center ${className}`}>
        <div className="animate-floatIn">
          <h3 className="text-2xl sm:text-3xl font-serif font-semibold text-secondary mb-2 inline-flex items-center gap-2">
            <HeartIcon className="h-7 w-7 text-primary" />
            We&apos;re Married!
          </h3>
          <p className="text-lg text-muted">
            Thank you for celebrating with us
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`text-center ${className}`}>
      <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-sm mx-auto">
        <div className="bg-white rounded-lg p-2.5 sm:p-3 border border-cream-200 shadow-sm">
          <div className="text-xl sm:text-2xl font-semibold text-secondary">
            {timeLeft.days}
          </div>
          <div className="text-[10px] sm:text-xs text-muted font-medium tracking-wide">
            {timeLeft.days === 1 ? 'Day' : 'Days'}
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-2.5 sm:p-3 border border-cream-200 shadow-sm">
          <div className="text-xl sm:text-2xl font-semibold text-secondary">
            {timeLeft.hours.toString().padStart(2, '0')}
          </div>
          <div className="text-[10px] sm:text-xs text-muted font-medium tracking-wide">
            {timeLeft.hours === 1 ? 'Hour' : 'Hours'}
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-2.5 sm:p-3 border border-cream-200 shadow-sm">
          <div className="text-xl sm:text-2xl font-semibold text-secondary">
            {timeLeft.minutes.toString().padStart(2, '0')}
          </div>
          <div className="text-[10px] sm:text-xs text-muted font-medium tracking-wide">
            {timeLeft.minutes === 1 ? 'Min' : 'Mins'}
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-2.5 sm:p-3 border border-cream-200 shadow-sm">
          <div className="text-xl sm:text-2xl font-semibold text-secondary">
            {timeLeft.seconds.toString().padStart(2, '0')}
          </div>
          <div className="text-[10px] sm:text-xs text-muted font-medium tracking-wide">
            {timeLeft.seconds === 1 ? 'Sec' : 'Secs'}
          </div>
        </div>
      </div>
      
      {currentEvent && (
        <p className="text-sm text-muted mt-3 font-medium inline-flex items-center gap-2">
          <HeartIcon className="h-4 w-4 text-primary" />
          {currentEvent.message}
        </p>
      )}
    </div>
  );
}