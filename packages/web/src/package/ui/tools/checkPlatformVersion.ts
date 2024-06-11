const SEMVER_REGEX = /^v[0-9]+\.[0-9]+\.[0-9]+$/;

export const checkPlatformVersion = (
  requiredV: string,
  currentV: string | undefined
) => {
  if (!currentV || !SEMVER_REGEX.test(currentV)) {
    return undefined;
  }
  const result = requiredV.localeCompare(currentV, 'en', {
    numeric: true,
    sensitivity: 'base',
  });

  if (result > 0) {
    return new Error(
      `Requires minimal platform version ${requiredV} (got ${currentV})`
    );
  }
  return undefined;
};
