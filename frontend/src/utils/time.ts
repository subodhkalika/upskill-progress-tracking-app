export const formatTime = (time: number) => {
  const hours = Math.floor(time);
  const minutes = Math.floor((time - hours) * 60);
  return `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`;
};