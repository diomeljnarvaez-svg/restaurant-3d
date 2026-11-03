"use client";

import type { Product } from "@/lib/types";
import Image from "next/image";

interface Props {
  product: Pick<Product, "name" | "image">;
  primaryColor: string;
  aspect?: string;
  className?: string;
}

export default function ProductImage({ product, primaryColor, aspect = "aspect-[4/3]", className = "" }: Props) {
  if (product.image) {
    return (
      <div className={`${aspect} overflow-hidden ${className}`}>
        <Image src={product.image} alt={product.name} width={800} height={600} unoptimized className="w-full h-full object-cover" />
      </div>
    );
  }
  return (
    <div
      className={`${aspect} flex items-center justify-center overflow-hidden ${className}`}
      style={{ background: `linear-gradient(135deg, ${primaryColor}33, ${primaryColor}11)` }}
    >
      <span className="text-6xl font-extrabold select-none" style={{ color: `${primaryColor}99` }}>
        {(product.name || "?").trim().charAt(0).toUpperCase()}
      </span>
    </div>
  );
}
