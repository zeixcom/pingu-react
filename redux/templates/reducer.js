import { MY_ACTION_TYPE } from '../actions/<%= dashed %>';

const handlers = {
  [MY_ACTION_TYPE]: (state, action) => {
    // Modify state.
    return { ...state };
  },
};

const defaultState = {};

export default function reducer(state = defaultState, action) {
  return handlers[action.type] ? handlers[action.type](state, action) : state;
}
