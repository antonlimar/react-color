declare module '*.md?raw' {
  const content: string;
  export default content;
}

declare module '*.js?raw' {
  const content: string;
  export default content;
}

declare module '*.ts?raw' {
  const content: string;
  export default content;
}

declare module '*.tsx?raw' {
  const content: string;
  export default content;
}

declare module '*.scss' {
  const stylesheet: string;
  export default stylesheet;
}
