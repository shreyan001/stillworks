import { notFound } from 'next/navigation';
import { ProductView } from '@/components/ProductView';
import { getProduct, products, type Product } from '@/data/products';
import { redis } from '@/lib/redis';

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export const dynamicParams = true;

export default async function ProductPage({ params }: { params: { slug: string } }) {
  let product = getProduct(params.slug);
  if (!product) {
    try {
      const cached = await redis.get<Product[]>('stillworks:catalog:products');
      if (cached && Array.isArray(cached)) {
        product = cached.find((p) => p.slug === params.slug);
      }
    } catch {
      // fallback
    }
  }

  if (!product) notFound();
  return <ProductView product={product} />;
}
