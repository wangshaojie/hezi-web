declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, unknown>
  export default component
}
declare module 'pdfjs-dist/build/pdf.worker.mjs' {
  const worker: Worker;
  export default worker;
}
