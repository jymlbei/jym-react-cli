import { combineReducers } from 'redux';
import apple from './modules/apple';
import orange from './modules/orange';

export default combineReducers({
  apple,
  orange,
});
