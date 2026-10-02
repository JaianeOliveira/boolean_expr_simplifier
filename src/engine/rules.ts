import { and, c, not, or, type Expr } from './types'

// Uma regra recebe UM nó e devolve o nó reescrito, ou null se o padrão não casa.
export type Rule = { id: string; apply: (e: Expr) => Expr | null }

// Igualdade estrutural: duas subárvores idênticas
export const equals = (a: Expr, b: Expr): boolean => {
  if (a.type !== b.type) return false
  switch (a.type) {
    case 'var':
      return a.name === (b as typeof a).name
    case 'const':
      return a.value === (b as typeof a).value
    case 'not':
      return equals(a.arg, (b as typeof a).arg)
    case 'and':
    case 'or': {
      const o = b as typeof a
      return equals(a.left, o.left) && equals(a.right, o.right)
    }
  }
}

const isNegationOf = (a: Expr, b: Expr): boolean =>
  (a.type === 'not' && equals(a.arg, b)) || (b.type === 'not' && equals(b.arg, a))

const isConst = (e: Expr, value: boolean): boolean => e.type === 'const' && e.value === value

// ~~X → X
const doubleNegation: Rule = {
  id: 'doubleNegation',
  apply: (e) => (e.type === 'not' && e.arg.type === 'not' ? e.arg.arg : null),
}

// ~(X & Y) → ~X + ~Y   |   ~(X + Y) → ~X & ~Y
const deMorgan: Rule = {
  id: 'deMorgan',
  apply: (e) => {
    if (e.type !== 'not') return null
    const inner = e.arg
    if (inner.type === 'and') return or(not(inner.left), not(inner.right))
    if (inner.type === 'or') return and(not(inner.left), not(inner.right))
    return null
  },
}

// ~0 → 1   |   ~1 → 0
const constantNegation: Rule = {
  id: 'constantNegation',
  apply: (e) => (e.type === 'not' && e.arg.type === 'const' ? c(!e.arg.value) : null),
}

// X & ~X → 0   |   X + ~X → 1
const complement: Rule = {
  id: 'complement',
  apply: (e) => {
    if (e.type !== 'and' && e.type !== 'or') return null
    return isNegationOf(e.left, e.right) ? c(e.type === 'or') : null
  },
}

// X & 0 → 0   |   X + 1 → 1
const annulment: Rule = {
  id: 'annulment',
  apply: (e) => {
    if (e.type === 'and' && (isConst(e.left, false) || isConst(e.right, false))) return c(false)
    if (e.type === 'or' && (isConst(e.left, true) || isConst(e.right, true))) return c(true)
    return null
  },
}

// X & 1 → X   |   X + 0 → X
const identity: Rule = {
  id: 'identity',
  apply: (e) => {
    if (e.type === 'and') {
      if (isConst(e.right, true)) return e.left
      if (isConst(e.left, true)) return e.right
    }
    if (e.type === 'or') {
      if (isConst(e.right, false)) return e.left
      if (isConst(e.left, false)) return e.right
    }
    return null
  },
}

// X & X → X   |   X + X → X
const idempotence: Rule = {
  id: 'idempotence',
  apply: (e) => ((e.type === 'and' || e.type === 'or') && equals(e.left, e.right) ? e.left : null),
}

// X + (X & Y) → X   |   X & (X + Y) → X   (testando os dois lados e as duas ordens)
const absorption: Rule = {
  id: 'absorption',
  apply: (e) => {
    if (e.type !== 'and' && e.type !== 'or') return null
    const innerType = e.type === 'or' ? 'and' : 'or'

    const absorbs = (x: Expr, other: Expr): boolean =>
      other.type === innerType && (equals(other.left, x) || equals(other.right, x))

    if (absorbs(e.left, e.right)) return e.left
    if (absorbs(e.right, e.left)) return e.right
    return null
  },
}

// Ordem = prioridade. Regras que "encolhem" a expressão vêm antes das que expandem.
export const RULES: Rule[] = [
  constantNegation,
  doubleNegation,
  complement,
  annulment,
  identity,
  idempotence,
  absorption,
  deMorgan,
]
