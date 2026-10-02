import { useTranslation } from 'react-i18next'
import { NOTATIONS, OPERATORS } from '../constants'
import { RULES } from '../engine'
import styles from './Panel.module.css'

// Padrões de cada lei, na notação padrão (são símbolos, não texto traduzível)
const LAW_PATTERNS: Record<string, string[]> = {
  constantNegation: ['~0 ⇒ 1', '~1 ⇒ 0'],
  doubleNegation: ['~~X ⇒ X'],
  complement: ['X & ~X ⇒ 0', 'X + ~X ⇒ 1'],
  annulment: ['X & 0 ⇒ 0', 'X + 1 ⇒ 1'],
  identity: ['X & 1 ⇒ X', 'X + 0 ⇒ X'],
  idempotence: ['X & X ⇒ X', 'X + X ⇒ X'],
  absorption: ['X + (X & Y) ⇒ X', 'X & (X + Y) ⇒ X'],
  deMorgan: ['~(X & Y) ⇒ ~X + ~Y', '~(X + Y) ⇒ ~X & ~Y'],
}

export const ManualPanel = () => {
  const { t } = useTranslation()

  return (
    <div className={styles.page}>
      <div className={styles.intro}>
        <h1 className={styles.title}>{t('manual.title')}</h1>
        <p className={styles.subtitle}>{t('manual.subtitle')}</p>
      </div>

      <section className={styles.block} aria-labelledby="operators-title">
        <h2 id="operators-title" className={styles.blockTitle}>
          {t('manual.operatorsTitle')}
        </h2>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col" />
                {NOTATIONS.map((notation) => (
                  <th key={notation} scope="col">
                    {t(`notation.${notation}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(['not', 'and', 'or'] as const).map((op) => (
                <tr key={op}>
                  <th scope="row">{t(`operators.${op}`)}</th>
                  {NOTATIONS.map((notation) => (
                    <td key={notation}>{OPERATORS[notation][op]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className={styles.block} aria-labelledby="laws-title">
        <h2 id="laws-title" className={styles.blockTitle}>
          {t('manual.lawsTitle')}
        </h2>
        <ol className={styles.laws}>
          {RULES.map((rule) => (
            <li key={rule.id} className={styles.lawCard}>
              <span className={styles.lawName}>{t(`laws.${rule.id}.name`)}</span>
              <span className={styles.lawDescription}>{t(`laws.${rule.id}.description`)}</span>
              <span className={styles.patterns}>
                {LAW_PATTERNS[rule.id]?.map((pattern) => (
                  <code key={pattern}>{pattern}</code>
                ))}
              </span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}
