/// <reference types="vite/client" />

/**
 * CSS Module type declarations.
 * Tells TypeScript that any *.module.css import is a valid object of string keys.
 */
declare module '*.module.css' {
  const classes: Record<string, string>;
  export default classes;
}

declare module '*.module.scss' {
  const classes: Record<string, string>;
  export default classes;
}

declare module '*.module.sass' {
  const classes: Record<string, string>;
  export default classes;
}
