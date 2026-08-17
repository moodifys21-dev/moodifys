import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { ProductGallery } from '@/components/product/ProductGallery'
import { ProductInfo } from '@/components/product/ProductInfo'
import { ProductCard } from '@/components/product/ProductCard'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { useProduct, useProducts } from '@/hooks/useProducts'
import { ChevronRight, PackageSearch } from 'lucide-react'

export const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const { product, isLoading } = useProduct(slug)
  const { allProducts } = useProducts()

  // Related products from same category or collection
  const relatedProducts = allProducts
    .filter((p) => p.slug !== slug)
    .slice(0, 4)

  if (isLoading) {
    return (
      <div className="w-full py-12 md:py-16">
        <Container size="wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
            <div className="lg:col-span-7">
              <Skeleton className="w-full aspect-[4/5]" />
            </div>
            <div className="lg:col-span-5 space-y-6">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </Container>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="w-full py-20">
        <Container size="wide">
          <EmptyState
            icon={<PackageSearch size={32} />}
            title="PRODUCT NOT FOUND"
            description="The piece you are looking for may have been archived or moved."
            actionLabel="RETURN TO SHOP"
            actionHref="/shop"
          />
        </Container>
      </div>
    )
  }

  // Multi-angle gallery images
  const galleryImages = [
    product.imageUrl,
    product.hoverImageUrl || product.imageUrl,
  ]

  return (
    <div className="w-full">
      {/* Breadcrumbs */}
      <div className="w-full bg-[#F0EFED] border-b border-[#E1E0DC] py-3 text-[11px] font-semibold tracking-widest uppercase text-[#302F2E]">
        <Container size="wide">
          <div className="flex items-center space-x-2 truncate">
            <Link to="/" className="hover:text-[#090808]">HOME</Link>
            <ChevronRight size={12} className="text-[#BEBDBB]" />
            <Link to="/shop" className="hover:text-[#090808]">SHOP</Link>
            <ChevronRight size={12} className="text-[#BEBDBB]" />
            <Link to={`/shop/${product.categoryId.replace('cat-', '')}`} className="hover:text-[#090808]">
              {product.categoryName || 'COLLECTION'}
            </Link>
            <ChevronRight size={12} className="text-[#BEBDBB]" />
            <span className="text-[#090808] truncate">{product.name}</span>
          </div>
        </Container>
      </div>

      {/* Main Product Display */}
      <Section spacing="sm" className="pt-8 md:pt-12 pb-20">
        <Container size="wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
            
            {/* Gallery Left Column */}
            <div className="lg:col-span-7 sticky top-24">
              <ProductGallery
                images={galleryImages}
                productName={product.name}
              />
            </div>

            {/* Info Right Column */}
            <div className="lg:col-span-5">
              <ProductInfo product={product} />
            </div>

          </div>
        </Container>
      </Section>

      {/* Related Products Grid ("YOU MAY ALSO LIKE") */}
      {relatedProducts.length > 0 && (
        <Section spacing="md" borderedTop className="bg-[#E1E0DC]/20">
          <Container size="wide">
            <div className="pb-8 mb-8 border-b border-[#BEBDBB]/40 flex items-end justify-between">
              <div>
                <p className="text-[11px] font-bold tracking-[0.2em] text-[#BEBDBB] uppercase mb-1">
                  COMPLEMENTARY PIECES
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-wider text-[#090808]">
                  YOU MAY ALSO LIKE
                </h2>
              </div>
              <Link
                to="/shop"
                className="text-xs font-bold tracking-widest text-[#090808] uppercase hover:underline underline-offset-4"
              >
                VIEW FULL ARCHIVE
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard
                  key={rel.id}
                  id={rel.id}
                  name={rel.name}
                  slug={rel.slug}
                  category={rel.categoryName || 'ESSENTIALS'}
                  price={rel.basePrice}
                  imageUrl={rel.imageUrl}
                  hoverImageUrl={rel.hoverImageUrl}
                  isCustomizable={rel.isCustomizable}
                  isNew={rel.isNew}
                  colors={rel.colors}
                />
              ))}
            </div>
          </Container>
        </Section>
      )}
    </div>
  )
}

export default ProductDetail
