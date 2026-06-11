import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { Product } from '../app/components/Product/data';

// ─── Types ────────────────────────────────────────────────────
type StepType = 'hero' | 'selection' | 'produk' | 'layanan';

interface ProductState {
  step: StepType;
  currentProductIndex: number;
  selectedProduct: Product | null;
  selectedService: any;
  filters: ProductFilters;
}

interface ProductFilters {
  category: string;
  priceRange: [number, number];
  searchQuery: string;
}

interface ProductContextType {
  state: ProductState;
  setStep: (step: StepType) => void;
  setCurrentProductIndex: (index: number) => void;
  setSelectedProduct: (product: Product | null) => void;
  setSelectedService: (service: any) => void;
  setFilters: (filters: Partial<ProductFilters>) => void;
  resetFilters: () => void;
}

// ─── Context ──────────────────────────────────────────────────
const ProductContext = createContext<ProductContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────
interface ProductProviderProps {
  children: ReactNode;
}

export function ProductProvider({ children }: ProductProviderProps) {
  const [state, setState] = useState<ProductState>({
    step: 'hero',
    currentProductIndex: 0,
    selectedProduct: null,
    selectedService: null,
    filters: {
      category: 'all',
      priceRange: [0, 1000000],
      searchQuery: '',
    },
  });

  const setStep = useCallback((step: StepType) => {
    setState(prev => ({ ...prev, step }));
  }, []);

  const setCurrentProductIndex = useCallback((index: number) => {
    setState(prev => ({ ...prev, currentProductIndex: index }));
  }, []);

  const setSelectedProduct = useCallback((product: Product | null) => {
    setState(prev => ({ ...prev, selectedProduct: product }));
  }, []);

  const setSelectedService = useCallback((service: any) => {
    setState(prev => ({ ...prev, selectedService: service }));
  }, []);

  const setFilters = useCallback((filters: Partial<ProductFilters>) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, ...filters },
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setState(prev => ({
      ...prev,
      filters: {
        category: 'all',
        priceRange: [0, 1000000],
        searchQuery: '',
      },
    }));
  }, []);

  return (
    <ProductContext.Provider
      value={{
        state,
        setStep,
        setCurrentProductIndex,
        setSelectedProduct,
        setSelectedService,
        setFilters,
        resetFilters,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

// ─── Hook ──────────────────────────────────────────────────────
export function useProductContext() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProductContext must be used within a ProductProvider');
  }
  return context;
}
