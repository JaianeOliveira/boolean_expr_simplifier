import { EngineError } from './errors'
import type { Token, TokenType } from './types'

// Todas as notações caem nos mesmos tokens. O resto do motor não sabe qual foi usada.
// Ordem importa: símbolos de 2 caracteres antes dos de 1.
const SYMBOLS: Array<[string, TokenType]> = [
  ['&&', 'AND'],
  ['||', 'OR'],
  ['~', 'NOT'], ['¬', 'NOT'], ['!', 'NOT'],
  ['&', 'AND'], ['∧', 'AND'], ['·', 'AND'], ['*', 'AND'],
  ['+', 'OR'], ['∨', 'OR'], ['|', 'OR'],
  ['(', 'LPAREN'],
  [')', 'RPAREN'],
]

export const tokenize = (input: string): Token[] => {
  const tokens: Token[] = []
  let i = 0

  while (i < input.length) {
    const ch = input[i]

    if (/\s/.test(ch)) {
      i++
      continue
    }

    const symbol = SYMBOLS.find(([s]) => input.startsWith(s, i))
    if (symbol) {
      tokens.push({ type: symbol[1], value: symbol[0], pos: i })
      i += symbol[0].length
      continue
    }

    if (/[A-Za-z]/.test(ch)) {
      tokens.push({ type: 'VAR', value: ch.toUpperCase(), pos: i })
      i++
      continue
    }

    if (ch === '0' || ch === '1') {
      tokens.push({ type: 'CONST', value: ch, pos: i })
      i++
      continue
    }

    throw new EngineError('unexpectedSymbol', i, ch)
  }

  tokens.push({ type: 'EOF', value: '', pos: input.length })
  return tokens
}
