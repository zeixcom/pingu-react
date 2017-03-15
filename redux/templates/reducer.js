import { Record } from 'immutable';

import { MY_ACTION_TYPE } from '../actions/<%= dashed %>';

const handlers = {
  [MY_ACTION_TYPE]: (state, action) => {
    // Modify state.
    return Record(state);
  },
};

const defaultState = Record({});

export default function reducer(state = defaultState, action) {
  return handlers[action.type] ? handlers[action.type](state, action) : state;
}
