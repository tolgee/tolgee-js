import { InvisibleObserver } from '../InvisibleObserver';
import { TextObserver } from '../TextObserver';
import { testObserver } from './testObserver';
import { testRetranslate } from './testRetranslate';

describe('invisble observer', () => {
  testObserver(InvisibleObserver());
});

describe('text observer', () => {
  testObserver(TextObserver());
  testRetranslate(TextObserver());
});
