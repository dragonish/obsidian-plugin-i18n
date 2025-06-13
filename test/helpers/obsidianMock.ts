import { noCallThru } from 'proxyquire';

const mockGetLanguage = () => {
  return 'en';
};

export const loadWithMockedObsidian = (modulePath: string) => {
  return noCallThru().load(modulePath, {
    obsidian: {
      getLanguage: mockGetLanguage,
    },
  });
};
