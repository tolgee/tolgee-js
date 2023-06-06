export const requirePlatformVersion = (requiredV: string, currentV: string) => {
  const result = requiredV.localeCompare(currentV, 'en', {
    numeric: true,
    sensitivity: 'base',
  });

  return result <= 0;
};
