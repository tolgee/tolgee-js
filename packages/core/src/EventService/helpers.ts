import { KeyDescriptorInternal } from '../types';

export const compareDescriptors = (
  descriptor: KeyDescriptorInternal,
  criteria: KeyDescriptorInternal
) => {
  const keyMatches =
    descriptor.key === undefined ||
    criteria.key === undefined ||
    criteria.key === descriptor.key;
  const nsMatches =
    descriptor.ns === undefined ||
    criteria.ns === undefined ||
    descriptor.ns?.findIndex((ns) => criteria.ns?.includes(ns)) !== -1;

  return keyMatches && nsMatches;
};
