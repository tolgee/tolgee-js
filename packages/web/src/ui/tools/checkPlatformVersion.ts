export const checkPlatformVersion = (
  requiredV: string,
  currentV: string | undefined
) => {
  if (!currentV || currentV === '??' || currentV === 'local') {
    return undefined;
  }
  const result = requiredV.localeCompare(currentV, 'en', {
    numeric: true,
    sensitivity: 'base',
  });

  if (result > 0) {
    return `Requires minimal platform version ${requiredV} (got ${currentV})`;
  }
  return undefined;
};
