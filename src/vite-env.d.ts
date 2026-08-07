/// <reference types="vite/client" />

declare module "*.jpeg" {
  const src: string;
  export default src;
}

declare module "*.jpg" {
  const src: string;
  export default src;
}

declare module "*.png" {
  const src: string;
  export default src;
}

declare module "*.css" {
  const content: { [key: string]: string };
  export default content;
}
