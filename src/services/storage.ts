/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const storageService = {
  /**
   * Optimizes an image file by resizing (if needed) and converting to WebP format.
   * Runs entirely client-side using canvas.
   * 
   * @param file The original File object
   * @param quality Quality factor between 0 and 1, defaults to 0.8
   * @param maxWidth Maximum width for optimization, defaults to 1600
   * @returns Optimized WebP File object
   */
  async optimizeAndConvertToWebP(
    file: File, 
    quality: number = 0.8, 
    maxWidth: number = 1600
  ): Promise<File> {
    if (!file.type.startsWith('image/')) {
      return file; // If it's not an image, return as-is
    }

    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Resize if width exceeds maxWidth
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file); // Fallback to original if context fails
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }
            
            // Create a new file name with .webp extension
            const originalName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
            const webpFile = new File([blob], `${originalName}.webp`, {
              type: 'image/webp',
              lastModified: Date.now(),
            });
            resolve(webpFile);
          },
          'image/webp',
          quality
        );
      };

      img.onerror = () => {
        resolve(file); // Fallback to original on error
      };
    });
  },

  /**
   * Upload a raw file to a specified Supabase Storage Bucket.
   * On fallback (no Supabase), compiles the file into a base64 Data URL so the client can save it locally.
   * 
   * @param file The file object from <input type="file" />
   * @param bucket Name of the storage bucket, defaults to 'projects'
   * @param onProgress Callback function to track upload progress
   * @returns Public URL string
   */
  async uploadFile(
    file: File, 
    bucket: string = 'projects',
    onProgress?: (percent: number) => void
  ): Promise<string> {
    // 1. Optimize and convert image to WebP first!
    let processedFile = file;
    if (file.type.startsWith('image/')) {
      try {
        if (onProgress) onProgress(10); // Start progress indicating optimization is happening
        processedFile = await this.optimizeAndConvertToWebP(file, 0.85, 1600);
        if (onProgress) onProgress(25); // Optimization complete
      } catch (err) {
        console.warn('Image optimization failed, uploading raw original file:', err);
      }
    }

    if (isSupabaseConfigured && supabase) {
      try {
        // Sanitize file name to prevent collision
        const fileExt = processedFile.name.split('.').pop() || 'webp';
        const fileName = `${Math.random().toString(36).substring(2, 15)}-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        // Create simulated progress interval while Supabase performs uploading
        let simulatedProgress = 25;
        const progressInterval = setInterval(() => {
          if (simulatedProgress < 90) {
            simulatedProgress += Math.floor(Math.random() * 8) + 2;
            if (onProgress) onProgress(Math.min(simulatedProgress, 90));
          }
        }, 150);

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(filePath, processedFile, {
            cacheControl: '3600',
            upsert: false
          });

        clearInterval(progressInterval);

        if (error) {
          throw error; // Let catch block handle it uniformly
        }

        if (onProgress) onProgress(95);

        // Retrieve public URL
        const { data: { publicUrl } } = supabase.storage
          .from(bucket)
          .getPublicUrl(filePath);

        if (onProgress) onProgress(100);
        return publicUrl;
      } catch (err: any) {
        console.error(`[Supabase Storage Debug Engine] Failed to upload file to bucket "${bucket}":`, err);
        
        // Extract raw error message for context analysis
        const rawMessage = err?.message || String(err);
        let descriptiveMessage = `[Storage Upload Error] ${rawMessage}`;

        // Match common failure patterns with step-by-step diagnostic solutions:
        if (rawMessage.toLowerCase().includes('load failed') || rawMessage.toLowerCase().includes('failed to fetch')) {
          descriptiveMessage = `[Supabase Connection / CORS Error]:
- Cause: The browser failed to establish a connection to your Supabase project (URL: "${(import.meta as any).env?.VITE_SUPABASE_URL}").
- Solutions to verify:
  1. Check if the VITE_SUPABASE_URL inside your .env is correct.
  2. Make sure your Supabase project is currently active and not paused.
  3. Ensure that there are no CORS policies blocking the request from this development domain.
  4. Check your internet connection or any active VPNs/ad-blockers that might block Supabase API domains.`;
        } else if (rawMessage.toLowerCase().includes('bucket') || rawMessage.toLowerCase().includes('not found') || rawMessage.toLowerCase().includes('invalid bucket')) {
          descriptiveMessage = `[Supabase Storage Bucket Error]:
- Cause: The storage bucket named "${bucket}" was not found or is inactive.
- Solutions to verify:
  1. Go to your Supabase Console -> Storage -> Buckets.
  2. Create a new bucket named exactly "${bucket}".
  3. Make sure the bucket is configured as "Public" so that files can be read without session tokens.`;
        } else if (rawMessage.toLowerCase().includes('policy') || rawMessage.toLowerCase().includes('row-level security') || rawMessage.toLowerCase().includes('rls') || rawMessage.toLowerCase().includes('violates') || rawMessage.toLowerCase().includes('unauthorized') || rawMessage.includes('42501')) {
          descriptiveMessage = `[Supabase Storage RLS Policy Error]:
- Cause: Row-Level Security (RLS) policies on bucket "${bucket}" are blocking your anonymous file upload.
- Solutions to verify:
  1. Go to your Supabase Console -> Storage -> Policies.
  2. Select the policies configuration for the "${bucket}" bucket.
  3. Enable public insert operations for anonymous users (specifically, check INSERT permission for public/anon).`;
        } else if (rawMessage.toLowerCase().includes('empty') || rawMessage.toLowerCase().includes('size') || rawMessage.toLowerCase().includes('payload too large') || rawMessage.includes('413')) {
          descriptiveMessage = `[Supabase File Size Limit Error]:
- Cause: The uploaded file exceeds the file size limit set on your "${bucket}" bucket or the global Supabase upload limit.
- Solutions to verify:
  1. Go to Supabase Console -> Storage -> Buckets -> Edit "${bucket}" bucket.
  2. Adjust the "Maximum File Size" limit to accommodate larger files.`;
        }

        // Return descriptive error containing debugging instructions
        throw new Error(descriptiveMessage);
      }
    }

    // Fallback: Convert to Data URL (base64) and simulate progressive upload
    return new Promise((resolve, reject) => {
      let simulatedProgress = processedFile.type.startsWith('image/') ? 25 : 0;
      const progressInterval = setInterval(() => {
        if (simulatedProgress < 95) {
          simulatedProgress += 15;
          if (onProgress) onProgress(Math.min(simulatedProgress, 95));
        }
      }, 80);

      const reader = new FileReader();
      reader.onload = () => {
        clearInterval(progressInterval);
        if (typeof reader.result === 'string') {
          if (onProgress) onProgress(100);
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert uploaded file to Base64 data string.'));
        }
      };
      reader.onerror = (error) => {
        clearInterval(progressInterval);
        reject(error);
      };
      reader.readAsDataURL(processedFile);
    });
  },

  /**
   * Delete a file from a Supabase Storage Bucket based on its public URL or path.
   */
  async deleteFile(fileUrl: string, bucket: string = 'projects'): Promise<boolean> {
    if (!fileUrl) return false;

    if (isSupabaseConfigured && supabase) {
      try {
        // Extract the path from the URL
        // Example URL: https://xyz.supabase.co/storage/v1/object/public/projects/file.jpg
        const parts = fileUrl.split(`/storage/v1/object/public/${bucket}/`);
        if (parts.length < 2) {
          console.warn('URL is not a standard Supabase public storage format, skipping deletion.');
          return false;
        }
        
        const path = parts[1];
        const { error } = await supabase.storage
          .from(bucket)
          .remove([path]);

        if (error) {
          throw new Error(`[Storage Deletion Error] ${error.message}`);
        }

        return true;
      } catch (err: any) {
        console.error(`Failed to delete file from bucket ${bucket}:`, err);
        throw err;
      }
    }

    // Local fallback is silent
    return true;
  }
};
