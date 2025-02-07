/// <reference types="vite/client" />

declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_BACKEND_API_URL: string;
  }
}
