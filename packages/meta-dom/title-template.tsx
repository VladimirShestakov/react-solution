type Props = {
  [key: string]: string | number
  children: string
}

export function TitleTemplate(props: Props) {
  return <>{props.children}</>;
}
