# Simplificador de expressões booleanas

Simplificador de expressões booleanas que mostra **cada lei aplicada**, do começo ao fim, junto com a tabela verdade e um manual das leis da álgebra booleana.

**Acesse em:** https://jaianeoliveira.github.io/boolean_expr_simplifier/

<img width="2032" height="1088" alt="Captura de Tela 2026-10-14 às 20 38 31" src="https://github.com/user-attachments/assets/17df81c4-5674-43b8-b63e-03d68273e607" />

## O que ele faz

- **Simplificação passo a passo** — cada passo mostra a lei usada e destaca o trecho da expressão que foi transformado.
- **Verificação de equivalência** — o resultado é comparado com a entrada em todas as combinações de valores das variáveis.
- **Tabela verdade** da expressão digitada.
- **Manual** com as leis da álgebra booleana usadas pelo motor.
- **Três notações**, à escolha, tanto na entrada quanto na saída.
- Teclado de símbolos, exemplos aleatórios e tema claro/escuro.

## Sintaxe

| Operação | Padrão | Lógica | Programação | Também aceito |
| -------- | :----: | :----: | :---------: | :-----------: |
| NÃO      |  `~`   |  `¬`   |     `!`     |               |
| E        |  `&`   |  `∧`   |    `&&`     |   `·` `*`     |
| OU       |  `+`   |  `∨`   |    `\|\|`   |     `\|`      |

- **Variáveis:** uma letra cada (`A`–`Z`, maiúsculas ou minúsculas — `a` vira `A`).
- **Constantes:** `0` e `1`.
- **Precedência:** NÃO > E > OU. Use parênteses para mudar a ordem.
- As notações podem ser misturadas na mesma expressão: `!A ∧ (B + C)` é válido.

Exemplos:

```
~((~A + B) & (~B + C))
A + (A & B) + (~~C & 1)
~(~A & ~B) & (A + B)
```

## Leis aplicadas

O motor procura, de cima para baixo na árvore, a primeira lei que transforma algum trecho e repete até nenhuma lei mudar mais nada. As leis são tentadas nesta ordem (as que reduzem a expressão vêm antes das que a expandem):

| Lei               | Forma                                         |
| ----------------- | --------------------------------------------- |
| Negação de constante | `~0 → 1`, `~1 → 0`                         |
| Dupla negação     | `~~X → X`                                     |
| Complemento       | `X & ~X → 0`, `X + ~X → 1`                    |
| Anulação          | `X & 0 → 0`, `X + 1 → 1`                      |
| Identidade        | `X & 1 → X`, `X + 0 → X`                      |
| Idempotência      | `X & X → X`, `X + X → X`                      |
| Absorção          | `X + (X & Y) → X`, `X & (X + Y) → X`          |
| De Morgan         | `~(X & Y) → ~X + ~Y`, `~(X + Y) → ~X & ~Y`    |

**Limitação:** o motor não aplica distributiva nem consenso, então o resultado é sempre equivalente à entrada, mas nem sempre é a forma mínima.

## Rodando localmente

Requer Node 22+.

```bash
npm install
npm run dev        # http://localhost:5173/boolean_expr_simplifier/
npm test           # testes do motor (Vitest)
npm run build      # checa tipos e gera o site estático em dist/
npm run preview    # serve o build localmente
```

## Estrutura

```
src/
  engine/                  motor em TypeScript puro, sem React
    lexer.ts                 texto → tokens (as três notações viram os mesmos tokens)
    parser.ts                tokens → árvore (parser descendente recursivo)
    rules.ts                 as leis da álgebra booleana, uma função por lei
    simplify.ts              aplica as leis até nenhuma mudar nada e registra os passos
    printer.ts               árvore → texto na notação escolhida, com destaque do trecho
    truthTable.ts            avaliação, tabela verdade e verificação de equivalência
    errors.ts                erros por código; a interface traduz via i18n
    engine.test.ts           testes do motor
  hooks/useSimplifier.ts   estado da tela (texto, notação, resultado, erro)
  components/              Header, ExpressionForm, SymbolKeypad, ResultPanel,
                           StepTimeline, TruthTablePanel, ManualPanel
  i18n/locales/pt-BR.json  todos os textos da interface
  styles/global.css        tokens de cor (claro e escuro) e estilos base
  constants.ts             notações, operadores e exemplos
```

O motor (`src/engine`) não depende de React nem de textos da interface: recebe uma string e devolve árvore, passos ou um código de erro. Isso permite testá-lo isoladamente e reaproveitá-lo fora da UI.

## Stack

React 19 · TypeScript · Vite · CSS Modules · i18next · Vitest

## Deploy

Todo push na `main` dispara o workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), que roda os testes, gera o build e publica no GitHub Pages. O caminho base (`/boolean_expr_simplifier/`) está definido em [`vite.config.ts`](vite.config.ts) — se o repositório for renomeado, atualize ali.
