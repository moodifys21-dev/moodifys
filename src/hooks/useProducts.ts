import { useMemo } from 'react'
import { ProductFilterOptions } from '@/types/product'
import { useProductCatalogStore } from '@/stores/productCatalogStore'

export function useProducts(filters?: ProductFilterOptions) {
  const { products, categories } = useProductCatalogStore()
  const isLoading = false
  const error = null

  // Apply filters and sorting in-memory
  const filteredProducts = useMemo(() => {
    if (!filters) return products

    let list = [...products]

    // Category filter
    if (filters.category && filters.category !== 'all') {
      const targetCat = categories.find(
        (c) => c.slug.toLowerCase() === filters.category?.toLowerCase()
      )
      if (targetCat) {
        list = list.filter((p) => p.categoryId === targetCat.id)
      } else {
        list = list.filter(
          (p) => p.categoryName?.toLowerCase() === filters.category?.toLowerCase()
        )
      }
    }

    // Customizable filter
    if (filters.isCustomizable !== undefined) {
      list = list.filter((p) => p.isCustomizable === filters.isCustomizable)
    }

    // Search query filter
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase().trim()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.categoryName?.toLowerCase().includes(q)
      )
    }

    // Color filter
    if (filters.color) {
      list = list.filter((p) =>
        p.colors.some((c) => c.name.toLowerCase() === filters.color?.toLowerCase())
      )
    }

    // Size filter
    if (filters.size) {
      list = list.filter((p) =>
        p.sizes.some((s) => s.toUpperCase() === filters.size?.toUpperCase())
      )
    }

    // Price range
    if (filters.minPrice !== undefined) {
      list = list.filter((p) => p.basePrice >= (filters.minPrice || 0))
    }
    if (filters.maxPrice !== undefined) {
      list = list.filter((p) => p.basePrice <= (filters.maxPrice || Infinity))
    }

    // Sort by
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'newest':
          list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
          break
        case 'price-asc':
          list.sort((a, b) => a.basePrice - b.basePrice)
          break
        case 'price-desc':
          list.sort((a, b) => b.basePrice - a.basePrice)
          break
        case 'featured':
        default:
          list.sort((a, b) => (b.isCustomizable ? 1 : 0) - (a.isCustomizable ? 1 : 0))
          break
      }
    }

    return list
  }, [products, categories, filters])

  return {
    products: filteredProducts,
    allProducts: products,
    categories,
    isLoading,
    error,
  }
}

export function useProduct(slugOrId?: string) {
  const { allProducts, isLoading, error } = useProducts()

  const product = useMemo(() => {
    if (!slugOrId) return null
    return (
      allProducts.find(
        (p) => p.slug === slugOrId || p.id === slugOrId
      ) || null
    )
  }, [allProducts, slugOrId])

  return { product, isLoading, error }
}
