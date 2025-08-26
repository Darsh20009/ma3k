import { createContext, useContext, useState, ReactNode } from 'react';
import type { Service } from '@shared/schema';

export interface CartItem {
  service: Service;
  quantity: number;
  customization?: string;
}

interface CartContextType {
  items: CartItem[];
  cart: Service[];
  addToCart: (service: Service, customization?: string) => void;
  removeFromCart: (serviceId: string) => void;
  updateQuantity: (serviceId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  totalPrice: number;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (service: Service, customization?: string) => {
    setItems(current => {
      const existingItem = current.find(item => item.service.id === service.id);
      
      if (existingItem) {
        return current.map(item =>
          item.service.id === service.id
            ? { ...item, quantity: item.quantity + 1, customization }
            : item
        );
      }
      
      return [...current, { service, quantity: 1, customization }];
    });
  };

  const removeFromCart = (serviceId: string) => {
    setItems(current => current.filter(item => item.service.id !== serviceId));
  };

  const updateQuantity = (serviceId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(serviceId);
      return;
    }
    
    setItems(current =>
      current.map(item =>
        item.service.id === serviceId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalPrice = items.reduce((sum, item) => sum + (item.service.price * item.quantity), 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const cart = items.map(item => item.service);
  const getTotalPrice = () => totalPrice;

  return (
    <CartContext.Provider value={{
      items,
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalPrice,
      totalPrice,
      totalItems
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}