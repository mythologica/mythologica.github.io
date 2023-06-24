# Tauri & Svelte Project

## tauri 

```shell
pnpm create tauri-app

? Project name (tauri) > vue-tauri 
? Choose which language to use for your frontend ›
❯ TypeScript / JavaScript  (pnpm, yarn, npm)
  Rust 
? Choose your package manager ›
❯ pnpm
  yarn
  npm
? Choose your UI template ›
  Vanilla
  Vue 
❯ Svelte  (https://svelte.dev/)
  React 
  Solid 
  Angular 
? Choose your UI flavor ›
❯ TypeScript
  JavaScript

Template created! To get started run:
  cd my-app
  pnpm install
  pnpm tauri dev
```

### run 
```shell
$ cd my-tauri && pnpm install

$ pnpm tauri dev
```

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

#### ./src/app.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

#### ./src/+page.svelte

```html
<h1 class="text-3xl font-bold underline bg-slate-400">
    Hello Tailwind!
</h1>
```



