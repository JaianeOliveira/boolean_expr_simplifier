import { useEffect, useState, type MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { print, type Notation } from '../engine'
import type { Analysis } from '../hooks/useSimplifier'
import { ArrowRightIcon, CheckIcon, CopyIcon } from './Icons'
import styles from './ResultPanel.module.css'

type ResultPanelProps = {
  analysis: Analysis
  notation: Notation
  onOpenTruthTable: () => void
}

const COPIED_FEEDBACK_MS = 2000

const formatList = (items: string[], locale: string) =>
  new Intl.ListFormat(locale, { style: 'long', type: 'conjunction' }).format(items)

export const ResultPanel = ({ analysis, notation, onOpenTruthTable }: ResultPanelProps) => {
  const { t, i18n } = useTranslation()
  const [copied, setCopied] = useState(false)

  const inputText = print(analysis.input, notation)
  const resultText = print(analysis.result, notation)
  const { variables } = analysis

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), COPIED_FEEDBACK_MS)
    return () => clearTimeout(timer)
  }, [copied])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(resultText)
    setCopied(true)
  }

  const handleOpenTruthTable = (event: MouseEvent) => {
    event.preventDefault()
    onOpenTruthTable()
  }

  const equivalenceText = () => {
    if (!analysis.equivalent) return t('result.notEquivalent')
    if (variables.length === 0) return t('result.equivalenceConstant')
    return t('result.equivalence', {
      count: 2 ** variables.length,
      variables: formatList(variables, i18n.language),
    })
  }

  return (
    <section aria-labelledby="result-title" className={styles.section}>
      <div className={styles.header}>
        <h2 id="result-title" className={styles.title}>
          {t('result.title')}
        </h2>
        <button type="button" className={styles.copy} onClick={handleCopy} aria-live="polite">
          {copied ? <CheckIcon /> : <CopyIcon />}
          {copied ? t('result.copied') : t('result.copy')}
        </button>
      </div>

      <div className={styles.equation}>
        <span />
        <span className={styles.original}>{inputText}</span>
        <span className={styles.equiv} aria-hidden>
          ≡
        </span>
        <output className={styles.result}>{resultText}</output>
      </div>

      <div className={styles.footnote}>
        <span className={analysis.equivalent ? undefined : styles.warning}>{equivalenceText()}</span>
        {variables.length > 0 && (
          <a href="#tabela-verdade" className={styles.link} onClick={handleOpenTruthTable}>
            {t('result.checkTruthTable')}
            <ArrowRightIcon size={14} />
          </a>
        )}
      </div>
    </section>
  )
}
