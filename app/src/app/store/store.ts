import { configureStore } from "@reduxjs/toolkit";
import { authenticateApis } from "../slices/authenticate";
import { generateLinkApi } from "../slices/link";

const store = configureStore({
  reducer: {
    authenticateApis: authenticateApis.reducer,
    generateLinkApi: generateLinkApi.reducer,
  },
  middleware : (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authenticateApis.middleware,
      generateLinkApi.middleware
    ),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
