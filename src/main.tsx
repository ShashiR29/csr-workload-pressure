import { FluentProvider, webLightTheme } from '@fluentui/react-components'
import { createRoot } from 'react-dom/client'
import './index.css'
import TriageApp from './TriageApp.tsx'

createRoot(document.getElementById('root')!).render(
  <FluentProvider theme={webLightTheme}>
    <TriageApp />
  </FluentProvider>,
)
