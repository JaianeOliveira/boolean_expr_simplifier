import { useTranslation } from 'react-i18next'
import styles from './Header.module.css'
import { MoonIcon, SunIcon } from './Icons'

export type Tab = 'simplify' | 'truthTable' | 'manual'
export type Theme = 'light' | 'dark'

const TABS: Tab[] = ['simplify', 'truthTable', 'manual']

type HeaderProps = {
  tab: Tab
  onTabChange: (tab: Tab) => void
  theme: Theme
  onToggleTheme: () => void
}

export const Header = ({ tab, onTabChange, theme, onToggleTheme }: HeaderProps) => {
  const { t } = useTranslation()

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <div className={styles.brand}>
          <span className={styles.logo} aria-hidden>
            ¬
          </span>
          <span>{t('app.name')}</span>
        </div>
        <nav aria-label={t('nav.label')} className={styles.nav}>
          {TABS.map((item) => (
            <button
              key={item}
              type="button"
              className={styles.tab}
              aria-current={item === tab ? 'page' : undefined}
              onClick={() => onTabChange(item)}
            >
              {t(`nav.${item}`)}
            </button>
          ))}
        </nav>
      </div>
      <button
        type="button"
        className={styles.themeButton}
        aria-label={theme === 'light' ? t('theme.toDark') : t('theme.toLight')}
        onClick={onToggleTheme}
      >
        {theme === 'light' ? <MoonIcon /> : <SunIcon />}
      </button>
    </header>
  )
}
