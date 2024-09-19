export type RenderConfig = {
  domId: string
}

// export type RenderValues = {
//   htmlAttributes?: string;
//   bodyAttributes?: string;
//   title?: string;
//   head?: string;
//   http?: {
//     status: number;
//     location?: string
//     // куки?
//   }
// }


export type RenderValues = {
  // Замена аттрибутов тега <html>
  htmlAttributes?: (attributes: string) => string,
  // Замена аттрибутов тега <body>
  bodyAttributes?: (attributes: string) => string,
  // Замена тега <title>
  title?: (text: string) => string,
  // Вставка тегов внутри <head>
  head?: () => string,
  // Вставка тегов внутри <body> в конце
  body?: () => string,
  // HTTP status страницы
  httpStatus?: () => {
    status: number;
    location?: string
    // куки?
  }
}
