
import { createContext, useContext, useState } from "react";
import foods from "../data/food.js";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [vegetarianOnly, setVegetarianOnly] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);

  // Add food to cart
  function addToCart(foodId) {
    const food = foods.find((item) => item.id === foodId);

    if (!food) {
      return { success: false, message: "Food item not found." };
    }

    const existingItem = cart.find((item) => item.id === foodId);
    const currentQuantity = existingItem ? existingItem.quantity : 0;

    if (currentQuantity >= 5) {
      return {
        success: false,
        message: "Maximum 5 units of one item are allowed."
      };
    }

    if (currentQuantity >= food.stock) {
      return {
        success: false,
        message: "Sorry, this item is out of stock."
      };
    }

    if (existingItem) {
      setCart((previousCart) =>
        previousCart.map((item) =>
          item.id === foodId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart((previousCart) => [
        ...previousCart,
        { ...food, quantity: 1 }
      ]);
    }

    return { success: true, message: `${food.name} added to cart!` };
  }

  // Increase or decrease quantity
  function updateQuantity(foodId, newQuantity) {
    const food = foods.find((item) => item.id === foodId);

    if (!food) return;

    if (newQuantity < 1) {
      removeFromCart(foodId);
      return;
    }

    const allowedQuantity = Math.min(5, food.stock);

    if (newQuantity > allowedQuantity) {
      return {
        success: false,
        message: `Maximum allowed quantity is ${allowedQuantity}.`
      };
    }

    setCart((previousCart) =>
      previousCart.map((item) =>
        item.id === foodId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );

    return { success: true };
  }

  // Remove item completely
  function removeFromCart(foodId) {
    setCart((previousCart) =>
      previousCart.filter((item) => item.id !== foodId)
    );
  }

  // Calculate total number of items
  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Calculate subtotal
  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Delivery fee: free at Rs. 1500 or above
  const deliveryFee = subtotal === 0 || subtotal >= 1500 ? 0 : 150;

  const total = subtotal + deliveryFee;

  // Check vegetarian-only preference
  const hasNonVegetarianItems = cart.some(
    (item) => !item.vegetarian
  );

  // Save order and empty cart
  function placeOrder(customerDetails) {
    const order = {
      id: `BB${Date.now()}`,
      items: [...cart],
      customer: customerDetails,
      subtotal,
      deliveryFee,
      total,
      vegetarianOnly,
      date: new Date().toLocaleString()
    };

    setLastOrder(order);
    setCart([]);

    return order;
  }

  const value = {
    cart,
    cartCount,
    subtotal,
    deliveryFee,
    total,
    vegetarianOnly,
    setVegetarianOnly,
    hasNonVegetarianItems,
    lastOrder,
    addToCart,
    updateQuantity,
    removeFromCart,
    placeOrder
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// Use this hook in other components
export function useCart() {
  return useContext(CartContext);
}
