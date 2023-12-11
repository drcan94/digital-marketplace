"use client";

import { useCart } from "@/hooks/use-cart";
import { useEffect, useState } from "react";

const ItemQuantity = ({ productId }: { productId: string }) => {
  const { items } = useCart();
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // product quantity with find method
  const item = items.find((item) => item.product.id === productId);
  const itemQuantity = item?.product.quantity ?? 0;

  return (
    <span className="text-sm font-extralight">
      {isMounted && itemQuantity > 0
        ? `${itemQuantity} item${itemQuantity > 1 ? "s" : ""} is in Cart`
        : null}
    </span>
  );
};

export default ItemQuantity;
