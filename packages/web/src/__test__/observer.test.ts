import { testObserver } from './testObserver';
import { testRetranslate } from './testRetranslate';

describe('invisble observer', () => {
  testObserver('invisible');
});

describe('text observer', () => {
  testObserver('text');
  testRetranslate('text');
});
