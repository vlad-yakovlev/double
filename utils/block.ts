export const getBlockColor = (colors: string[], power: number) => {
  return colors[power % colors.length];
};

export const getBlockValue = (power: number) => {
  const unformattedValue = 2 ** power;
  if (unformattedValue > 10e8) return `${Math.floor(unformattedValue / 10e8)}G`;
  if (unformattedValue > 10e5) return `${Math.floor(unformattedValue / 10e5)}M`;
  if (unformattedValue > 10e3) return `${Math.floor(unformattedValue / 10e2)}K`;
  return String(unformattedValue);
};
