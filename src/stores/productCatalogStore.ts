import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product, Category, ProductVariant } from '@/types/product'
import { SEED_PRODUCTS, SEED_CATEGORIES } from '@/lib/seedData'

interface ProductCatalogState {
  products: Product[]
  categories: Category[]

  // Methods
  getProductById: (id: string) => Product | undefined
  getProductBySlug: (slug: string) => Product | undefined
  addProduct: (product: Product) => void
  updateProduct: (id: string, updates: Partial<Product>) => void
  duplicateProduct: (id: string) => Product | undefined
  archiveProduct: (id: string) => void
  deleteProductPermanently: (id: string) => void
  addCategory: (category: Category) => void
  updateCategory: (id: string, updates: Partial<Category>) => void
  reorderCategories: (newOrder: Category[]) => void
  deleteCategory: (id: string) => void
}

// Generate standard variants for products if missing
const enrichWithVariants = (prods: Product[]): Product[] => {
  return prods.map((p) => {
    if (p.variants && p.variants.length > 0) return p

    const generatedVariants: ProductVariant[] = []
    const prefix = p.name
      .replace(/[^a-zA-Z0-9]/g, '')
      .slice(0, 4)
      .toUpperCase()

    p.colors.forEach((c) => {
      p.sizes.forEach((s) => {
        generatedVariants.push({
          id: `var-${p.id}-${c.name.toLowerCase()}-${s.toLowerCase()}`,
          productId: p.id,
          color: c.name,
          colorHex: c.hex,
          size: s,
          sku: `${prefix}-${c.name.slice(0, 3).toUpperCase()}-${s}`,
          price: p.basePrice,
          stock: 25,
          isActive: true,
        })
      })
    })

    return {
      ...p,
      status: p.status || (p.isActive ? 'active' : 'draft'),
      variants: generatedVariants,
    }
  })
}

export const useProductCatalogStore = create<ProductCatalogState>()(
  persist(
    (set, get) => ({
      products: enrichWithVariants(SEED_PRODUCTS),
      categories: SEED_CATEGORIES,

      getProductById: (id) => get().products.find((p) => p.id === id),
      getProductBySlug: (slug) => get().products.find((p) => p.slug === slug),

      addProduct: (product) => {
        const productWithId: Product = {
          ...product,
          id: product.id || `prod-${Date.now()}`,
          status: product.status || 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        set({ products: [productWithId, ...get().products] })
      },

      updateProduct: (id, updates) => {
        set({
          products: get().products.map((p) =>
            p.id === id
              ? {
                  ...p,
                  ...updates,
                  updatedAt: new Date().toISOString(),
                }
              : p
          ),
        })
      },

      duplicateProduct: (id) => {
        const existing = get().products.find((p) => p.id === id)
        if (!existing) return undefined

        const newId = `prod-${Date.now()}`
        const duplicated: Product = {
          ...existing,
          id: newId,
          name: `${existing.name} (COPY)`,
          slug: `${existing.slug}-copy-${Date.now().toString().slice(-4)}`,
          status: 'draft',
          isActive: false,
          isNew: true,
          variants: (existing.variants || []).map((v) => ({
            ...v,
            id: `var-${newId}-${v.color.toLowerCase()}-${v.size.toLowerCase()}`,
            productId: newId,
            sku: `${v.sku}-COPY`,
          })),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        set({ products: [duplicated, ...get().products] })
        return duplicated
      },

      archiveProduct: (id) => {
        set({
          products: get().products.map((p) =>
            p.id === id
              ? {
                  ...p,
                  isActive: false,
                  status: 'archived',
                  isArchived: true,
                  updatedAt: new Date().toISOString(),
                }
              : p
          ),
        })
      },

      deleteProductPermanently: (id) => {
        set({ products: get().products.filter((p) => p.id !== id) })
      },

      addCategory: (category) => {
        set({ categories: [...get().categories, category] })
      },

      updateCategory: (id, updates) => {
        set({
          categories: get().categories.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        })
      },

      reorderCategories: (newOrder) => {
        set({ categories: newOrder })
      },

      deleteCategory: (id) => {
        set({ categories: get().categories.filter((c) => c.id !== id) })
      },
    }),
    {
      name: 'moodifys-product-catalog',
    }
  )
)
