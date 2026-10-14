# logic_reduce
https://jaianeoliveira.github.io/boolean_expr_simplifier/
Simplificador de expressões booleanas com passo a passo, tabela verdade e manual das leis.

## Rodando

```bash
npm install
npm run dev      # abre em http://localhost:5173
npm test         # testes do motor (Vitest)
npm run build    # gera o site estático em dist/
```

## Estrutura

```
src/
  engine/        motor em TypeScript puro, sem React
    lexer.ts       texto → tokens (as 3 notações viram os mesmos tokens)
    parser.ts      tokens → árvore (parser descendente recursivo)
    rules.ts       as leis da álgebra booleana, uma função por lei
    simplify.ts    aplica as leis até nenhuma mudar nada e registra os passos
    printer.ts     árvore → texto, na notação escolhida, com destaque do trecho
    truthTable.ts  avaliação, tabela verdade e verificação de equivalência
    errors.ts      erros por código; a UI traduz via i18n
  hooks/useSimplifier.ts   estado da tela (texto, notação, resultado, erro)
  components/              Header, ExpressionForm, SymbolKeypad, ResultPanel,
                           StepTimeline, TruthTablePanel, ManualPanel
  i18n/locales/pt-BR.json  todos os textos da interface
  styles/global.css        tokens de cor (claro e escuro) e base
```

## Deploy

É um site estático: conecte o repositório na Vercel, Netlify ou Cloudflare Pages
com o comando de build `npm run build` e a pasta de saída `dist`.
