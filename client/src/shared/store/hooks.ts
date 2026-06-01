import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './index';

const useAppDispatch = () => useDispatch<AppDispatch>();
const useAppSelector = <T>(selector: (state: RootState) => T) =>
  useSelector(selector);

export { useAppDispatch, useAppSelector };
