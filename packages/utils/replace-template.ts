const PATTERN = /\{([0-9a-zA-Z_-]+)\}/g

export function replaceTemplate(string: string, values: Record<string, string | number | undefined> = {}): string {

  return string.replace(PATTERN, function replaceArg(match, name, index) {
    if (string[index - 1] === "{" && string[index + match.length] === "}") {
      // Экранирование {{}} => {}
      return name
    } else {
      // Подстановка значения
      const result = name in values ? values[name] : undefined
      return result || name
    }
  })
}
