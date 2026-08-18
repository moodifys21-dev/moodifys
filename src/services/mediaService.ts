import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { MediaAsset, MediaFolder } from '@/types/media'
import { slugify } from '@/lib/utils'

export const FOLDER_BUCKET_MAP: Record<MediaFolder, string> = {
  Homepage: 'homepage-images',
  Categories: 'category-images',
  Products: 'product-images',
  'Custom Designs': 'media-library',
  Marketing: 'media-library',
  General: 'media-library',
}

/**
 * Upload an image file directly to Supabase Storage
 * Generates a unique timestamped filename to prevent CDN/browser caching issues
 */
export async function uploadMediaFile(
  file: File,
  folder: MediaFolder = 'Homepage',
  uploadedBy: string = 'Admin Operator'
): Promise<MediaAsset> {
  const cleanTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ').toUpperCase()
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const fileSlug = slugify(cleanTitle) || 'asset'
  const uniqueFileName = `${fileSlug}-${Date.now()}.${ext}`
  const bucketName = FOLDER_BUCKET_MAP[folder] || 'media-library'
  const storagePath = `${folder.toLowerCase().replace(/\s+/g, '-')}/${uniqueFileName}`
  const sizeInMb = (file.size / (1024 * 1024)).toFixed(2) + ' MB'

  // If Supabase is connected, upload to Supabase Storage
  if (isSupabaseConfigured && supabase) {
    try {
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type || 'image/jpeg',
        })

      if (uploadError) {
        console.warn('Supabase storage upload error, falling back to public URL strategy:', uploadError)
      } else {
        const { data: publicUrlData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(storagePath)

        if (publicUrlData?.publicUrl) {
          const newAsset: MediaAsset = {
            id: `med-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            title: cleanTitle,
            fileName: uniqueFileName,
            storagePath,
            url: publicUrlData.publicUrl,
            publicUrl: publicUrlData.publicUrl,
            folder,
            mimeType: file.type || 'image/jpeg',
            fileSize: sizeInMb,
            dimensions: '1920 × 2560 px (Uploaded)',
            altText: cleanTitle,
            uploadedBy,
            usedIn: [],
            createdAt: new Date().toISOString(),
          }

          // Also attempt to insert into media_assets table in Supabase
          try {
            await supabase.from('media_assets').insert({
              title: newAsset.title,
              file_name: newAsset.fileName,
              url: newAsset.publicUrl,
              thumbnail_url: newAsset.publicUrl,
              file_size: newAsset.fileSize,
              dimensions: newAsset.dimensions,
              format: ext.toUpperCase(),
              folder: newAsset.folder,
              alt_text: newAsset.altText,
            })
          } catch {
            // non-fatal
          }

          return newAsset
        }
      }
    } catch (err) {
      console.warn('Failed direct storage upload, falling back to data URL:', err)
    }
  }

  // Fallback: Read file into Data URL (offline / local dev demo without live Supabase storage)
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      const fallbackAsset: MediaAsset = {
        id: `med-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        title: cleanTitle,
        fileName: uniqueFileName,
        storagePath,
        url: dataUrl,
        publicUrl: dataUrl,
        folder,
        mimeType: file.type || 'image/jpeg',
        fileSize: sizeInMb,
        dimensions: '1920 × 2560 px (Uploaded)',
        altText: cleanTitle,
        uploadedBy,
        usedIn: [],
        createdAt: new Date().toISOString(),
      }
      resolve(fallbackAsset)
    }
    reader.readAsDataURL(file)
  })
}
