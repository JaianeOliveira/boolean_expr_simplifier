import { RULES, equals, type Rule } from './rules'
import type { Expr, Path, Step } from './types'

const MAX_STEPS = 100

type Match = { path: Path; rule: Rule; replacement: Expr }

// Percorre a árvore de cima para baixo e devolve a primeira regra que casa
const findMatch = (e: Expr, path: Path = []): Match | null => {
  for (const rule of RULES) {
    const replacement = rule.apply(e)
    // Ignora "passos" que não mudam nada (o bug dos Associativa repetidos)
    if (replacement && !equals(replacement, e)) return { path, rule, replacement }
  }

  switch (e.type) {
    case 'not':
      return findMatch(e.arg, [...path, 'arg'])
    case 'and':
    case 'or':
      return findMatch(e.left, [...path, 'left']) ?? findMatch(e.right, [...path, 'right'])
    default:
      return null
  }
}

// Troca o nó em `path` por `replacement`, sem mutar a árvore original
const replaceAt = (e: Expr, path: Path, replacement: Expr): Expr => {
  if (path.length === 0) return replacement
  const [head, ...rest] = path

  if (head === 'arg' && e.type === 'not') return { ...e, arg: replaceAt(e.arg, rest, replacement) }
  if (head === 'left' && (e.type === 'and' || e.type === 'or'))
    return { ...e, left: replaceAt(e.left, rest, replacement) }
  if (head === 'right' && (e.type === 'and' || e.type === 'or'))
    return { ...e, right: replaceAt(e.right, rest, replacement) }

  throw new Error(`Caminho inválido: ${path.join('.')}`)
}

export const simplify = (input: Expr): { result: Expr; steps: Step[] } => {
  const steps: Step[] = []
  let current = input

  for (let i = 0; i < MAX_STEPS; i++) {
    const match = findMatch(current)
    if (!match) break

    const next = replaceAt(current, match.path, match.replacement)
    steps.push({ ruleId: match.rule.id, before: current, after: next, path: match.path })
    current = next
  }

  return { result: current, steps }
}
