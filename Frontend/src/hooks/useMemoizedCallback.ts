import { useMemo, useCallback, DependencyList } from 'react';

/**
 * Custom hook that combines useMemo and useCallback
 * Useful for memoizing both values and callback functions
 */
export function useMemoizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: DependencyList
): T {
  return useCallback(callback, deps) as T;
}

/**
 * Memoize a value with deep comparison
 */
export function useMemoizedValue<T>(value: T, deps: DependencyList): T {
  return useMemo(() => value, deps);
}
