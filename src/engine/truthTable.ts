import type { Expr } from './types'

export type Env = Record<string, boolean>

export const evaluate = (e: Expr, env: Env): boolean => {
  switch (e.type) {
    case 'var':
      return env[e.name] ?? false
    case 'const':
      return e.value
    case 'not':
      return !evaluate(e.arg, env)
    case 'and':
      return evaluate(e.left, env) && evaluate(e.right, env)
    case 'or':
      return evaluate(e.left, env) || evaluate(e.right, env)
  }
}

export const variablesOf = (e: Expr, acc: Set<string> = new Set()): string[] => {
  if (e.type === 'var') acc.add(e.name)
  if (e.type === 'not') variablesOf(e.arg, acc)
  if (e.type === 'and' || e.type === 'or') {
    variablesOf(e.left, acc)
    variablesOf(e.right, acc)
  }
  return [...acc].sort()
}

// Cada linha é um número de 0 a 2^n - 1; cada bit é o valor de uma variável
export const truthTable = (e: Expr, vars: string[] = variablesOf(e)) =>
  Array.from({ length: 2 ** vars.length }, (_, row) => {
    const env: Env = Object.fromEntries(
      vars.map((name, i) => [name, Boolean((row >> (vars.length - 1 - i)) & 1)]),
    )
    return { env, value: evaluate(e, env) }
  })

// Duas expressões são equivalentes se dão o mesmo valor em TODAS as combinações
export const areEquivalent = (a: Expr, b: Expr): boolean => {
  const vars = [...new Set([...variablesOf(a), ...variablesOf(b)])].sort()
  const tableA = truthTable(a, vars)
  const tableB = truthTable(b, vars)
  return tableA.every((row, i) => row.value === tableB[i].value)
}
