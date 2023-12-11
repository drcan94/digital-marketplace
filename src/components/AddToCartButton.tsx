"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { TProductWithQuantity, useCart } from "@/hooks/use-cart";

const AddToCartButton = ({ product }: { product: TProductWithQuantity }) => {
  const { items, addItem } = useCart();
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const item = items.find((item) => item.product.id === product.id);
  const itemQuantity = item?.product?.quantity || 0;

  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsSuccess(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [isSuccess]);

  return (
    <Button
      disabled={isSuccess}
      onClick={() => {
        addItem(product);
        setIsSuccess(true);
      }}
      size="lg"
      className="w-full disabled:bg-green-800 disabled:text-white disabled:cursor-not-allowed"
    >
      {isSuccess
        ? "Added!"
        : item && isMounted && itemQuantity > 0
        ? "One more add"
        : "Add to cart"}
    </Button>
  );
};

export default AddToCartButton;
