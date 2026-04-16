// CSS module and Vite client types are provided by "vite/client" in tsconfig.json "types".
// The explicit *.module.css declaration below must come first so TypeScript prefers it over
// the broader *.css catch-all when resolving component CSS module imports.
declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

// Plain *.css side-effect imports (e.g. tokens.css, global.css).
declare module '*.css' {}
