import {
  Avatar,
  Badge,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  ProgressBar,
  Tab,
  TabList,
  Text,
  Textarea,
  Title2,
} from '@fluentui/react-components'
import {
  ArrowTrendingLinesRegular,
  CheckmarkCircleRegular,
  PeopleTeamRegular,
  WarningRegular,
} from '@fluentui/react-icons'
import { useState } from 'react'

type Period = 'today' | 'week'
type SupportAction = 'coverage' | 'breaks' | 'training'

const availableCsrs = [
  { id: 'maya', name: 'Maya Chen', queue: 'Orders and delivery', availableFor: 'Available now', billingSkill: 'Advanced', recentDifficult: '1 in the last hour' },
  { id: 'jordan', name: 'Jordan Lee', queue: 'Orders and delivery', availableFor: 'Available in 5 min', billingSkill: 'Intermediate', recentDifficult: '0 in the last hour' },
] as const

const breakCandidates = [
  { id: 'priya', name: 'Priya Nair', queue: 'Billing support', consecutiveEmotional: 3, activeTime: '1h 18m since last break', breakWindow: 'Available now' },
  { id: 'alex', name: 'Alex Morgan', queue: 'Billing support', consecutiveEmotional: 2, activeTime: '54m since last break', breakWindow: 'Available in 6 min' },
] as const

const impactData = {
  today: {
    label: 'Today',
    totalContacts: 575,
    aiContacts: 391,
    humanContacts: 184,
    humanDifficult: 120,
    emotionalContacts: 31,
    waitTime: '8m 24s',
  },
  week: {
    label: 'Last 7 days',
    totalContacts: 3883,
    aiContacts: 2757,
    humanContacts: 1126,
    humanDifficult: 732,
    emotionalContacts: 167,
    waitTime: '6m 48s',
  },
} as const

// Per queue: difficultCount / queue CSR contacts = difficulty rate.
// Contacts 82 + 57 + 45 = 184 reached a CSR; difficult 62 + 38 + 20 = 120 (120/184 = 65%).
const teams = [
  { name: 'Billing support', staffed: 8, needed: 10, wait: '8m 24s', waitContext: '2m 24s above target', difficult: 76, difficultCount: 62, urgency: 'Highest in the last 7 days', action: 'Add coverage', color: 'danger' as const },
  { name: 'Account access', staffed: 6, needed: 7, wait: '4m 10s', waitContext: 'Within target', difficult: 67, difficultCount: 38, urgency: 'Consistently high for 3 hours', action: 'Monitor', color: 'warning' as const },
  { name: 'Orders and delivery', staffed: 7, needed: 7, wait: '2m 42s', waitContext: 'Below target', difficult: 44, difficultCount: 20, urgency: 'Easing over the last hour', action: 'No change', color: 'success' as const },
]

const supportActions = {
  coverage: {
    title: 'Temporary queue coverage',
    summary: 'Move two cross-skilled CSRs to Billing support for one hour.',
    detail: 'This may reduce the wait while difficult billing contacts remain high.',
    confirmation: 'Selected CSRs were notified about the temporary move to Billing support.',
  },
  breaks: {
    title: 'Recovery breaks',
    summary: 'Offer a 10-minute recovery break after back-to-back emotionally intense contacts.',
    detail: 'Two CSRs currently meet this simulated break rule. Stagger breaks to preserve queue coverage.',
    confirmation: 'Recovery breaks are scheduled for the selected CSRs.',
  },
  training: {
    title: 'Difficult-conversation refresher',
    summary: 'Assign a 12-minute learning module for de-escalation and billing disputes.',
    detail: 'Use a quiet period or scheduled learning time. Do not add training during peak queue pressure.',
    confirmation: 'The refresher is assigned for the next available learning period.',
  },
} as const

export default function AIImpactView() {
  const [period, setPeriod] = useState<Period>('today')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedAction, setSelectedAction] = useState<SupportAction>('coverage')
  const [appliedActions, setAppliedActions] = useState<SupportAction[]>([])
  const [selectedCsrIds, setSelectedCsrIds] = useState<string[]>(availableCsrs.map((csr) => csr.id))
  const [selectedBreakIds, setSelectedBreakIds] = useState<string[]>(breakCandidates.map((csr) => csr.id))
  const [coverageMessage, setCoverageMessage] = useState('Billing support has a high share of difficult contacts. Please move to the Billing support queue for one hour. I will review the queue again at the end of that hour.')
  const data = impactData[period]
  const aiShare = Math.round((data.aiContacts / data.totalContacts) * 100)
  const humanShare = Math.round((data.humanContacts / data.totalContacts) * 100)
  const humanDifficultShare = Math.round((data.humanDifficult / data.humanContacts) * 100)

  const reviewAction = (action: SupportAction) => {
    setSelectedAction(action)
    setDialogOpen(true)
  }

  const applyPlan = () => {
    setAppliedActions((current) => current.includes(selectedAction) ? current : [...current, selectedAction])
    setDialogOpen(false)
  }

  const selectedCsrNames = availableCsrs.filter((csr) => selectedCsrIds.includes(csr.id)).map((csr) => csr.name)
  const selectedBreakNames = breakCandidates.filter((csr) => selectedBreakIds.includes(csr.id)).map((csr) => csr.name)
  const estimatedReductionSeconds = Math.min(selectedCsrIds.length * 77, 154)
  const projectedWaitSeconds = 504 - estimatedReductionSeconds
  const formatDuration = (seconds: number) => `${Math.floor(seconds / 60)}m ${String(seconds % 60).padStart(2, '0')}s`

  return (
    <main className="prototype-main impact-main">
      <section className="page-heading impact-heading">
        <div>
          <Text className="eyebrow">SUPERVISOR WORKSPACE</Text>
          <Title2 as="h1">Manage human workload pressure</Title2>
          <Text className="subtitle">See where difficult work is building and support the CSR team.</Text>
        </div>
        <Badge appearance="outline" color="informative">Simulated data</Badge>
      </section>

      <div className="impact-commandbar">
        <TabList selectedValue={period} onTabSelect={(_, data) => setPeriod(data.value as Period)} aria-label="Select reporting period">
          <Tab value="today">Today</Tab>
          <Tab value="week">Last 7 days</Tab>
        </TabList>
        <Text size={200}>Updated 2 minutes ago</Text>
      </div>

      {appliedActions.map((action) => <div className="plan-confirmation" role="status" key={action}>
        <CheckmarkCircleRegular />
        <div>
          <Text weight="semibold">{action === 'coverage' ? 'Message sent and coverage applied' : `${supportActions[action].title} applied`}</Text>
          <Text size={200}>{action === 'coverage' ? `${selectedCsrNames.join(' and ')} received the message and temporary Billing support assignment.` : action === 'breaks' ? `${selectedBreakNames.join(' and ')} ${selectedBreakNames.length === 1 ? 'has a scheduled recovery break' : 'have scheduled recovery breaks'}.` : supportActions[action].confirmation}</Text>
        </div>
        <Button appearance="subtle" size="small" onClick={() => setAppliedActions((current) => current.filter((item) => item !== action))}>Undo</Button>
      </div>)}

      <section className="alerts-stack" aria-label="Alerts that may need action">
        <div className="alert-card alert-danger">
          <div className="alert-card-icon"><WarningRegular /></div>
          <div className="alert-card-copy">
            <div className="alert-card-title"><Text weight="semibold">Billing support wait is {data.waitTime}</Text><Badge appearance="tint" color="danger">High pressure</Badge></div>
            <Text size={200}>Coverage is two CSRs below forecast need. Move two cross-skilled CSRs to Billing support for one hour, then review queue pressure again.</Text>
          </div>
          <Button appearance="primary" size="small" icon={<PeopleTeamRegular />} onClick={() => reviewAction('coverage')}>Review coverage plan</Button>
        </div>
        <div className="alert-card alert-info">
          <div className="alert-card-icon alert-icon-info"><PeopleTeamRegular /></div>
          <div className="alert-card-copy">
            <div className="alert-card-title"><Text weight="semibold">Two CSRs are on back-to-back difficult contacts</Text><Badge appearance="tint" color="warning">Wellbeing</Badge></div>
            <Text size={200}>Priya Nair and Alex Morgan have handled several emotionally intense contacts in a row. A short recovery break is recommended.</Text>
          </div>
          <Button appearance="primary" size="small" onClick={() => reviewAction('breaks')}>Review breaks</Button>
        </div>
      </section>

      <section className="contact-funnel" aria-label={`${data.label} contact funnel`}>
        <div className="funnel-step">
          <Text size={200}>All contacts</Text>
          <strong>{data.totalContacts}</strong>
          <Text size={200}>{data.label}</Text>
        </div>
        <span className="funnel-arrow" aria-hidden="true">→</span>
        <div className="funnel-step">
          <Text size={200}>Resolved by AI</Text>
          <strong>{data.aiContacts}</strong>
          <Text size={200}>{aiShare}% never reached a CSR</Text>
        </div>
        <span className="funnel-arrow" aria-hidden="true">→</span>
        <div className="funnel-step funnel-emphasis">
          <Text size={200}>Reached a CSR</Text>
          <strong>{data.humanContacts}</strong>
          <Text size={200}>{humanShare}% of all contacts</Text>
        </div>
        <span className="funnel-arrow" aria-hidden="true">→</span>
        <div className="funnel-step funnel-critical">
          <Text size={200}>Difficult for the CSR</Text>
          <strong>{data.humanDifficult}</strong>
          <Text size={200}>{humanDifficultShare}% of the {data.humanContacts} CSR contacts</Text>
        </div>
      </section>

      <section className="impact-grid" aria-labelledby="pressure-title">
        <div className="impact-workload">
          <div className="section-heading-row">
            <div><h2 id="pressure-title">Where pressure is building</h2><Text size={200}>Difficult work and available CSRs by queue.</Text></div>
            <Badge appearance="tint" color="warning" icon={<WarningRegular />}>Needs attention</Badge>
          </div>

          <div className="pressure-table" role="table" aria-label="Queue workload pressure">
            <div className="pressure-row pressure-header" role="row">
              <span role="columnheader">Queue</span>
              <span role="columnheader">Coverage gap</span>
              <span role="columnheader">Current wait</span>
              <span role="columnheader">Difficult contacts</span>
              <span role="columnheader">Urgency</span>
              <span role="columnheader">Recommended response</span>
            </div>
            {teams.map((team) => {
              const gap = team.needed - team.staffed
              return <div className="pressure-row" role="row" key={team.name}>
                <strong role="cell">{team.name}</strong>
                <div role="cell" className="stacked-cell"><Text weight="semibold">{gap > 0 ? `${gap} ${gap === 1 ? 'CSR' : 'CSRs'} short` : 'Fully covered'}</Text><Text size={200}>{team.staffed} staffed / {team.needed} needed</Text></div>
                <div role="cell" className="stacked-cell"><Text weight="semibold">{team.wait}</Text><Text size={200}>{team.waitContext}</Text></div>
                <div role="cell" className="difficulty-cell"><ProgressBar value={team.difficult / 100} color={team.difficult > 50 ? 'error' : team.difficult > 35 ? 'warning' : 'success'} /><span>{team.difficult}%</span></div>
                <span role="cell" className="urgency-cell"><Badge appearance="tint" color={team.color}>{team.urgency}</Badge></span>
                <div role="cell" className="recommended-cell">
                  {team.action === 'Add coverage'
                    ? <Button className="recommended-link" appearance="transparent" size="small" onClick={() => reviewAction('coverage')}>Add coverage</Button>
                    : <Text>{team.action}</Text>}
                </div>
              </div>
            })}
          </div>

          <div className="workload-context">
            <ArrowTrendingLinesRegular />
            <div><Text weight="semibold">What changed?</Text><Text size={200}>AI handled more routine contacts, while billing disputes and emotionally difficult contacts stayed in the CSR queue.</Text></div>
          </div>
        </div>
      </section>

      <section className="agent-support-section" aria-labelledby="agent-support-title">
        <div className="section-heading-row"><div><h2 id="agent-support-title">Support CSRs during difficult work</h2><Text size={200}>Use several measures together. Moving people is not the only response.</Text></div></div>
        <div className="support-action-grid">
          {(Object.keys(supportActions) as SupportAction[]).map((action) => <div className="support-action" key={action}>
            <div><Text weight="semibold">{supportActions[action].title}</Text><Text size={200}>{supportActions[action].summary}</Text></div>
            {appliedActions.includes(action) ? <div className="applied-badges">{action === 'coverage' && <Badge appearance="tint" color="success">Message sent</Badge>}<Badge appearance="tint" color="success" icon={<CheckmarkCircleRegular />}>{action === 'coverage' ? 'Coverage applied' : 'Applied'}</Badge></div> : <Button size="small" onClick={() => reviewAction(action)}>Review</Button>}
          </div>)}
        </div>
      </section>

      <Dialog open={dialogOpen} onOpenChange={(_, dialogData) => setDialogOpen(dialogData.open)}>
        <DialogSurface
          className={selectedAction === 'coverage' || selectedAction === 'breaks' ? 'coverage-dialog' : undefined}
          style={selectedAction === 'coverage' || selectedAction === 'breaks' ? { width: 'min(900px, calc(100vw - 32px))', maxWidth: '900px' } : undefined}
        >
              <DialogBody>
                <DialogTitle>Review: {supportActions[selectedAction].title}</DialogTitle>
                <DialogContent>
                  {selectedAction === 'coverage' ? <div className="coverage-review">
                    <div className="plan-review"><Text weight="semibold">Choose CSRs for temporary coverage</Text><Text>{supportActions.coverage.detail} Check availability, skill, and recent difficult work before choosing.</Text></div>
                    <div className="wait-estimate" aria-label="Estimated wait-time impact">
                      <span><Text size={200}>Current longest wait</Text><strong>8m 24s</strong></span>
                      <ArrowTrendingLinesRegular />
                      <span><Text size={200}>Estimated after 30 minutes</Text><strong>{selectedCsrIds.length ? `~${formatDuration(projectedWaitSeconds)}` : 'No change'}</strong></span>
                      <Badge appearance="tint" color={selectedCsrIds.length ? 'success' : 'informative'}>{selectedCsrIds.length ? `~${formatDuration(estimatedReductionSeconds)} lower` : 'Select coverage'}</Badge>
                    </div>
                    <Text size={200} className="estimate-note">Simulated estimate based on current arrival and handling rates. It updates with the number of selected CSRs and is not a guarantee.</Text>
                    <div className="agent-choice-list" role="group" aria-label="CSRs available for temporary coverage">
                      {availableCsrs.map((csr) => <div className={`agent-choice ${selectedCsrIds.includes(csr.id) ? 'selected-agent' : ''}`} key={csr.id}>
                        <Avatar name={csr.name} size={36} />
                        <Checkbox
                          checked={selectedCsrIds.includes(csr.id)}
                          input={{ 'aria-label': `Select ${csr.name}` }}
                          onChange={(_, checkboxData) => setSelectedCsrIds((current) => checkboxData.checked
                            ? [...current, csr.id]
                            : current.filter((id) => id !== csr.id))}
                          label={<span className="agent-identity"><strong>{csr.name}</strong><Text size={200}>{csr.queue}</Text></span>}
                        />
                        <span className="agent-fact"><Text size={200}>Availability</Text><strong>{csr.availableFor}</strong></span>
                        <span className="agent-fact"><Text size={200}>Billing skill</Text><strong>{csr.billingSkill}</strong></span>
                        <span className="agent-fact"><Text size={200}>Difficult contacts</Text><strong>{csr.recentDifficult}</strong></span>
                      </div>)}
                    </div>
                    <label className="coverage-message">
                      <Text weight="semibold">Message to selected CSRs</Text>
                      <Textarea value={coverageMessage} onChange={(_, textareaData) => setCoverageMessage(textareaData.value)} resize="vertical" />
                      <Text size={200}>{selectedCsrNames.length} selected: {selectedCsrNames.length ? selectedCsrNames.join(', ') : 'Choose at least one CSR'}</Text>
                    </label>
                  </div> : selectedAction === 'breaks' ? <div className="coverage-review">
                    <div className="plan-review"><Text weight="semibold">Choose CSRs for a recovery break</Text><Text>These CSRs have handled back-to-back emotionally intense contacts. Review their workload and stagger breaks to maintain queue coverage.</Text></div>
                    <div className="break-coverage-estimate" aria-label="Break coverage impact">
                      <div className="break-cover-option">
                        <CheckmarkCircleRegular />
                        <div><Text weight="semibold">Cover is available</Text><Text size={200}>Maya Chen and Jordan Lee have taken 0-1 difficult contacts in the last hour and can cover Billing support during the break. Estimated wait impact: about +0m 40s, still within target.</Text></div>
                      </div>
                      <div className="break-cover-option break-cover-fallback">
                        <WarningRegular />
                        <div><Text weight="semibold">If no one can cover</Text><Text size={200}>The longest wait may rise to about 9m 10s during a 10-minute break. This is still manageable, and the queue should recover once the CSR returns.</Text></div>
                      </div>
                    </div>
                    <div className="agent-choice-list" role="group" aria-label="CSRs recommended for recovery breaks">
                      {breakCandidates.map((csr) => <div className={`agent-choice break-choice ${selectedBreakIds.includes(csr.id) ? 'selected-agent' : ''}`} key={csr.id}>
                        <Avatar name={csr.name} size={36} />
                        <Checkbox
                          checked={selectedBreakIds.includes(csr.id)}
                          input={{ 'aria-label': `Select ${csr.name} for a recovery break` }}
                          onChange={(_, checkboxData) => setSelectedBreakIds((current) => checkboxData.checked ? [...current, csr.id] : current.filter((id) => id !== csr.id))}
                          label={<span className="agent-identity"><strong>{csr.name}</strong><Text size={200}>{csr.queue}</Text></span>}
                        />
                        <span className="agent-fact"><Text size={200}>Emotionally intense</Text><strong>{csr.consecutiveEmotional} back-to-back</strong></span>
                        <span className="agent-fact"><Text size={200}>Time active</Text><strong>{csr.activeTime}</strong></span>
                        <span className="agent-fact"><Text size={200}>Break window</Text><strong>{csr.breakWindow}</strong></span>
                      </div>)}
                    </div>
                    <Text size={200}>{selectedBreakNames.length} selected: {selectedBreakNames.length ? selectedBreakNames.join(', ') : 'Choose at least one CSR'}</Text>
                  </div> : <div className="plan-review"><Text weight="semibold">{supportActions[selectedAction].summary}</Text><Text>{supportActions[selectedAction].detail}</Text></div>}
                  <Text size={200}>This is a simulated action. A real product would check schedules, CSR preferences, accessibility needs, permissions, service targets, and local policy before applying it.</Text>
                </DialogContent>
                <DialogActions>
                  <Button appearance="secondary" onClick={() => setDialogOpen(false)}>Cancel</Button>
                  <Button appearance="primary" disabled={(selectedAction === 'coverage' && (selectedCsrIds.length === 0 || coverageMessage.trim().length === 0)) || (selectedAction === 'breaks' && selectedBreakIds.length === 0)} onClick={applyPlan}>{selectedAction === 'coverage' ? 'Send message and apply' : selectedAction === 'breaks' ? 'Schedule selected breaks' : 'Apply'}</Button>
                </DialogActions>
              </DialogBody>
            </DialogSurface>
      </Dialog>

    </main>
  )
}
