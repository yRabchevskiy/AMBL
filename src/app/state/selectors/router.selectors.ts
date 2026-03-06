import { createFeatureSelector } from '@ngrx/store';
import { RouterReducerState, getRouterSelectors } from '@ngrx/router-store';

// 1. Створюємо базовий селектор для гілки роутера
export const selectRouter = createFeatureSelector<RouterReducerState>('router');

// 2. Експортуємо готові селектори
export const {
  selectCurrentRoute,   // поточний об'єкт route
  selectUrl, // саме той URL (рядок), який тобі потрібен
} = getRouterSelectors(selectRouter);