
import {
  useState,
  useEffect
} from "react";

import foodsData from "../data/food.js";

import {
  calculateDeliveryFee,
  calculateCartSubtotal,
  calculateCartCount,
  getAllowedQuantity
} from "../utils/cartUtils.js";

import { CartContext } from "./cart-context.js";

// Load saved inventory, or use original stock
function getSavedInventory() {
  try {
    const savedInventory = localStorage.getItem("bitebox-inventory");

    if (!savedInventory) {
      return foodsData;
    }

    const parsedInventory = JSON.parse(savedInventory);

    if (!Array.isArray(parsedInventory)) {
      return foodsData;
    }

    return foodsData.map((food) => {
      const savedFood = parsedInventory.find(
        (item) => item.id === food.id
      );

      if (
        savedFood &&
        Number.isInteger(savedFood.stock) &&
        savedFood.stock >= 0
      ) {
        return {
          ...food,
          stock: savedFood.stock
        };
      }

      return food;
    });

  } catch (error) {
    console.error("Error loading inventory:", error);
    return foodsData;
  }
}

// Load previously saved cart using current inventory
function getSavedCart(inventory) {
  try {
    const savedCart = localStorage.getItem("bitebox-cart");

    if (!savedCart) {
      return [];
    }

    const parsedCart = JSON.parse(savedCart);

    if (!Array.isArray(parsedCart)) {
      return [];
    }

    return parsedCart
      .filter((savedItem) => {
        const food = inventory.find(
          (item) => item.id === savedItem.id
        );

        return (
          food &&
          Number.isInteger(savedItem.quantity) &&
          savedItem.quantity >= 1 &&
          savedItem.quantity <= getAllowedQuantity(food.stock)
        );
      })
      .map((savedItem) => {
        const food = inventory.find(
          (item) => item.id === savedItem.id
        );

        return {
          ...food,
          quantity: savedItem.quantity
        };
      });

  } catch (error) {
    console.error("Error loading cart:", error);
    return [];
  }
}

export function CartProvider({ children }) {
  const [inventory, setInventory] = useState(getSavedInventory);

  const [cart, setCart] = useState(
    () => getSavedCart(inventory)
  );

  const [vegetarianOnly, setVegetarianOnly] = useState(false);

  const [lastOrder, setLastOrder] = useState(null);

  // Save inventory whenever stock changes
  useEffect(() => {
    try {
      localStorage.setItem(
        "bitebox-inventory",
        JSON.stringify(inventory)
      );
    } catch (error) {
      console.error("Error saving inventory:", error);
    }
  }, [inventory]);

  // Save cart whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(
        "bitebox-cart",
        JSON.stringify(cart)
      );
    } catch (error) {
      console.error("Error saving cart:", error);
    }
  }, [cart]);

  // Add food to cart
  function addToCart(foodId) {
    const food = inventory.find(
      (item) => item.id === foodId
    );

    if (!food) {
      return {
        success: false,
        message: "Food item not found."
      };
    }

    const existingItem = cart.find(
      (item) => item.id === foodId
    );

    const currentQuantity = existingItem
      ? existingItem.quantity
      : 0;

    const allowedQuantity = getAllowedQuantity(food.stock);

    if (currentQuantity >= allowedQuantity) {
      return {
        success: false,
        message: food.stock === 0
          ? "This food item is out of stock."
          : `Maximum allowed quantity is ${allowedQuantity}.`
      };
    }

    if (existingItem) {
      setCart((previousCart) =>
        previousCart.map((item) =>
          item.id === foodId
            ? {
                ...food,
                quantity: item.quantity + 1
              }
            : item
        )
      );
    } else {
      setCart((previousCart) => [
        ...previousCart,
        {
          ...food,
          quantity: 1
        }
      ]);
    }

    return {
      success: true,
      message: `${food.name} added to cart!`
    };
  }

  // Increase or decrease quantity
  function updateQuantity(foodId, newQuantity) {
    const food = inventory.find(
      (item) => item.id === foodId
    );

    if (!food) return;

    if (newQuantity < 1) {
      removeFromCart(foodId);
      return;
    }

    const allowedQuantity = getAllowedQuantity(food.stock);

    if (newQuantity > allowedQuantity) {
      return {
        success: false,
        message: `Maximum allowed quantity is ${allowedQuantity}.`
      };
    }

    setCart((previousCart) =>
      previousCart.map((item) =>
        item.id === foodId
          ? {
              ...food,
              quantity: newQuantity
            }
          : item
      )
    );

    return {
      success: true
    };
  }

  // Remove item from cart
  function removeFromCart(foodId) {
    setCart((previousCart) =>
      previousCart.filter(
        (item) => item.id !== foodId
      )
    );
  }

  // Calculate cart values
  const cartCount = calculateCartCount(cart);
  const subtotal = calculateCartSubtotal(cart);
  const deliveryFee = calculateDeliveryFee(subtotal);
  const total = subtotal + deliveryFee;

  // Check non-vegetarian items
  const hasNonVegetarianItems = cart.some(
    (item) => !item.vegetarian
  );

  // Place order and reduce stock
  function placeOrder(customerDetails) {
    // Check stock again before confirming the order
    const unavailableItem = cart.find((cartItem) => {
      const food = inventory.find(
        (item) => item.id === cartItem.id
      );

      return (
        !food ||
        cartItem.quantity > food.stock
      );
    });

    if (unavailableItem) {
      return {
        success: false,
        message: `${unavailableItem.name} does not have enough stock. Please update your cart.`
      };
    }

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

    // Reduce available stock
    setInventory((previousInventory) =>
      previousInventory.map((food) => {
        const orderedItem = cart.find(
          (item) => item.id === food.id
        );

        if (!orderedItem) {
          return food;
        }

        return {
          ...food,
          stock: food.stock - orderedItem.quantity
        };
      })
    );

    setLastOrder(order);
    setCart([]);

    try {
      localStorage.removeItem("bitebox-cart");
    } catch (error) {
      console.error("Error clearing saved cart:", error);
    }

    return {
      success: true,
      order
    };
  }

  const value = {
    foods: inventory,
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
