import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styles from './App.module.css'
import { ExpressionForm } from './components/ExpressionForm'
import { Header, type Tab, type Theme } from './components/Header'
import { ManualPanel } from './components/ManualPanel'
import { ResultPanel } from './components/ResultPanel'
import { StepTimeline } from './components/StepTimeline'
import { TruthTablePanel } from './components/TruthTablePanel'
import { useSimplifier } from './hooks/useSimplifier'

const THEME_STORAGE_KEY = 'logic_reduce:theme'

const readStoredTheme = (): Theme => {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    // localStorage pode estar indisponível (aba anônima, por exemplo)
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const App = () => {
  const { t } = useTranslation()
  const [tab, setTab] = useState<Tab>('simplify')
  const [theme, setTheme] = useState<Theme>(readStoredTheme)
  const simplifier = useSimplifier()

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch {
      // ignora: o tema só não fica salvo
    }
  }, [theme])

  const handleToggleTheme = () => setTheme((current) => (current === 'light' ? 'dark' : 'light'))

  return (
    <>
      <Header tab={tab} onTabChange={setTab} theme={theme} onToggleTheme={handleToggleTheme} />

      <main className={styles.main}>
        {tab === 'simplify' && (
          <>
            <div className={styles.intro}>
              <h1 className={styles.title}>{t('simplify.title')}</h1>
              <p className={styles.subtitle}>{t('simplify.subtitle')}</p>
            </div>

            <ExpressionForm
              text={simplifier.text}
              onTextChange={simplifier.setText}
              notation={simplifier.notation}
              onNotationChange={simplifier.changeNotation}
              onSubmit={simplifier.submit}
              onRandomExample={simplifier.loadRandomExample}
              error={simplifier.error}
            />

            {simplifier.analysis && (
              <>
                <ResultPanel
                  analysis={simplifier.analysis}
                  notation={simplifier.notation}
                  onOpenTruthTable={() => setTab('truthTable')}
                />
                <StepTimeline steps={simplifier.analysis.steps} notation={simplifier.notation} />
              </>
            )}
          </>
        )}

        {tab === 'truthTable' && (
          <TruthTablePanel
            analysis={simplifier.analysis}
            notation={simplifier.notation}
            onBack={() => setTab('simplify')}
          />
        )}

        {tab === 'manual' && <ManualPanel />}
      </main>
    </>
  )
}

export default App
