import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { API_BASE } from '@shared/config/api';

interface ApplyResult {
  vacancyId: string;
  vacancyName: string;
  resumeHash: string;
  success: boolean;
}

interface AutoApplySocketState {
  isRunning: boolean;
  done: number;
  total: number;
  results: ApplyResult[];
  error: string | null;
}

const INITIAL_STATE: AutoApplySocketState = {
  isRunning: false,
  done: 0,
  total: 0,
  results: [],
  error: null,
};

const useAutoApplySocket = () => {
  const [state, setState] = useState<AutoApplySocketState>(INITIAL_STATE);

  useEffect(() => {
    const socket = io(API_BASE);

    // Текущий статус при (пере)подключении
    socket.on('status', ({ isRunning, done, total }: { isRunning: boolean; done: number; total: number }) => {
      setState((s) => ({ ...s, isRunning, done, total }));
    });

    // Обновление прогресса после каждого отклика
    socket.on('progress', ({ done, total }: { done: number; total: number }) => {
      setState((s) => ({ ...s, isRunning: true, done, total, error: null }));
    });

    // Результат отдельного отклика
    socket.on('apply:result', (result: ApplyResult) => {
      setState((s) => ({ ...s, results: [result, ...s.results] }));
    });

    // Задача завершена (штатно или через stop)
    socket.on('done', ({ done, total }: { done: number; total: number }) => {
      setState((s) => ({ ...s, isRunning: false, done, total }));
    });

    // Критическая ошибка — задача прервана
    socket.on('error', ({ message }: { message: string }) => {
      setState((s) => ({ ...s, isRunning: false, error: message }));
    });

    return () => { socket.disconnect(); };
  }, []);

  const reset = () => setState(INITIAL_STATE);

  return { ...state, reset };
};

export { useAutoApplySocket };
export type { ApplyResult };
