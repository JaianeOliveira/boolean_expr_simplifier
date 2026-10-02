// Nós da árvore sintática (AST)
export type Expr =
  | { type: 'var'; name: string }
  | { type: 'const'; value: boolean }
  | { type: 'not'; arg: Expr }
  | { type: 'and'; left: Expr; right: Expr }
  | { type: 'or'; left: Expr; right: Expr }

export type TokenType = 'NOT' | 'AND' | 'OR' | 'LPAREN' | 'RPAREN' | 'VAR' | 'CONST' | 'EOF'

export type Token = { type: TokenType; value: string; pos: number }

// Caminho até um nó: ['arg', 'left'] = root.arg.left
export type Path = Array<'arg' | 'left' | 'right'>

export type Notation = 'padrao' | 'logica' | 'programacao'

// O id da lei vai para a UI, que traduz via i18n (ex.: t(`laws.${ruleId}`))
export type Step = {
  ruleId: string
  before: Expr
  after: Expr
  path: Path
}

// Atalhos para montar nós
export const v = (name: string): Expr => ({ type: 'var', name })
export const c = (value: boolean): Expr => ({ type: 'const', value })
export const not = (arg: Expr): Expr => ({ type: 'not', arg })
export const and = (left: Expr, right: Expr): Expr => ({ type: 'and', left, right })
export const or = (left: Expr, right: Expr): Expr => ({ type: 'or', left, right })
