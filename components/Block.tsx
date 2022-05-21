import clsx from 'clsx';
import { FC, useMemo } from 'react';

interface Props {
  power: number
}

const colors = [
  'bg-lime-600',
  'bg-sky-600',
  'bg-rose-600',
  'bg-blue-600',
  'bg-amber-600',
  'bg-green-600',
  'bg-red-600',
  'bg-yellow-600',
  'bg-violet-600',
  'bg-cyan-600',
  'bg-indigo-600',
  'bg-fuchsia-600',
  'bg-purple-600',
  'bg-emerald-600',
  'bg-teal-600',
  'bg-pink-600',
  'bg-orange-600',
];

export const Block: FC<Props> = ({ power }) => {
  const color = useMemo(() => colors[power % colors.length], [power]);

  const value = useMemo(() => {
    const unformattedValue = 2 ** power;
    if (unformattedValue > 10e8) return `${Math.floor(unformattedValue / 10e8)}G`;
    if (unformattedValue > 10e5) return `${Math.floor(unformattedValue / 10e5)}M`;
    if (unformattedValue > 10e3) return `${Math.floor(unformattedValue / 10e2)}K`;
    return String(unformattedValue);
  }, [power]);

  return <div className={clsx('flex items-center justify-center w-16 h-16 rounded-lg text-xl font-semibold text-white', color)}>{value}</div>;
};
