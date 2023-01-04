# Tauri & Svelte Project

## tauri 
```shell
pnpm create tauri-app

? Project name (tauri) > my-tauri 

? Choose your package manager >
  cargo
> pnpm
  yarn
  npm

? Choose your UI template ›
  vanilla
  vanilla-ts
  vue
  vue-ts
  svelte
  svelte-ts
  react
  react-ts
  solid
  solid-ts
  next
  next-ts
  preact
  preact-ts
  angular
  clojurescript
  svelte-kit
❯ svelte-kit-ts
```

## run 
cd my-tauri && pnpm install

pnpm tauri dev



### tailwindcss (option)
```
$ pnpm add -D tailwindcss postcss autoprefixer

$ npx tailwindcss init -p
```


#### tailwind.config.cjs
```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,css,svelte}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### ./src/app.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### ./src/+page.svelte
```html
<h1 class="text-3xl font-bold underline bg-slate-400">
    Hello Tailwind!
</h1>
```



