# Tauri & Vue Project

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
❯ Vue  (https://vuejs.org)
  Svelte 
  React 
  Solid 
  Angular 
? Choose your UI flavor ›
❯ TypeScript
  JavaScript

Template created! To get started run:
  cd vue-tauri
  pnpm install
  pnpm tauri dev
```

### run 
```shell
$ cd vue-tauri && pnpm update && cd ./src-tauri/ && cargo update && cd ../

$ pnpm tauri dev
```

## tailwindcss (options)
```shell
pnpm install -D tailwindcss postcss autoprefixer

npx tailwindcss init -p
```

### tailwind.config.js 수정
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,vue}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### style.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## app.html
```html
    <h1 class="text-3xl font-bold underline">
        Hello world!
    </h1>
```
