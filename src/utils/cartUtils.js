
export function calculateDeliveryFee(subtotal) {
  return subtotal === 0 || subtotal >= 1500 ? 0 : 150;
}

export function calculateCartSubtotal(cart) {
  return cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
}

export function calculateCartCount(cart) {
  return cart.reduce(
    (total, item) => total + item.quantity,
    0
  );
}

export function getAllowedQuantity(stock) {
  return Math.min(5, stock);
}
