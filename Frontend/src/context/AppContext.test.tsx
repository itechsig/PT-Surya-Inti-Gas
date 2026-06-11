import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { AppProvider, useAppContext } from './AppContext';

describe('AppContext', () => {
  it('should provide default state', () => {
    const { result } = renderHook(() => useAppContext(), {
      wrapper: AppProvider,
    });

    expect(result.current.state.theme).toBe('system');
    expect(result.current.state.sidebarOpen).toBe(false);
    expect(result.current.state.cart).toEqual([]);
    expect(result.current.state.notifications).toEqual([]);
  });

  it('should set theme', () => {
    const { result } = renderHook(() => useAppContext(), {
      wrapper: AppProvider,
    });

    act(() => {
      result.current.setTheme('dark');
    });

    expect(result.current.state.theme).toBe('dark');
  });

  it('should toggle sidebar', () => {
    const { result } = renderHook(() => useAppContext(), {
      wrapper: AppProvider,
    });

    act(() => {
      result.current.toggleSidebar();
    });

    expect(result.current.state.sidebarOpen).toBe(true);

    act(() => {
      result.current.toggleSidebar();
    });

    expect(result.current.state.sidebarOpen).toBe(false);
  });

  it('should add item to cart', () => {
    const { result } = renderHook(() => useAppContext(), {
      wrapper: AppProvider,
    });

    act(() => {
      result.current.addToCart({
        id: '1',
        name: 'Test Product',
        price: 100,
      });
    });

    expect(result.current.state.cart).toHaveLength(1);
    expect(result.current.state.cart[0]).toEqual({
      id: '1',
      name: 'Test Product',
      price: 100,
      quantity: 1,
    });
  });

  it('should update quantity when adding existing item', () => {
    const { result } = renderHook(() => useAppContext(), {
      wrapper: AppProvider,
    });

    act(() => {
      result.current.addToCart({
        id: '1',
        name: 'Test Product',
        price: 100,
      });
    });

    act(() => {
      result.current.addToCart({
        id: '1',
        name: 'Test Product',
        price: 100,
      });
    });

    expect(result.current.state.cart).toHaveLength(1);
    expect(result.current.state.cart[0].quantity).toBe(2);
  });

  it('should remove item from cart', () => {
    const { result } = renderHook(() => useAppContext(), {
      wrapper: AppProvider,
    });

    act(() => {
      result.current.addToCart({
        id: '1',
        name: 'Test Product',
        price: 100,
      });
    });

    act(() => {
      result.current.removeFromCart('1');
    });

    expect(result.current.state.cart).toHaveLength(0);
  });

  it('should update cart quantity', () => {
    const { result } = renderHook(() => useAppContext(), {
      wrapper: AppProvider,
    });

    act(() => {
      result.current.addToCart({
        id: '1',
        name: 'Test Product',
        price: 100,
      });
    });

    act(() => {
      result.current.updateCartQuantity('1', 5);
    });

    expect(result.current.state.cart[0].quantity).toBe(5);
  });

  it('should remove item when quantity is 0', () => {
    const { result } = renderHook(() => useAppContext(), {
      wrapper: AppProvider,
    });

    act(() => {
      result.current.addToCart({
        id: '1',
        name: 'Test Product',
        price: 100,
      });
    });

    act(() => {
      result.current.updateCartQuantity('1', 0);
    });

    expect(result.current.state.cart).toHaveLength(0);
  });

  it('should clear cart', () => {
    const { result } = renderHook(() => useAppContext(), {
      wrapper: AppProvider,
    });

    act(() => {
      result.current.addToCart({
        id: '1',
        name: 'Test Product',
        price: 100,
      });
      result.current.addToCart({
        id: '2',
        name: 'Test Product 2',
        price: 200,
      });
    });

    act(() => {
      result.current.clearCart();
    });

    expect(result.current.state.cart).toHaveLength(0);
  });

  it('should add notification', () => {
    const { result } = renderHook(() => useAppContext(), {
      wrapper: AppProvider,
    });

    act(() => {
      result.current.addNotification({
        message: 'Test notification',
        type: 'success',
      });
    });

    expect(result.current.state.notifications).toHaveLength(1);
    expect(result.current.state.notifications[0].message).toBe('Test notification');
    expect(result.current.state.notifications[0].type).toBe('success');
    expect(result.current.state.notifications[0].id).toBeDefined();
    expect(result.current.state.notifications[0].timestamp).toBeDefined();
  });

  it('should remove notification', () => {
    const { result } = renderHook(() => useAppContext(), {
      wrapper: AppProvider,
    });

    act(() => {
      result.current.addNotification({
        message: 'Test notification',
        type: 'success',
      });
    });

    const notificationId = result.current.state.notifications[0].id;

    act(() => {
      result.current.removeNotification(notificationId);
    });

    expect(result.current.state.notifications).toHaveLength(0);
  });

  it('should throw error when useAppContext is used outside provider', () => {
    expect(() => {
      renderHook(() => useAppContext());
    }).toThrow('useAppContext must be used within an AppProvider');
  });
});
