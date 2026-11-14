
import test from "node:test";
import assert from "node:assert/strict";

import {
  calculateDeliveryFee,
  calculateCartSubtotal,
  calculateCartCount,
  getAllowedQuantity
} from "./cartUtils.js";

// Test 1: Delivery fee
test("Delivery fee should be zero for an empty cart", () => {
  assert.equal(calculateDeliveryFee(0), 0);
});

test("Delivery fee should be 150 below Rs. 1500", () => {
  assert.equal(calculateDeliveryFee(1000), 150);
});

test("Delivery should be free at Rs. 1500 or above", () => {
  assert.equal(calculateDeliveryFee(1500), 0);
  assert.equal(calculateDeliveryFee(2000), 0);
});

// Test 2: Cart subtotal
test("Cart subtotal should calculate correctly", () => {
  const cart = [
    { price: 500, quantity: 2 },
    { price: 300, quantity: 1 }
  ];

  assert.equal(calculateCartSubtotal(cart), 1300);
});

// Test 3: Cart item count
test("Cart count should calculate total quantities", () => {
  const cart = [
    { quantity: 2 },
    { quantity: 3 }
  ];

  assert.equal(calculateCartCount(cart), 5);
});

// Test 4: Maximum allowed quantity
test("Maximum quantity should never exceed 5 or available stock", () => {
  assert.equal(getAllowedQuantity(10), 5);
  assert.equal(getAllowedQuantity(3), 3);
  assert.equal(getAllowedQuantity(5), 5);
});

test("Empty stock should allow zero quantity", () => {
  assert.equal(getAllowedQuantity(0), 0);
});
