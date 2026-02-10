// src/firebase/storage.ts
// Upload product images to Firebase Storage and return a public URL.

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from './firebase'

const PRODUCT_IMAGES_PREFIX = 'product-images'

/**
 * Upload a image file to Firebase Storage under product-images/.
 * Returns the download URL to use as the product's image field.
 */
export async function uploadProductImage(file: File): Promise<string> {
  const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
  const path = `${PRODUCT_IMAGES_PREFIX}/${safeName}`
  const fileRef = ref(storage, path)
  await uploadBytes(fileRef, file)
  return getDownloadURL(fileRef)
}
