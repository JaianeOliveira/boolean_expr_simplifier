import { describe, expect, it } from 'vitest'
import { EngineError, areEquivalent, parse, print, printHighlighted, simplify } from '.'

const simplifyText = (input: string) => {
  const ast = parse(input)
  const { result, steps } = simplify(ast)
  return { ast, result, steps, text: print(result) }
}

describe('parser', () => {
  it('respeita a precedência NÃO > E > OU', () => {
    expect(print(parse('A + B & C'))).toBe('A + (B & C)')
    expect(print(parse('~A & B'))).toBe('~A & B')
  })

  it('aceita as três notações', () => {
    const expected = print(parse('~A & B + C'))
    expect(print(parse('¬A ∧ B ∨ C'))).toBe(expected)
    expect(print(parse('!A && B || C'))).toBe(expected)
  })

  it.each([
    ['', 'emptyExpression'],
    ['(A + B', 'unclosedParen'],
    ['A +', 'unexpectedEnd'],
    ['A $ B', 'unexpectedSymbol'],
    ['A B', 'trailingToken'],
    ['A + )', 'unexpectedToken'],
  ])('"%s" gera o erro %s', (input, code) => {
    expect(() => parse(input)).toThrowError(EngineError)
    try {
      parse(input)
    } catch (error) {
      expect((error as EngineError).code).toBe(code)
    }
  })
})

describe('simplify', () => {
  it('resolve o exemplo do app', () => {
    const { text, steps } = simplifyText('~((~A + B) & (~B + C))')
    expect(text).toBe('(A & ~B) + (B & ~C)')
    expect(steps.map((s) => s.ruleId)).toEqual([
      'deMorgan',
      'deMorgan',
      'doubleNegation',
      'deMorgan',
      'doubleNegation',
    ])
  })

  it.each([
    ['A + (A & B)', 'A'],
    ['A & (A + B)', 'A'],
    ['A & ~A', '0'],
    ['A + ~A', '1'],
    ['A & 1', 'A'],
    ['A + 1', '1'],
    ['A + A', 'A'],
    ['~~~A', '~A'],
  ])('%s ⇒ %s', (input, expected) => {
    expect(simplifyText(input).text).toBe(expected)
  })

  it('nunca registra um passo que não muda a expressão', () => {
    const { steps } = simplifyText('~((~A + B) & (~B + C))')
    steps.forEach((step) => expect(print(step.before)).not.toBe(print(step.after)))
  })

  it.each(['~((~A + B) & (~B + C))', '~(A & B) + ~(~C + A)', 'A + (A & B) + (~~C & 1)', '~(A + ~(B & ~C))'])(
    'o resultado de %s é equivalente à entrada',
    (input) => {
      const { ast, result } = simplifyText(input)
      expect(areEquivalent(ast, result)).toBe(true)
    },
  )
})

describe('printHighlighted', () => {
  it('separa o trecho alterado', () => {
    const { steps } = simplifyText('~((~A + B) & (~B + C))')
    expect(printHighlighted(steps[2].before, steps[2].path)).toEqual({
      pre: '(',
      hit: '~~A',
      post: ' & ~B) + ~(~B + C)',
    })
  })
})
