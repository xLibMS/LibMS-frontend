import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { userProfileSaga } from './saga';
import { User, UserProfileState } from './types';

export const initialState: UserProfileState = {
  id: '',
  email: '',
  fullName: '',
  universityID: '',
  isAuthenticated: false,
  isFetching: false,
  isSuccess: false,
  isError: false,
  isDone: false,
  errorMessage: '',
};

const slice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {
    requestUserProfile(state, action: PayloadAction<any>) {
      state.isFetching = true;
    },
    fetchProfileSuccess(state, action: PayloadAction<User>) {
      state.isFetching = false;
      state.isSuccess = true;
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.isAuthenticated = true;
      state.isDone = true;
    },
    fetchProfileFailed(state, action: PayloadAction<{ message: string }>) {
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = action.payload.message;
      state.isDone = true;
    },
  },
});

export const { actions: userProfileActions } = slice;

export const useUserProfileSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: userProfileSaga });
  return { actions: slice.actions };
};

/**
 * Example Usage:
 *
 * export function MyComponentNeedingThisSlice() {
 *  const { actions } = useUserProfileSlice();
 *
 *  const onButtonClick = (evt) => {
 *    dispatch(actions.someAction());
 *   };
 * }
 */
