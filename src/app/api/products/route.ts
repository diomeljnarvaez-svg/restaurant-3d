import { NextResponse } from "next/server";
import { getAll, create } from "@/lib/db";
import { guard, STAFF_ROLES } from "@/lib/api-auth";
import type { Product } from "@/lib/types";

export async function GET() {
  const products = await getAll<Product>("products");
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  const auth = await guard(STAFF_ROLES);
  if (!auth.ok) return auth.response;

  try {
    const body = await req.json();
    const newProduct: Product = {
      id: Date.now().toString(),
      name: body.name,
      slug: body.slug || body.name.toLowerCase().replace(/\s+/g, "-"),
      description: body.description,
      price: Number(body.price),
      image: body.image,
      category: body.category,
      featured: body.featured ?? false,
      available: body.available ?? true,
      createdAt: new Date().toISOString(),
    };
    const created = await create("products", newProduct);
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error al crear producto" }, { status: 500 });
  }
}
