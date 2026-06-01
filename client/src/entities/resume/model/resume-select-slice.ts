import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@shared/store';

interface ResumeSelectState {
  selectedHashes: string[];
}

const initialState: ResumeSelectState = { selectedHashes: [] };

const resumeSelectSlice = createSlice({
  name: 'resumeSelect',
  initialState,
  reducers: {
    toggleHash(state, { payload }: PayloadAction<string>) {
      const idx = state.selectedHashes.indexOf(payload);
      if (idx >= 0) {
        state.selectedHashes.splice(idx, 1);
      } else {
        state.selectedHashes.push(payload);
      }
    },
    clearSelection(state) {
      state.selectedHashes = [];
    },
  },
});

const selectSelectedHashes = (state: RootState) =>
  state.resumeSelect.selectedHashes;

const { toggleHash, clearSelection } = resumeSelectSlice.actions;

export { resumeSelectSlice, toggleHash, clearSelection, selectSelectedHashes };
