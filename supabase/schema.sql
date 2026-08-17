-- ==============================================================================
-- MOODIFYS PRODUCTION POSTGRESQL / SUPABASE DATABASE SCHEMA
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  avatar_url TEXT,
  is_admin BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  sort_order INT DEFAULT 0 NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE RESTRICT NOT NULL,
  base_price NUMERIC(10, 2) NOT NULL,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  hover_image_url TEXT,
  is_customizable BOOLEAN DEFAULT FALSE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  is_new BOOLEAN DEFAULT FALSE NOT NULL,
  materials TEXT,
  fit TEXT,
  care_instructions TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. PRODUCT VARIANTS TABLE
CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  color TEXT NOT NULL,
  color_hex TEXT NOT NULL,
  size TEXT NOT NULL,
  sku TEXT NOT NULL UNIQUE,
  price NUMERIC(10, 2) NOT NULL,
  stock INT DEFAULT 100 NOT NULL,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. CUSTOM DESIGNS TABLE
CREATE TABLE IF NOT EXISTS public.designs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE RESTRICT NOT NULL,
  name TEXT NOT NULL,
  design_data JSONB NOT NULL,
  preview_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 6. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE RESTRICT NOT NULL,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')) DEFAULT 'pending' NOT NULL,
  subtotal NUMERIC(10, 2) NOT NULL,
  shipping NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
  discount NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
  total NUMERIC(10, 2) NOT NULL,
  currency TEXT DEFAULT 'INR' NOT NULL,
  shipping_address JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 7. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE RESTRICT NOT NULL,
  design_id UUID REFERENCES public.designs(id) ON DELETE SET NULL,
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
  quantity INT DEFAULT 1 NOT NULL,
  unit_price NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 8. ADDRESSES TABLE
CREATE TABLE IF NOT EXISTS public.addresses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address_line_1 TEXT NOT NULL,
  address_line_2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT DEFAULT 'India' NOT NULL,
  is_default BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 9. WISHLISTS TABLE
CREATE TABLE IF NOT EXISTS public.wishlists (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, product_id)
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

-- 10. ADMIN ROLES & RBAC PERMISSION SYSTEM
CREATE TABLE IF NOT EXISTS public.admin_roles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.permissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.role_permissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  role_id UUID REFERENCES public.admin_roles(id) ON DELETE CASCADE NOT NULL,
  permission_id UUID REFERENCES public.permissions(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  role_id UUID REFERENCES public.admin_roles(id) ON DELETE RESTRICT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 11. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  actor_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  old_data JSONB,
  new_data JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 12. ADMIN NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.admin_notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

-- Helper security functions
CREATE OR REPLACE FUNCTION public.is_admin_user(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.user_id = user_uuid AND au.is_active = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.has_permission(user_uuid UUID, permission_key TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.admin_users au
    JOIN public.role_permissions rp ON rp.role_id = au.role_id
    JOIN public.permissions p ON p.id = rp.permission_id
    WHERE au.user_id = user_uuid 
      AND au.is_active = TRUE 
      AND (p.key = permission_key OR p.key = 'all')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: users can read and update their own profile; admins can read all
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id OR public.is_admin_user(auth.uid()));
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id OR public.has_permission(auth.uid(), 'customers.update'));

-- Categories: public read access, admin manage
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (is_active = TRUE OR public.is_admin_user(auth.uid()));
CREATE POLICY "Admins can insert categories" ON public.categories FOR INSERT WITH CHECK (public.has_permission(auth.uid(), 'categories.create'));
CREATE POLICY "Admins can update categories" ON public.categories FOR UPDATE USING (public.has_permission(auth.uid(), 'categories.update'));
CREATE POLICY "Admins can delete categories" ON public.categories FOR DELETE USING (public.has_permission(auth.uid(), 'categories.delete'));

-- Products: public read access for active products, admin can view/manage all
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (is_active = TRUE OR public.is_admin_user(auth.uid()));
CREATE POLICY "Admins can insert products" ON public.products FOR INSERT WITH CHECK (public.has_permission(auth.uid(), 'products.create'));
CREATE POLICY "Admins can update products" ON public.products FOR UPDATE USING (public.has_permission(auth.uid(), 'products.update'));
CREATE POLICY "Admins can delete products" ON public.products FOR DELETE USING (public.has_permission(auth.uid(), 'products.delete'));

-- Product Variants: public read access
CREATE POLICY "Product variants are viewable by everyone" ON public.product_variants FOR SELECT USING (is_active = TRUE OR public.is_admin_user(auth.uid()));
CREATE POLICY "Admins can manage variants" ON public.product_variants FOR ALL USING (public.has_permission(auth.uid(), 'products.update'));

-- Designs: users can CRUD only their own designs; admins can view for fulfillment
CREATE POLICY "Users can view own designs" ON public.designs FOR SELECT USING (auth.uid() = user_id OR public.has_permission(auth.uid(), 'orders.fulfill'));
CREATE POLICY "Users can insert own designs" ON public.designs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own designs" ON public.designs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own designs" ON public.designs FOR DELETE USING (auth.uid() = user_id);

-- Orders: users view own orders, admins with orders.view can view all
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id OR public.has_permission(auth.uid(), 'orders.view'));
CREATE POLICY "Users can insert own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can update orders" ON public.orders FOR UPDATE USING (public.has_permission(auth.uid(), 'orders.update') OR public.has_permission(auth.uid(), 'orders.fulfill'));

-- Order items: viewable through order ownership or admin
CREATE POLICY "Users can view own order items" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()) OR public.has_permission(auth.uid(), 'orders.view')
);
CREATE POLICY "Users can insert order items for own orders" ON public.order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

-- Addresses: users manage their own addresses
CREATE POLICY "Users can view own addresses" ON public.addresses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own addresses" ON public.addresses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own addresses" ON public.addresses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own addresses" ON public.addresses FOR DELETE USING (auth.uid() = user_id);

-- Wishlists: users manage their own wishlist items
CREATE POLICY "Users can view own wishlist" ON public.wishlists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert into own wishlist" ON public.wishlists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete from own wishlist" ON public.wishlists FOR DELETE USING (auth.uid() = user_id);

-- Admin tables RLS
CREATE POLICY "Admin roles viewable by staff" ON public.admin_roles FOR SELECT USING (public.is_admin_user(auth.uid()));
CREATE POLICY "Permissions viewable by staff" ON public.permissions FOR SELECT USING (public.is_admin_user(auth.uid()));
CREATE POLICY "Role permissions viewable by staff" ON public.role_permissions FOR SELECT USING (public.is_admin_user(auth.uid()));
CREATE POLICY "Admin users viewable by super admins and admins" ON public.admin_users FOR SELECT USING (public.has_permission(auth.uid(), 'admin.users.view'));
CREATE POLICY "Super admins can manage admin users" ON public.admin_users FOR ALL USING (public.has_permission(auth.uid(), 'admin.users.create'));
CREATE POLICY "Audit logs viewable by authorized admins" ON public.audit_logs FOR SELECT USING (public.has_permission(auth.uid(), 'audit_logs.view'));
CREATE POLICY "Admin notifications viewable by staff" ON public.admin_notifications FOR ALL USING (public.is_admin_user(auth.uid()));

-- ==============================================================================
-- STORAGE BUCKETS
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('product-images', 'product-images', true),
  ('design-previews', 'design-previews', true),
  ('user-uploads', 'user-uploads', false),
  ('avatars', 'avatars', true),
  ('media-library', 'media-library', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public Read Product Images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Public Read Design Previews" ON storage.objects FOR SELECT USING (bucket_id = 'design-previews');
CREATE POLICY "Public Read Media Library" ON storage.objects FOR SELECT USING (bucket_id = 'media-library');
CREATE POLICY "Admins Can Upload Product Images" ON storage.objects FOR INSERT WITH CHECK (bucket_id IN ('product-images', 'media-library') AND public.has_permission(auth.uid(), 'media.upload'));
CREATE POLICY "Users Can Upload Design Previews" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'design-previews' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users Can Upload User Uploads" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'user-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);
