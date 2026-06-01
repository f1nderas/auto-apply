import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE } from '@shared/config/api';

const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE }),
  tagTypes: ['ActiveSession', 'History', 'Profiles'],
  endpoints: () => ({}),
});

export { baseApi };
