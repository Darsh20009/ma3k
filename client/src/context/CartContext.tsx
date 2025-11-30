import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Service, DiscountCode } from '@shared/schema';

export interface CartItem {
  service: Service;
  quantity: number;
  customization?: string;
}

interface CartContextType {
  items: CartItem[];
  cart: Service[];
  discountCode: DiscountCode | null;
  addToCart: (service: Service, customization?: string) => void;
  removeFromCart: (serviceId: string) => void;
  updateQuantity: (serviceId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  setDiscountCode: (code: DiscountCode | null) => void;
  totalPrice: number;
  discountedPrice: number;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [discountCode, setDiscountCode] = useState<DiscountCode | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // تحميل البيانات من localStorage عند تحميل التطبيق
  useEffect(() => {
    try {
      const savedItems = localStorage.getItem('cartItems');
      const savedDiscount = localStorage.getItem('discountCode');
      
      if (savedItems) {
        setItems(JSON.parse(savedItems));
      }
      if (savedDiscount) {
        setDiscountCode(JSON.parse(savedDiscount));
      }
    } catch (error) {
      console.error('خطأ في تحميل بيانات السلة:', error);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // حفظ العناصر في localStorage كلما تغيرت
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('cartItems', JSON.stringify(items));
    }
  }, [items, isHydrated]);

  // حفظ كود الخصم في localStorage كلما تغير
  useEffect(() => {
    if (isHydrated) {
      if (discountCode) {
        localStorage.setItem('discountCode', JSON.stringify(discountCode));
      } else {
        localStorage.removeItem('discountCode');
      }
    }
  }, [discountCode, isHydrated]);

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
    setDiscountCode(null);
    localStorage.removeItem('cartItems');
    localStorage.removeItem('discountCode');
  };

  const totalPrice = items.reduce((sum, item) => sum + (item.service.price * item.quantity), 0);
  const discountedPrice = discountCode 
    ? Math.round(totalPrice * (100 - discountCode.discountPercentage) / 100)
    : totalPrice;
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const cart = items.map(item => item.service);
  const getTotalPrice = () => discountedPrice;

  return (
    <CartContext.Provider value={{
      items,
      cart,
      discountCode,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalPrice,
      setDiscountCode,
      totalPrice,
      discountedPrice,
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