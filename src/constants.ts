import type { Notation } from './engine'

export const NOTATIONS: Notation[] = ['padrao', 'logica', 'programacao']

export const OPERATORS: Record<Notation, { not: string; and: string; or: string }> = {
  padrao: { not: '~', and: '&', or: '+' },
  logica: { not: '¬', and: '∧', or: '∨' },
  programacao: { not: '!', and: '&&', or: '||' },
}

export const KEYPAD_VARIABLES = ['A', 'B', 'C', 'D']

export const EXAMPLES = [
  '~((~A + B) & (~B + C))',
  'A + (A & B) + (~~C & 1)',
  '~(A & B) + ~(~C + A)',
  '~(A + ~(B & ~C))',
  '(A & ~A) + (B & 1) + (C + 0)',
  '~(~A & ~B) & (A + B)',
]

export const DEFAULT_EXPRESSION = EXAMPLES[0]
