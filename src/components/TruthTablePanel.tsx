import { useTranslation } from 'react-i18next'
import { print, truthTable, type Notation } from '../engine'
import type { Analysis } from '../hooks/useSimplifier'
import styles from './Panel.module.css'

type TruthTablePanelProps = {
  analysis: Analysis | null
  notation: Notation
  onBack: () => void
}

const toBit = (value: boolean) => (value ? 1 : 0)

export const TruthTablePanel = ({ analysis, notation, onBack }: TruthTablePanelProps) => {
  const { t } = useTranslation()

  if (!analysis) {
    return (
      <div className={styles.page}>
        <h1 className={styles.title}>{t('truthTable.title')}</h1>
        <p className={styles.subtitle}>{t('truthTable.empty')}</p>
        <button type="button" className={styles.backButton} onClick={onBack}>
          {t('truthTable.back')}
        </button>
      </div>
    )
  }

  const { variables } = analysis
  const inputRows = truthTable(analysis.input, variables)
  const resultRows = truthTable(analysis.result, variables)

  return (
    <div className={styles.page}>
      <div className={styles.intro}>
        <h1 className={styles.title}>{t('truthTable.title')}</h1>
        <p className={styles.subtitle}>{t('truthTable.subtitle')}</p>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              {variables.map((name) => (
                <th key={name} scope="col">
                  {name}
                </th>
              ))}
              <th scope="col" className={styles.exprHeader}>
                <span className={styles.exprLabel}>{t('truthTable.original')}</span>
                {print(analysis.input, notation)}
              </th>
              <th scope="col" className={styles.exprHeader}>
                <span className={styles.exprLabel}>{t('truthTable.simplified')}</span>
                {print(analysis.result, notation)}
              </th>
            </tr>
          </thead>
          <tbody>
            {inputRows.map((row, index) => (
              <tr key={index} className={row.value ? styles.trueRow : undefined}>
                {variables.map((name) => (
                  <td key={name}>{toBit(row.env[name])}</td>
                ))}
                <td className={styles.valueCell}>{toBit(row.value)}</td>
                <td className={styles.valueCell}>{toBit(resultRows[index].value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
