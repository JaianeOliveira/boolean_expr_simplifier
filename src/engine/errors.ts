// O motor não escreve mensagens: devolve um código e a UI traduz via i18n (errors.<code>)
export type EngineErrorCode =
  | 'emptyExpression'
  | 'unexpectedSymbol'
  | 'unexpectedToken'
  | 'unexpectedEnd'
  | 'unclosedParen'
  | 'trailingToken'

export class EngineError extends Error {
  constructor(
    public code: EngineErrorCode,
    public pos: number,
    public token = '',
  ) {
    super(code)
  }
}
