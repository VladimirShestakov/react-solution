export type CSSText = {
  background: string;
  'background-attachment': string;
  'background-clip': string;
  'background-color': string;
  'background-image': string;
  'background-origin': string;
  'background-position': string;
  'background-repeat': string;
  'background-size': string;
  border: string;
  'border-radius': string;
  'box-decoration-break': string;
  'box-shadow': string;
  clear: string;
  float: string;
  color: string;
  cursor: string;
  display: string;
  font: string;
  'font-family': string;
  'font-size': string;
  'font-stretch': string;
  'font-style': string;
  'font-variant': string;
  'font-weight': string;
  'line-height': string;
  'text-decoration': string
  margin: string;
  outline: string;
  padding: string;
  'white-space': string;
  'word-spacing': string;
  'word-break': string;
  'writing-mode': string;
}

export function css(style: Partial<CSSText>): string {
  return Object.entries(style)
    .map(([name, value]) => `${name}:${value}`)
    .join(';');
}
