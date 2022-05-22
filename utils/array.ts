export const getRange = (begin: number, end: number) => {
  return (new Array(end - begin)).fill(null).map((_, index) => index + begin);
};
