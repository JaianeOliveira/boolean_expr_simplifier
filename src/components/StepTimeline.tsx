import { useTranslation } from 'react-i18next'
import { printHighlighted, type Notation, type Step } from '../engine'
import { CheckIcon } from './Icons'
import styles from './StepTimeline.module.css'

type StepTimelineProps = {
  steps: Step[]
  notation: Notation
}

type HighlightedLineProps = {
  pre: string
  hit: string
  post: string
  variant: 'before' | 'after'
}

const HighlightedLine = ({ pre, hit, post, variant }: HighlightedLineProps) => (
  <span>
    {pre}
    <mark className={styles[variant]}>{hit}</mark>
    {post}
  </span>
)

export const StepTimeline = ({ steps, notation }: StepTimelineProps) => {
  const { t } = useTranslation()

  return (
    <section aria-labelledby="steps-title" className={styles.section}>
      <div className={styles.header}>
        <h2 id="steps-title" className={styles.title}>
          {t('steps.title')}
        </h2>
        {steps.length > 0 && (
          <div className={styles.legend}>
            <span className={styles.legendItem}>
              <span className={`${styles.swatch} ${styles.before}`} />
              {t('steps.legendBefore')}
            </span>
            <span className={styles.legendItem}>
              <span className={`${styles.swatch} ${styles.after}`} />
              {t('steps.legendAfter')}
            </span>
          </div>
        )}
      </div>

      {steps.length === 0 ? (
        <p className={styles.empty}>{t('steps.alreadySimple')}</p>
      ) : (
        <ol className={styles.list}>
          {steps.map((step, index) => (
            <li key={index} className={styles.item}>
              <div className={styles.rail}>
                <span className={styles.number}>{index + 1}</span>
                <span className={styles.line} />
              </div>
              <div className={styles.card}>
                <div className={styles.law}>
                  <span className={styles.lawName}>{t(`laws.${step.ruleId}.name`)}</span>
                  <span className={styles.lawDescription}>— {t(`laws.${step.ruleId}.description`)}</span>
                </div>
                <div className={styles.expressions}>
                  <div className={styles.exprRow}>
                    <span className={styles.exprLabel}>{t('steps.from')}</span>
                    <HighlightedLine {...printHighlighted(step.before, step.path, notation)} variant="before" />
                  </div>
                  <div className={styles.exprRow}>
                    <span className={styles.exprLabel} aria-hidden>
                      ⇒
                    </span>
                    <HighlightedLine {...printHighlighted(step.after, step.path, notation)} variant="after" />
                  </div>
                </div>
              </div>
            </li>
          ))}
          <li className={styles.item}>
            <span className={styles.done}>
              <CheckIcon />
            </span>
            <div className={styles.doneText}>
              <span className={styles.doneTitle}>{t('steps.doneTitle')}</span>
              <span className={styles.doneDescription}>{t('steps.doneDescription')}</span>
            </div>
          </li>
        </ol>
      )}
    </section>
  )
}
