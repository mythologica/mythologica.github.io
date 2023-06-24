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
  cd my-app
  pnpm install
  pnpm tauri dev
```

### run 
```shell
$ cd my-app && pnpm update && cd ./src-tauri/ && cargo update && cd ../

$ pnpm tauri dev
```