import { clearToken } from 'app/services/auth/tokens.service';
import { call, put, takeLatest } from 'redux-saga/effects';
import { useLogoutActions as actions, useLogoutActions } from '.';

export function* logoutUserSaga(action) {
  try {
    yield call(clearToken);
    yield put(useLogoutActions.logoutSuccess());
  } catch (error) {
    yield put(
      useLogoutActions.logoutFailed({
        message: 'Logout failed: Please retry',
      }),
    );
  }
}

export function* watchUserLogout() {
  yield takeLatest(actions.requestLogout.type, logoutUserSaga);
}
