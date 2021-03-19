const initialState = {
  count: 0,
};

// reducer 在store/index.js中import然后combineReducers
export default (state = initialState, action) => {
  switch (action.type) {
    case 'apple/incrementCount':
      return {
        ...state,
        count: state.count + action.count,
      };
    // case 'test':
    // return Object.assign({}, state, {count: state.count + action.count})
    default:
      return state;
  }
};

export const actions = {
  incrementCount: (count) => {
    // redux-thunk
    return (dispatch, getState) => {
      // axios.get(urls.xxx).then(res => {
      dispatch({
        type: 'apple/incrementCount',
        count: count,
      });
      // })
    };
  },
};
