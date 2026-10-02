import { useTranslation } from 'react-i18next'
import { KEYPAD_VARIABLES, OPERATORS } from '../constants'
import type { Notation } from '../engine'
import { BackspaceIcon } from './Icons'
import styles from './SymbolKeypad.module.css'

type SymbolKeypadProps = {
  notation: Notation
  onInsert: (value: string) => void
  onBackspace: () => void
}

export const SymbolKeypad = ({ notation, onInsert, onBackspace }: SymbolKeypadProps) => {
  const { t } = useTranslation()
  const ops = OPERATORS[notation]

  // Operadores binários entram com espaço dos dois lados, para a expressão ficar legível
  const operatorKeys = [
    { symbol: ops.not, insert: ops.not, label: t('operators.not') },
    { symbol: ops.and, insert: ` ${ops.and} `, label: t('operators.and') },
    { symbol: ops.or, insert: ` ${ops.or} `, label: t('operators.or') },
  ]

  return (
    <div className={styles.keypad}>
      <div className={styles.group}>
        {operatorKeys.map((key) => (
          <button
            key={key.label}
            type="button"
            className={`${styles.key} ${styles.operator}`}
            aria-label={key.label}
            onClick={() => onInsert(key.insert)}
          >
            {key.symbol}
            <span className={styles.hint}>{key.label}</span>
          </button>
        ))}
        <button type="button" className={styles.key} aria-label={t('operators.openParen')} onClick={() => onInsert('(')}>
          (
        </button>
        <button type="button" className={styles.key} aria-label={t('operators.closeParen')} onClick={() => onInsert(')')}>
          )
        </button>
      </div>

      <div className={styles.divider} aria-hidden />

      <div className={styles.group}>
        {KEYPAD_VARIABLES.map((variable) => (
          <button key={variable} type="button" className={styles.key} onClick={() => onInsert(variable)}>
            {variable}
          </button>
        ))}
        <button
          type="button"
          className={`${styles.key} ${styles.muted}`}
          aria-label={t('form.backspace')}
          onClick={onBackspace}
        >
          <BackspaceIcon />
        </button>
      </div>
    </div>
  )
}
