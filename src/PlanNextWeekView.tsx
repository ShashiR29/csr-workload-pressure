import {
  Avatar,
  Badge,
  Button,
  Checkbox,
  ProgressBar,
  Text,
  Title2,
} from '@fluentui/react-components'
import {
  CalendarRegular,
  CheckmarkCircleRegular,
  PeopleTeamRegular,
  WarningRegular,
} from '@fluentui/react-icons'
import { useState } from 'react'

const queueForecast = [
  { queue: 'Billing support', difficult: '280 (+22%)', peak: 'Tue, 10:00–14:00', coverage: '2-CSR gap', pressure: 0.82, status: 'High' },
  { queue: 'Account access', difficult: '194 (+11%)', peak: 'Wed, 09:00–12:00', coverage: '1-CSR gap', pressure: 0.61, status: 'Watch' },
  { queue: 'Orders and delivery', difficult: '138 (-4%)', peak: 'Mon, 15:00–17:00', coverage: 'Covered', pressure: 0.36, status: 'Stable' },
] as const

const planActions = [
  { id: 'coverage', title: 'Add cross-skilled coverage', detail: 'Move two trained CSRs to Billing support during Tuesday and Wednesday peaks.' },
  { id: 'recovery', title: 'Protect recovery windows', detail: 'Reserve staggered 10-minute recovery breaks after consecutive emotionally intense contacts.' },
  { id: 'expert', title: 'Schedule specialist support', detail: 'Keep a billing specialist available for live consultation during peak hours.' },
] as const

const standbyAgents = [
  { id: 'maya', name: 'Maya Chen', currentQueue: 'Orders and delivery', strengths: 'Billing disputes, de-escalation', recentOutcome: '92% quality; 3 successful assist handoffs', window: 'Tue 10:00–14:00' },
  { id: 'jordan', name: 'Jordan Lee', currentQueue: 'Orders and delivery', strengths: 'Account access, identity checks', recentOutcome: '95% quality; 4% repeat contact', window: 'Wed 09:00–12:00' },
  { id: 'elena', name: 'Elena Garcia', currentQueue: 'Account access', strengths: 'Accessibility support, account recovery', recentOutcome: '94% quality; 4.8/5 customer rating', window: 'Tue 11:00–15:00' },
  { id: 'sam', name: 'Sam Okafor', currentQueue: 'Billing support', strengths: 'Order exceptions, escalation support', recentOutcome: '91% quality; 88% escalation resolution', window: 'Tue–Wed 10:00–13:00' },
] as const

// Individual difficult-work carried in the last 7 days, to surface CSRs who consistently take hard
// contacts even in lower-rate queues like Orders and delivery.
const csrDifficultLoad = [
  { id: 'priya', name: 'Priya Nair', queue: 'Billing support', difficult: 58, emotional: 26, signal: 'Consistently high', color: 'danger' as const, note: 'Hard days three weeks running. Prioritize recovery and task variety.' },
  { id: 'alex', name: 'Alex Morgan', queue: 'Billing support', difficult: 47, emotional: 21, signal: 'Consistently high', color: 'danger' as const, note: 'High emotional load. Protect break windows this week.' },
  { id: 'maya', name: 'Maya Chen', queue: 'Orders and delivery', difficult: 41, emotional: 18, signal: 'High for a 27% queue', color: 'warning' as const, note: 'Takes the hardest delivery disputes even though the queue rate is only 27%.' },
  { id: 'sam', name: 'Sam Okafor', queue: 'Billing support', difficult: 39, emotional: 12, signal: 'Steady', color: 'informative' as const, note: 'Fewer emotional contacts. Could mentor on de-escalation.' },
  { id: 'elena', name: 'Elena Garcia', queue: 'Account access', difficult: 33, emotional: 14, signal: 'Steady', color: 'informative' as const, note: 'Balanced load with strong recovery outcomes.' },
  { id: 'jordan', name: 'Jordan Lee', queue: 'Orders and delivery', difficult: 22, emotional: 6, signal: 'Lighter load', color: 'success' as const, note: 'Has capacity to absorb some difficult work next week.' },
] as const

export default function PlanNextWeekView() {
  const [selectedActions, setSelectedActions] = useState<string[]>(planActions.map((action) => action.id))
  const [selectedStandbyIds, setSelectedStandbyIds] = useState<string[]>(['maya', 'jordan'])
  const [planApplied, setPlanApplied] = useState(false)

  const toggleAction = (id: string, checked: boolean) => {
    setPlanApplied(false)
    setSelectedActions((current) => checked ? [...current, id] : current.filter((actionId) => actionId !== id))
  }

  const toggleStandbyAgent = (id: string, checked: boolean) => {
    setPlanApplied(false)
    setSelectedStandbyIds((current) => checked ? [...current, id] : current.filter((agentId) => agentId !== id))
  }

  return (
    <main className="prototype-main impact-main planning-main">
      <section className="page-heading impact-heading">
        <div>
          <Text className="eyebrow">SUPERVISOR WORKSPACE</Text>
          <Title2 as="h1">Plan next week</Title2>
          <Text className="subtitle">Prepare team support before difficult work reaches its peak.</Text>
        </div>
        <Badge appearance="outline" color="informative">Simulated forecast</Badge>
      </section>

      {planApplied && <div className="plan-confirmation" role="status">
        <CheckmarkCircleRegular />
        <div><Text weight="semibold">Draft support plan saved</Text><Text size={200}>{selectedActions.length} actions and {selectedStandbyIds.length} standby CSRs are ready for schedule, preference, and policy review.</Text></div>
        <Button appearance="subtle" size="small" onClick={() => setPlanApplied(false)}>Undo</Button>
      </div>}

      <section className="weekly-outlook" aria-labelledby="weekly-outlook-title">
        <div className="outlook-icon"><WarningRegular /></div>
        <div>
          <Text className="eyebrow">NEXT WEEK OUTLOOK</Text>
          <h2 id="weekly-outlook-title">Pressure is likely to peak Tuesday and Wednesday</h2>
          <Text>Billing disputes are forecast to rise while scheduled coverage is lower than demand.</Text>
        </div>
        <Button appearance="primary" icon={<CalendarRegular />} onClick={() => document.getElementById('weekly-support-plan')?.scrollIntoView({ behavior: 'smooth' })}>Build support plan</Button>
      </section>

      <section className="planning-section" aria-labelledby="forecast-title">
        <div className="section-heading-row">
          <div><h2 id="forecast-title">Queue forecast</h2><Text size={200}>Team-level patterns combine expected volume, difficulty, skills, and scheduled availability.</Text></div>
          <Badge appearance="tint" color="warning">2 queues need review</Badge>
        </div>
        <div className="forecast-table" role="table" aria-label="Forecast difficult work by queue">
          <div className="forecast-row forecast-header" role="row"><span role="columnheader">Queue</span><span role="columnheader">Difficult contacts</span><span role="columnheader">Expected peak</span><span role="columnheader">Coverage</span><span role="columnheader">Pressure</span></div>
          {queueForecast.map((item) => <div className="forecast-row" role="row" key={item.queue}>
            <strong role="cell">{item.queue}</strong>
            <span role="cell">{item.difficult}</span>
            <span role="cell">{item.peak}</span>
            <span role="cell">{item.coverage}</span>
            <div className="forecast-pressure" role="cell"><ProgressBar value={item.pressure} color={item.status === 'High' ? 'error' : item.status === 'Watch' ? 'warning' : 'success'} /><Badge appearance="tint" color={item.status === 'High' ? 'danger' : item.status === 'Watch' ? 'warning' : 'success'}>{item.status}</Badge></div>
          </div>)}
        </div>
      </section>

      <section className="planning-section" aria-labelledby="csr-lens-title">
        <div className="section-heading-row">
          <div><h2 id="csr-lens-title">CSR difficult-work lens (last 7 days)</h2><Text size={200}>See who carried consistently difficult and emotionally intense contacts, including strong CSRs in lower-rate queues like Orders and delivery.</Text></div>
          <Badge appearance="tint" color="danger">2 need recovery focus</Badge>
        </div>
        <div className="csr-load-table" role="table" aria-label="Difficult work handled by each CSR in the last 7 days">
          <div className="csr-load-row csr-load-header" role="row">
            <span role="columnheader">CSR</span><span role="columnheader">Queue</span><span role="columnheader">Difficult calls</span><span role="columnheader">Emotionally intense</span><span role="columnheader">Load signal</span>
          </div>
          {csrDifficultLoad.map((csr) => <div className="csr-load-row" role="row" key={csr.id}>
            <div className="csr-load-name" role="cell"><Avatar name={csr.name} size={28} /><strong>{csr.name}</strong></div>
            <span role="cell">{csr.queue}</span>
            <strong role="cell">{csr.difficult}</strong>
            <span role="cell">{csr.emotional}</span>
            <div className="csr-load-signal" role="cell"><Badge appearance="tint" color={csr.color}>{csr.signal}</Badge><Text size={200}>{csr.note}</Text></div>
          </div>)}
        </div>
        <Text size={200} className="standby-note">Individual patterns support fair rotation and recovery. They are not performance scores and should be reviewed with the CSR, workload, and wellbeing in mind.</Text>
      </section>

      <section className="planning-section" aria-labelledby="standby-title">
        <div className="section-heading-row">
          <div><h2 id="standby-title">Cross-skilled CSR standby pool</h2><Text size={200}>Select CSRs with recent strong outcomes in forecast pressure areas. Confirm schedules and preferences before publishing.</Text></div>
          <Badge appearance="tint" color="informative">{selectedStandbyIds.length} selected</Badge>
        </div>
        <div className="standby-table" role="table" aria-label="Cross-skilled CSRs available for next week">
          <div className="standby-row standby-header" role="row">
            <span role="columnheader">CSR</span><span role="columnheader">Demonstrated strengths</span><span role="columnheader">Recent outcome signal</span><span role="columnheader">Standby window</span>
          </div>
          {standbyAgents.map((agent) => <div className={`standby-row ${selectedStandbyIds.includes(agent.id) ? 'selected-standby' : ''}`} role="row" key={agent.id}>
            <div className="standby-agent" role="cell">
              <Checkbox checked={selectedStandbyIds.includes(agent.id)} input={{ 'aria-label': `Select ${agent.name} for standby` }} onChange={(_, data) => toggleStandbyAgent(agent.id, data.checked === true)} />
              <Avatar name={agent.name} size={32} />
              <span><Text weight="semibold">{agent.name}</Text><Text size={200}>{agent.currentQueue}</Text></span>
            </div>
            <span role="cell">{agent.strengths}</span>
            <span role="cell">{agent.recentOutcome}</span>
            <strong role="cell">{agent.window}</strong>
          </div>)}
        </div>
        <Text size={200} className="standby-note">Prototype recommendation only. Recent outcomes do not guarantee future performance and should not override workload, accessibility needs, preferences, or local policy.</Text>
      </section>

      <section className="planning-section" id="weekly-support-plan" aria-labelledby="support-plan-title">
        <div className="section-heading-row">
          <div><h2 id="support-plan-title">Draft team support plan</h2><Text size={200}>Select actions to review with workforce planning and the team before publishing.</Text></div>
          <PeopleTeamRegular className="section-icon" />
        </div>
        <div className="weekly-actions">
          {planActions.map((action) => <label className={selectedActions.includes(action.id) ? 'weekly-action selected-weekly-action' : 'weekly-action'} key={action.id}>
            <Checkbox checked={selectedActions.includes(action.id)} onChange={(_, data) => toggleAction(action.id, data.checked === true)} />
            <span><Text weight="semibold">{action.title}</Text><Text size={200}>{action.detail}</Text></span>
          </label>)}
        </div>
        <div className="plan-footer">
          <Text size={200}>Uses team-level workload patterns. Individual preferences, schedules, accessibility needs, and local policy require review.</Text>
          <Button appearance="primary" disabled={selectedActions.length === 0} onClick={() => setPlanApplied(true)}>Save draft plan</Button>
        </div>
      </section>
    </main>
  )
}