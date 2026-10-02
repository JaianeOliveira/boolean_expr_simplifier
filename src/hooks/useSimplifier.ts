import { useCallback, useState } from 'react'
import { DEFAULT_EXPRESSION, EXAMPLES } from '../constants'
import {
  EngineError,
  areEquivalent,
  parse,
  print,
  simplify,
  variablesOf,
  type Expr,
  type Notation,
  type Step,
} from '../engine'

export type Analysis = {
  input: Expr
  result: Expr
  steps: Step[]
  variables: string[]
  equivalent: boolean
}

type Outcome = { analysis: Analysis; error: null } | { analysis: null; error: EngineError }

const analyze = (text: string): Outcome => {
  try {
    const input = parse(text)
    const { result, steps } = simplify(input)
    return {
      analysis: { input, result, steps, variables: variablesOf(input), equivalent: areEquivalent(input, result) },
      error: null,
    }
  } catch (error) {
    if (error instanceof EngineError) return { analysis: null, error }
    throw error
  }
}

// Reescreve o texto na nova notação, se ele já for uma expressão válida
const convertNotation = (text: string, notation: Notation): string => {
  try {
    return print(parse(text), notation)
  } catch {
    return text
  }
}

const pickRandomExample = (current: string): string => {
  const options = EXAMPLES.filter((example) => example !== current)
  return options[Math.floor(Math.random() * options.length)]
}

export const useSimplifier = () => {
  const [text, setText] = useState(DEFAULT_EXPRESSION)
  const [notation, setNotation] = useState<Notation>('padrao')
  const [outcome, setOutcome] = useState<Outcome>(() => analyze(DEFAULT_EXPRESSION))

  const submit = useCallback(() => setOutcome(analyze(text)), [text])

  const changeNotation = useCallback(
    (next: Notation) => {
      setNotation(next)
      setText(convertNotation(text, next))
    },
    [text],
  )

  const loadRandomExample = useCallback(() => {
    const example = convertNotation(pickRandomExample(text), notation)
    setText(example)
    setOutcome(analyze(example))
  }, [text, notation])

  return {
    text,
    setText,
    notation,
    changeNotation,
    submit,
    loadRandomExample,
    analysis: outcome.analysis,
    error: outcome.error,
  }
}
