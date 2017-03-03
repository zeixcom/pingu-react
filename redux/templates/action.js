const MY_ACTION_TYPE = 'MY_ACTION_TYPE';
const RECEIVED_MY_ACTION_TYPE = 'RECEIVED_MY_ACTION_TYPE';

export const createMyActionType = () => ({
  type: MY_ACTION_TYPE,
});

export const receivedMyActionType = payload => ({
  type: RECEIVED_MY_ACTION_TYPE,
  payload,
});
