import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from '@shared/api/baseApi';
import { resumeSelectSlice } from '@entities/resume/model/resume-select-slice';

const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    [resumeSelectSlice.name]: resumeSelectSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

export type { RootState, AppDispatch };
export { store };
