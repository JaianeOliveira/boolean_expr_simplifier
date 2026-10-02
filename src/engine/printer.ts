import type { Expr, Notation, Path } from './types'

const SYMBOLS: Record<Notation, { not: string; and: string; or: string }> = {
  padrao: { not: '~', and: ' & ', or: ' + ' },
  logica: { not: '¬', and: ' ∧ ', or: ' ∨ ' },
  programacao: { not: '!', and: ' && ', or: ' || ' },
}

// Quanto maior, mais "forte" o operador (precisa de menos parênteses)
const PRECEDENCE: Record<Expr['type'], number> = { or: 1, and: 2, not: 3, var: 4, const: 4 }

const MARK_START = '\u0001'
const MARK_END = '\u0002'

const samePath = (a: Path, b: Path): boolean => a.length === b.length && a.every((p, i) => p === b[i])

const render = (e: Expr, notation: Notation, mark: Path | null, here: Path, parentPrec: number): string => {
  const s = SYMBOLS[notation]
  const prec = PRECEDENCE[e.type]

  const child = (sub: Expr, key: 'arg' | 'left' | 'right', minPrec: number) =>
    render(sub, notation, mark, [...here, key], minPrec)

  let text: string
  switch (e.type) {
    case 'var':
      text = e.name
      break
    case 'const':
      text = e.value ? '1' : '0'
      break
    case 'not':
      text = s.not + child(e.arg, 'arg', prec)
      break
    case 'and':
      text = child(e.left, 'left', prec) + s.and + child(e.right, 'right', prec)
      break
    case 'or':
      text = child(e.left, 'left', prec) + s.or + child(e.right, 'right', prec)
      break
  }

  // Parênteses só quando o pai é mais forte que este nó.
  // Exceção didática: E dentro de OU ganha parênteses, para ficar (A & ~B) + (B & ~C)
  const needsParens = prec < parentPrec || (e.type === 'and' && parentPrec === PRECEDENCE.or)
  if (needsParens) text = `(${text})`

  return mark && samePath(mark, here) ? MARK_START + text + MARK_END : text
}

export const print = (e: Expr, notation: Notation = 'padrao'): string => render(e, notation, null, [], 0)

// Devolve o texto em 3 pedaços, para a UI destacar o nó em `path`
export const printHighlighted = (
  e: Expr,
  path: Path,
  notation: Notation = 'padrao',
): { pre: string; hit: string; post: string } => {
  const text = render(e, notation, path, [], 0)
  const start = text.indexOf(MARK_START)
  const end = text.indexOf(MARK_END)
  return {
    pre: text.slice(0, start),
    hit: text.slice(start + 1, end),
    post: text.slice(end + 1),
  }
}
