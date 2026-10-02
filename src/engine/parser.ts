import { EngineError, type EngineErrorCode } from './errors'
import { tokenize } from './lexer'
import type { Expr, Token, TokenType } from './types'

// Gramática (do menos para o mais prioritário):
//   or      := and ( OR and )*
//   and     := unary ( AND unary )*
//   unary   := NOT unary | primary
//   primary := VAR | CONST | '(' or ')'
//
// Parser descendente recursivo: uma função por linha da gramática.

export const parse = (input: string): Expr => {
  if (input.trim() === '') throw new EngineError('emptyExpression', 0)

  const tokens = tokenize(input)
  let current = 0

  const peek = (): Token => tokens[current]
  const advance = (): Token => tokens[current++]
  const check = (type: TokenType): boolean => peek().type === type

  const expect = (type: TokenType, code: EngineErrorCode): Token => {
    if (!check(type)) throw new EngineError(code, peek().pos, peek().value)
    return advance()
  }

  const parseOr = (): Expr => {
    let left = parseAnd()
    while (check('OR')) {
      advance()
      left = { type: 'or', left, right: parseAnd() }
    }
    return left
  }

  const parseAnd = (): Expr => {
    let left = parseUnary()
    while (check('AND')) {
      advance()
      left = { type: 'and', left, right: parseUnary() }
    }
    return left
  }

  const parseUnary = (): Expr => {
    if (check('NOT')) {
      advance()
      return { type: 'not', arg: parseUnary() }
    }
    return parsePrimary()
  }

  const parsePrimary = (): Expr => {
    const token = peek()

    if (token.type === 'VAR') {
      advance()
      return { type: 'var', name: token.value }
    }

    if (token.type === 'CONST') {
      advance()
      return { type: 'const', value: token.value === '1' }
    }

    if (token.type === 'LPAREN') {
      advance()
      const inner = parseOr()
      expect('RPAREN', 'unclosedParen')
      return inner
    }

    throw new EngineError(token.type === 'EOF' ? 'unexpectedEnd' : 'unexpectedToken', token.pos, token.value)
  }

  const result = parseOr()
  expect('EOF', 'trailingToken')
  return result
}
