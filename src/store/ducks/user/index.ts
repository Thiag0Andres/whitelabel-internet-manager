import { Reducer } from 'redux';
import SimpleCrypto from 'simple-crypto-js';
import { defaultUser } from '../../../constants/defaultUser';
import { UserState, UserTypes, User } from './types';

const { REACT_APP_LOCAL_STORAGE_CRYPTO_KEY, REACT_APP_LOCAL_STORAGE_USER } =
  process.env;

export const simpleCrypto = new SimpleCrypto(
  String(REACT_APP_LOCAL_STORAGE_CRYPTO_KEY),
);

const userLogin: User = localStorage.getItem(
  String(REACT_APP_LOCAL_STORAGE_USER) || '{}',
)
  ? (simpleCrypto.decrypt(
      localStorage.getItem(String(REACT_APP_LOCAL_STORAGE_USER) || '{}') ||
        '{}',
    ) as User)
  : defaultUser;

const INITIAL_STATE: UserState = {
  user: userLogin,
};

const reducer: Reducer<UserState> = (state = INITIAL_STATE, action) => {
  const updatedUserState = state;

  switch (action.type) {
    case UserTypes.UPDATE_USER:
      updatedUserState.user = action.payload;
      localStorage.setItem(
        String(REACT_APP_LOCAL_STORAGE_USER),
        simpleCrypto.encrypt(action.payload),
      );

      return { ...state, ...updatedUserState };

    case UserTypes.REMOVE_USER:
      // remover dados do usuario e token do localstorage
      localStorage.removeItem(String(REACT_APP_LOCAL_STORAGE_USER));
      // resetar estado do usario
      INITIAL_STATE.user = defaultUser;

      return { ...state, ...INITIAL_STATE };

    default:
      return state;
  }
};

export default reducer;
