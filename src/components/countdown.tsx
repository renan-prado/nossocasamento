'use client';

import { useTimer } from 'react-timer-hook';

interface CountdownProps {
  expiryTimestamp: Date;
}

export function Countdown({ expiryTimestamp }: CountdownProps) {
  const { seconds, minutes, hours, days } = useTimer({
    expiryTimestamp,
    onExpire: () => console.log('Chegou o grande dia!'),
  });

  const formatNumber = (num: number) => String(num).padStart(2, '0');

  return (
    <div className="flex flex-col text-green-foreground font-serif items-center justify-center gap-3">

      <div className="flex flex-wrap justify-center gap-3 text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
        <div className="flex flex-col items-center gap-2">
        <span className="tabular-nums">{formatNumber(days)}</span>
          <span className="text-xs sm:text-sm font-normal text-muted-foreground">
            dias
          </span>
        </div>
        <span className="text-muted-foreground text-3xl sm:text-4xl md:text-5xl">:</span>
        <div className="flex flex-col items-center gap-2">
          <span className="tabular-nums">{formatNumber(hours)}</span>
          <span className="text-xs sm:text-sm font-normal text-muted-foreground">
            horas
          </span>
        </div>
        <span className="text-muted-foreground text-3xl sm:text-4xl md:text-5xl">:</span>
        <div className="flex flex-col items-center gap-2">
          <span className="tabular-nums">{formatNumber(minutes)}</span>
          <span className="text-xs sm:text-sm font-normal text-muted-foreground">
            minutos
          </span>
        </div>
        <span className="hidden sm:inline text-muted-foreground text-3xl sm:text-4xl md:text-5xl">:</span>
        <div className="hidden sm:flex flex-col items-center gap-2">
          <span className="tabular-nums">{formatNumber(seconds)}</span>
          <span className="text-xs sm:text-sm font-normal text-muted-foreground">
            segundos
          </span>
        </div>
      </div>
    </div>
  );
}