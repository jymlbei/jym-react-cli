const initialState = {
  count: 0,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'orange/incrementCount':
      return {
        ...state,
        count: state.count + action.count,
      };
    default:
      return state;
  }
};

export const actions = {
  incrementCount: (count) => {
    return (dispatch, getState) => {
      dispatch({
        type: 'orange/incrementCount',
        count: count,
      });
    };
  },
};
