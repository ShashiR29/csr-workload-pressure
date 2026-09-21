import {
  Badge,
  Button,
  Spinner,
  Text,
} from '@fluentui/react-components'
import {
  AlertRegular,
  SparkleRegular,
  ThumbDislikeRegular,
  ThumbLikeRegular,
} from '@fluentui/react-icons'
import { useEffect, useState } from 'react'

type SummaryState = 'idle' | 'generating' | 'complete'
type Feedback = 'helpful' | 'not-helpful' | null

type CcaIncidentAssistantProps = {
  incidentId: string
  severity: string
  service: string
  owner: string
  signals: string[]
  onAssign: () => void
  onEscalate: () => void
}

export function CcaIncidentAssistant({
  incidentId,
  severity,
  service,
  owner,
  signals,
  onAssign,
  onEscalate,
}: CcaIncidentAssistantProps) {
  const [summaryState, setSummaryState] = useState<SummaryState>('idle')
  const [feedback, setFeedback] = useState<Feedback>(null)
  const [assistantNotice, setAssistantNotice] = useState('')

  useEffect(() => {
    if (summaryState !== 'generating') return

    const completionTimer = window.setTimeout(() => setSummaryState('complete'), 1400)
    return () => window.clearTimeout(completionTimer)
  }, [summaryState])

  const generateSummary = () => {
    setFeedback(null)
    setAssistantNotice('')
    setSummaryState('generating')
  }

  const summaryText = `${severity} service degradation is affecting ${service}. The strongest current indicator is ${signals[0]?.toLowerCase()}. ${signals[2] ?? signals[1] ?? 'The available signals do not identify a recent change.'} may be related, but causation is not verified. ${owner === 'Unassigned' ? 'Establish an owner, then validate the signal trend before escalating.' : `Coordinate with ${owner} and continue monitoring before changing the incident state.`}`

  return (
    <section className="incident-assistant" aria-labelledby={`assistant-title-${incidentId}`}>
      <div className="assistant-heading">
        <div>
          <span className="assistant-icon"><SparkleRegular /></span>
          <div>
            <Text as="h3" id={`assistant-title-${incidentId}`} weight="semibold">Incident assistant</Text>
            <Text size={200}>Experimental CCA-style pattern</Text>
          </div>
        </div>
        <Badge appearance="outline">Simulated</Badge>
      </div>

      {summaryState === 'idle' && (
        <div className="assistant-idle">
          <Text>Generate a concise briefing from this incident's dummy signals.</Text>
          <Button appearance="primary" icon={<SparkleRegular />} onClick={generateSummary}>Generate summary</Button>
        </div>
      )}

      <div className="assistant-status" aria-live="polite" aria-atomic="true">
        {summaryState === 'generating' && (
          <Spinner size="tiny" labelPosition="after" label="Reviewing signals and preparing a summary..." />
        )}
      </div>

      {summaryState === 'complete' && (
        <div className="assistant-response">
          <div className="assistant-disclaimer">
            <Text size={200} weight="semibold">Simulated AI summary</Text>
            <Text size={200}>Generated from dummy incident data for this learning prototype.</Text>
          </div>

          <div className="toolkit-case-summary">
            <Text>{summaryText}</Text>
            <div className="summary-actions">
              <Button size="small" onClick={() => { void navigator.clipboard.writeText(summaryText); setAssistantNotice('Summary copied.') }}>Copy</Button>
              <Button size="small" onClick={generateSummary}>Regenerate</Button>
              <Button size="small" appearance={feedback === 'helpful' ? 'primary' : 'secondary'} icon={<ThumbLikeRegular />} onClick={() => { setFeedback('helpful'); setAssistantNotice('Feedback recorded for this session.') }}>Helpful</Button>
              <Button size="small" appearance={feedback === 'not-helpful' ? 'primary' : 'secondary'} icon={<ThumbDislikeRegular />} onClick={() => { setFeedback('not-helpful'); setAssistantNotice('Feedback recorded for this session.') }}>Not helpful</Button>
            </div>
          </div>

          <div className="assistant-sources" aria-label="Summary sources">
            <Text size={200} weight="semibold">Sources</Text>
            <ol>{signals.map((signal, index) => <li key={signal}><a href={`#signal-${incidentId}-${index}`} title="Go to dummy incident signal">{signal}</a></li>)}</ol>
          </div>

          <div className="assistant-suggestions">
            {owner === 'Unassigned' && <Button size="small" onClick={onAssign}>Assign to me</Button>}
            <Button size="small" icon={<AlertRegular />} onClick={onEscalate}>Escalate</Button>
          </div>

          <div className="assistant-feedback" role="status"><Text size={200}>{assistantNotice || (feedback ? 'Feedback recorded for this session.' : 'Review the summary before taking action.')}</Text></div>
        </div>
      )}
    </section>
  )
}