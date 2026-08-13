import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// ─── Types ────────────────────────────────────────────────────
type Theme = 'light' | 'dark' | 'system';

interface AppState {
  theme: Theme;
  sidebarOpen: boolean;
  cart: CartItem[];
  notifications: Notification[];
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timestamp: number;
}

interface AppContextType {
  state: AppState;
  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateCartQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
}

// ─── Context ──────────────────────────────────────────────────
const AppContext = createContext<AppContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────
interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, setState] = useState<AppState>({
    theme: 'system',
    sidebarOpen: false,
    cart: [],
    notifications: [],
  });

  const setTheme = useCallback((theme: Theme) => {
    setState(prev => ({ ...prev, theme }));
  }, []);

  const toggleSidebar = useCallback(() => {
    setState(prev => ({ ...prev, sidebarOpen: !prev.sidebarOpen }));
  }, []);

  const addToCart = useCallback((item: Omit<CartItem, 'quantity'>) => {
    setState(prev => {
      const existingIndex = prev.cart.findIndex(i => i.id === item.id);
      if (existingIndex >= 0) {
        const newCart = [...prev.cart];
        newCart[existingIndex] = {
          ...newCart[existingIndex],
          quantity: newCart[existingIndex].quantity + 1,
        };
        return { ...prev, cart: newCart };
      }
      return { ...prev, cart: [...prev.cart, { ...item, quantity: 1 }] };
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      cart: prev.cart.filter(item => item.id !== id),
    }));
  }, []);

  const updateCartQuantity = useCallback((id: string, quantity: number) => {
    setState(prev => {
      if (quantity <= 0) {
        return {
          ...prev,
          cart: prev.cart.filter(item => item.id !== id),
        };
      }
      return {
        ...prev,
        cart: prev.cart.map(item =>
          item.id === id ? { ...item, quantity } : item
        ),
      };
    });
  }, []);

  const clearCart = useCallback(() => {
    setState(prev => ({ ...prev, cart: [] }));
  }, []);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const id = Math.random().toString(36).substring(7);
    setState(prev => ({
      ...prev,
      notifications: [
        ...prev.notifications,
        { ...notification, id, timestamp: Date.now() },
      ],
    }));
  }, []);

  const removeNotification = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.filter(n => n.id !== id),
    }));
  }, []);

  return (
    <AppContext.Provider
      value={{
        state,
        setTheme,
        toggleSidebar,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        addNotification,
        removeNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// ─── Hook ──────────────────────────────────────────────────────
export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
