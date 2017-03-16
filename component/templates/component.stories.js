import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

import { <%= proper %> } from './';

storiesOf('<%= proper %>', module)
  .add('default', () => (
    <<%= proper %> />
  ))
;
