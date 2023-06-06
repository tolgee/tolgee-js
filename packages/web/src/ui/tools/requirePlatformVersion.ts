export const requirePlatformVersion = (requiredV: string, currentV: string) =>
  requiredV.localeCompare(currentV, 'en', {
    numeric: true,
    sensitivity: 'base',
  }) === -1;
