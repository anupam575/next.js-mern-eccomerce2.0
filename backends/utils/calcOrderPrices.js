export const calcOrderPrices = (
  items,
  taxRate = 0.18 // 18% GST
) => {
  // 🛑 Safety check
  if (!Array.isArray(items) || items.length === 0) {
    console.warn("⚠️ calcOrderPrices: items array empty or invalid", items);
    return {
      itemsPrice: 0,
      taxPrice: 0,
      shippingFee: 0,
      totalPrice: 0,
    };
  }

  // 1️⃣ Items total
  const itemsPrice = items.reduce((acc, item, index) => {
    const price = Number(item.price ?? item.product?.price);
    const qty = Number(item.quantity);

    if (isNaN(price) || isNaN(qty)) {
      console.warn(`⚠️ Invalid item at index ${index}:`, item);
      return acc;
    }

    return acc + price * qty;
  }, 0);

  // 2️⃣ SHIPPING LOGIC (AMAZON STYLE)
  let shippingFee = 0;

  if (itemsPrice === 0) {
    shippingFee = 0;
  } else if (itemsPrice > 500) {
    shippingFee = 0; // ✅ Free delivery above ₹500
  } else {
    shippingFee = 50; // ✅ Flat shipping below ₹500
  }

  // 3️⃣ TAX
  const taxPrice = +(itemsPrice * taxRate).toFixed(2);

  // 4️⃣ GRAND TOTAL
  const totalPrice = +(itemsPrice + taxPrice + shippingFee).toFixed(2);

  console.log("✅ calcOrderPrices result:", {
    itemsPrice,
    taxPrice,
    shippingFee,
    totalPrice,
  });

  return {
    itemsPrice,
    taxPrice,
    shippingFee,
    totalPrice,
  };
};
