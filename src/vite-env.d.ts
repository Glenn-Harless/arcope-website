// src/vite-env.d.ts
/// <reference types="vite/client" />

// This file is created by Vite automatically when initializing a TypeScript project.
// It provides type definitions for Vite-specific features.

// It lets TypeScript know about Vite's environment variables
interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string
    // Add more env variables as needed:
    // readonly VITE_API_URL: string
    // readonly VITE_SOME_KEY: string
  }
  
  // Extends the ImportMeta interface to include the env property
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }