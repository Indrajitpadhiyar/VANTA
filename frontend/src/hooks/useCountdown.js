import { useState, useEffect } from 'react';

export function useCountdown(initialHours = 2, initialMinutes = 30, initialSeconds = 26) {
  const [timeLeft, setTimeLeft] = useState({
    hours: initialHours,
    minutes: initialMinutes,
    seconds: initialSeconds
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: initialHours, minutes: initialMinutes, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [initialHours, initialMinutes]);

  const formattedHours = String(timeLeft.hours).padStart(2, '0');
  const formattedMinutes = String(timeLeft.minutes).padStart(2, '0');
  const formattedSeconds = String(timeLeft.seconds).padStart(2, '0');

  return {
    ...timeLeft,
    formatted: `${formattedHours}:${formattedMinutes}:${formattedSeconds}`,
    formattedHours,
    formattedMinutes,
    formattedSeconds
  };
}
