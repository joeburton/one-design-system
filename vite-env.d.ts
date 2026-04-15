// CSS module and Vite client types are provided by "vite/client" in tsconfig.json "types".
// Plain *.css side-effect imports (e.g. tokens.css, global.css) need an explicit declaration
// because vite/client only covers *.module.css, not bare *.css files.
declare module '*.css' {}
