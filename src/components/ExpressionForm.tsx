import { useRef, type ChangeEvent, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { NOTATIONS, OPERATORS } from '../constants'
import type { EngineError, Notation } from '../engine'
import styles from './ExpressionForm.module.css'
import { ArrowRightIcon, CloseIcon, ShuffleIcon } from './Icons'
import { SymbolKeypad } from './SymbolKeypad'

type ExpressionFormProps = {
  text: string
  onTextChange: (text: string) => void
  notation: Notation
  onNotationChange: (notation: Notation) => void
  onSubmit: () => void
  onRandomExample: () => void
  error: EngineError | null
}

export const ExpressionForm = ({
  text,
  onTextChange,
  notation,
  onNotationChange,
  onSubmit,
  onRandomExample,
  error,
}: ExpressionFormProps) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>(null)

  // Recoloca o foco e o cursor depois que o React atualizar o valor
  const placeCursor = (position: number) => {
    requestAnimationFrame(() => {
      inputRef.current?.focus()
      inputRef.current?.setSelectionRange(position, position)
    })
  }

  const getSelection = () => {
    const input = inputRef.current
    const start = input?.selectionStart ?? text.length
    const end = input?.selectionEnd ?? text.length
    return { start, end }
  }

  const handleInsert = (value: string) => {
    const { start, end } = getSelection()
    onTextChange(text.slice(0, start) + value + text.slice(end))
    placeCursor(start + value.length)
  }

  const handleBackspace = () => {
    const { start, end } = getSelection()
    const from = start === end ? Math.max(0, start - 1) : start
    onTextChange(text.slice(0, from) + text.slice(end))
    placeCursor(from)
  }

  const handleClear = () => {
    onTextChange('')
    placeCursor(0)
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    onSubmit()
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => onTextChange(event.target.value)

  return (
    <form className={styles.card} onSubmit={handleSubmit} noValidate>
      <div className={styles.row}>
        <span className={styles.label} id="notation-label">
          {t('form.notation')}
        </span>
        <div role="radiogroup" aria-labelledby="notation-label" className={styles.segmented}>
          {NOTATIONS.map((item) => {
            const ops = OPERATORS[item]
            return (
              <button
                key={item}
                type="button"
                role="radio"
                aria-checked={item === notation}
                className={styles.segment}
                onClick={() => onNotationChange(item)}
              >
                {t(`notation.${item}`)}
                <span className={styles.segmentSymbols}>{`${ops.not} ${ops.and} ${ops.or}`}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="expression" className={styles.label}>
          {t('form.expression')}
        </label>
        <div className={styles.inputRow}>
          <div className={styles.inputWrap}>
            <input
              id="expression"
              ref={inputRef}
              className={styles.input}
              value={text}
              onChange={handleInputChange}
              autoComplete="off"
              spellCheck={false}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? 'expression-error' : undefined}
            />
            {text && (
              <button type="button" className={styles.clear} aria-label={t('form.clear')} onClick={handleClear}>
                <CloseIcon />
              </button>
            )}
          </div>
          <button type="submit" className={styles.submit}>
            {t('simplify.submit')}
            <ArrowRightIcon />
          </button>
        </div>
        {error && (
          <p id="expression-error" className={styles.error} role="alert">
            {t(`errors.${error.code}`, { token: error.token })}
            <span className={styles.errorPos}>{t('form.errorAt', { pos: error.pos + 1 })}</span>
          </p>
        )}
      </div>

      <div className={styles.field}>
        <div className={styles.row}>
          <span className={styles.caption}>{t('form.keypad')}</span>
          <button type="button" className={styles.linkButton} onClick={onRandomExample}>
            <ShuffleIcon />
            {t('form.random')}
          </button>
        </div>
        <SymbolKeypad notation={notation} onInsert={handleInsert} onBackspace={handleBackspace} />
      </div>
    </form>
  )
}
