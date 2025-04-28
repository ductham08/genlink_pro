import { configureStore } from "@reduxjs/toolkit";
import { authenticateApis } from "../slices/authenticate";
import { generateLinkApi } from "../slices/link";
import { userApi } from '../slices/userSlice';

const store = configureStore({
  reducer: {
    [authenticateApis.reducerPath]: authenticateApis.reducer,
    [generateLinkApi.reducerPath]: generateLinkApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authenticateApis.middleware,
      generateLinkApi.middleware,
      userApi.middleware
    ),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
