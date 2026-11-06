import { notFound } from 'next/navigation';
import { ProductView } from '@/components/ProductView';
import { getProduct, products } from '@/data/products';

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export const dynamicParams = false;

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProduct(params.slug);
  if (!product) notFound();
  return <ProductView product={product} />;
}
