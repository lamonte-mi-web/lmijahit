// src/content/config.ts
import { defineCollection, z } from 'astro:content';

// Buat koleksi untuk blog
const blogCollection = defineCollection({
  type: 'content', // Wajib untuk koleksi .md/.mdx
  schema: z.object({
    title: z.string(),
    description: z.string(),
    author: z.string().default('Tim Redaksi'), // Nilai default jika tidak diisi
    pubDate: z.date(),
    heroImage: z.string().optional(), // Gambar tidak wajib
    tags: z.array(z.string()).optional(), // Tags tidak wajib
  }),
});

// Ekspor koleksi Anda
export const collections = {
  'project': blogCollection,
};