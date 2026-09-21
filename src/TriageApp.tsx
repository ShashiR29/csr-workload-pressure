import {
  Avatar,
  Badge,
  Button,
  Dropdown,
  Input,
  Option,
  Tab,
  TabList,
  Text,
  Title2,
} from '@fluentui/react-components'
import {
  AddRegular,
  AlertRegular,
  CheckmarkCircleRegular,
  ChevronRightRegular,
  GridRegular,
  QuestionCircleRegular,
  SearchRegular,
  SettingsRegular,
} from '@fluentui/react-icons'
import { useDeferredValue, useState } from 'react'
import AIImpactView from './AIImpactView'
import AgentWorkspaceView from './AgentWorkspaceView'
import ImproveAIView from './ImproveAIView'
import PlanNextWeekView from './PlanNextWeekView'
import { CcaIncidentAssistant } from './cca/CcaIncidentAssistant'
import { CcaSignalSummary } from './cca/CcaSignalSummary'
import './prototype.css'

type Status = 'Investigating' | 'Assigned' | 'Monitoring' | 'Resolved'
type Severity = 'Critical' | 'High' | 'Medium'

type Incident = {
  id: string
  title: string
  service: string
  severity: Severity
  status: Status
  age: string
  owner: string
  summary: string
  signals: string[]
}

const initialIncidents: Incident[] = [
  { id: 'INC-1048', title: 'Checkout failure rate above threshold', service: 'Payments API', severity: 'Critical', status: 'Investigating', age: '18 min', owner: 'Unassigned', summary: 'Payment authorization failures rose after the 09:42 deployment. Impact is concentrated in EU traffic.', signals: ['Error rate 14.8%', '2 regions affected', 'Deploy 38 min ago'] },
  { id: 'INC-1047', title: 'Agent response time degraded', service: 'Support workspace', severity: 'High', status: 'Assigned', age: '32 min', owner: 'Maya Chen', summary: 'Median response time is above the service target for agents using the case timeline.', signals: ['P95 latency 4.2s', '186 users affected'] },
  { id: 'INC-1044', title: 'Stale availability data in supervisor view', service: 'Presence service', severity: 'Medium', status: 'Monitoring', age: '1 hr 12 min', owner: 'Ravi Patel', summary: 'Some agent presence values take up to five minutes to refresh after a status change.', signals: ['Freshness lag 5 min', 'West Europe only'] },
  { id: 'INC-1039', title: 'Callback jobs delayed', service: 'Queue orchestrator', severity: 'High', status: 'Monitoring', age: '2 hr 06 min', owner: 'Jordan Lee', summary: 'The backlog is recovering after capacity was added. No new customer callbacks are failing.', signals: ['Backlog 412 jobs', 'Recovery ETA 24 min'] },
]

const queues = ['All active', 'Critical', 'Unassigned', 'Monitoring'] as const
type Queue = (typeof queues)[number]
type ActiveView = 'triage' | 'impact' | 'plan' | 'improve' | 'agent'
const severityColor = { Critical: 'danger', High: 'warning', Medium: 'informative' } as const

export default function TriageApp() {
  const [activeView, setActiveView] = useState<ActiveView>('impact')
  const [incidents, setIncidents] = useState(initialIncidents)
  const [selectedId, setSelectedId] = useState(initialIncidents[0].id)
  const [queue, setQueue] = useState<Queue>('All active')
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)

  const filteredIncidents = incidents.filter((incident) => {
    const matchesQueue = queue === 'All active'
      || (queue === 'Critical' && incident.severity === 'Critical')
      || (queue === 'Unassigned' && incident.owner === 'Unassigned')
      || (queue === 'Monitoring' && incident.status === 'Monitoring')
    const searchText = `${incident.id} ${incident.title} ${incident.service}`.toLowerCase()
    return matchesQueue && searchText.includes(deferredQuery.toLowerCase())
  })

  const selectedIncident = incidents.find((incident) => incident.id === selectedId) ?? incidents[0]
  const updateSelected = (changes: Partial<Incident>) => setIncidents((current) =>
    current.map((incident) => incident.id === selectedId ? { ...incident, ...changes } : incident),
  )

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-lockup">
          <Button appearance="transparent" icon={<GridRegular />} aria-label="App launcher" />
          <Text weight="semibold" className="topbar-title">Copilot Service workspace</Text>
        </div>
        <div className="topbar-actions">
          <Button appearance="transparent" icon={<AddRegular />} aria-label="Add" />
          <Button appearance="transparent" icon={<SettingsRegular />} aria-label="Settings" />
          <Button appearance="transparent" icon={<QuestionCircleRegular />} aria-label="Help" />
          <Avatar name="Shashi Rekha" size={28} />
        </div>
      </header>

      <nav className="workspace-nav" aria-label="Operations sections">
        <TabList selectedValue={activeView} onTabSelect={(_, data) => setActiveView(data.value as ActiveView)}>
          <Tab value="triage">Issue triage</Tab>
          <Tab value="impact">Manage pressure</Tab>
          <Tab value="plan">Plan next week</Tab>
          <Tab value="agent">CSR workspace</Tab>
          <Tab value="improve">Improve AI</Tab>
        </TabList>
      </nav>

      {activeView === 'impact' ? <AIImpactView /> : activeView === 'plan' ? <PlanNextWeekView /> : activeView === 'improve' ? <ImproveAIView /> : activeView === 'agent' ? <AgentWorkspaceView /> : <main className="prototype-main">
        <section className="page-heading">
          <div>
            <Text className="eyebrow">SUPERVISOR WORKSPACE</Text>
            <Title2 as="h1">Issue triage</Title2>
            <Text className="subtitle">Prioritize service issues, confirm ownership, and track recovery.</Text>
          </div>
          <div className="health-summary" aria-label="Current service health">
            <span className="health-pulse" />
            <div><Text weight="semibold">4 active issues</Text><Text size={200}>Updated just now</Text></div>
          </div>
        </section>

        <section className="triage-toolbar" aria-label="Issue filters">
          <Input className="search-input" contentBefore={<SearchRegular />} placeholder="Search issues or services" value={query} onChange={(_, data) => setQuery(data.value)} />
          <Dropdown aria-label="Filter queue" value={queue} selectedOptions={[queue]} onOptionSelect={(_, data) => setQueue(data.optionValue as Queue)}>
            {queues.map((option) => <Option key={option} value={option}>{option}</Option>)}
          </Dropdown>
          <Text size={200} className="result-count">{filteredIncidents.length} issues</Text>
        </section>

        <section className="workspace-grid">
          <div className="issue-list">
            <table>
              <thead><tr><th>Issue</th><th>Severity</th><th>Status</th><th>Age</th><th aria-label="Open" /></tr></thead>
              <tbody>
                {filteredIncidents.map((incident) => (
                  <tr key={incident.id} className={incident.id === selectedId ? 'selected-row' : ''} onClick={() => setSelectedId(incident.id)}>
                    <td><button className="issue-title" onClick={() => setSelectedId(incident.id)}><strong>{incident.title}</strong><span>{incident.id} · {incident.service}</span></button></td>
                    <td><Badge appearance="tint" color={severityColor[incident.severity]}>{incident.severity}</Badge></td>
                    <td>{incident.status}</td>
                    <td>{incident.age}</td>
                    <td><ChevronRightRegular /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredIncidents.length === 0 && <div className="empty-state"><SearchRegular /><Text weight="semibold">No issues match these filters</Text></div>}
          </div>

          <aside className="detail-panel" aria-label={`Details for ${selectedIncident.id}`}>
            <div className="detail-heading">
              <div><Text size={200}>{selectedIncident.id}</Text><h2>{selectedIncident.title}</h2></div>
              <Badge appearance="tint" color={severityColor[selectedIncident.severity]}>{selectedIncident.severity}</Badge>
            </div>
            <Text className="detail-summary">{selectedIncident.summary}</Text>
            <div className="detail-section">
              <CcaSignalSummary incidentId={selectedIncident.id} signals={selectedIncident.signals} />
            </div>
            <div className="detail-section facts-grid">
              <div><Text size={200}>Status</Text><strong>{selectedIncident.status}</strong></div>
              <div><Text size={200}>Owner</Text><strong>{selectedIncident.owner}</strong></div>
              <div><Text size={200}>Service</Text><strong>{selectedIncident.service}</strong></div>
              <div><Text size={200}>Open for</Text><strong>{selectedIncident.age}</strong></div>
            </div>
            <div className="detail-section activity">
              <Text size={200} weight="semibold" className="section-label">LATEST ACTIVITY</Text>
              <div className="timeline-item"><span /><div><strong>Automated alert created</strong><Text size={200}>Correlation grouped 12 related signals · {selectedIncident.age} ago</Text></div></div>
            </div>
            <div className="detail-section">
              <CcaIncidentAssistant
                key={selectedIncident.id}
                incidentId={selectedIncident.id}
                severity={selectedIncident.severity}
                service={selectedIncident.service}
                owner={selectedIncident.owner}
                signals={selectedIncident.signals}
                onAssign={() => updateSelected({ owner: 'Shashi', status: 'Assigned' })}
                onEscalate={() => updateSelected({ status: 'Investigating' })}
              />
            </div>
            <div className="detail-actions">
              {selectedIncident.owner === 'Unassigned' && <Button appearance="primary" onClick={() => updateSelected({ owner: 'Shashi', status: 'Assigned' })}>Assign to me</Button>}
              {selectedIncident.status !== 'Resolved' && <Button icon={<CheckmarkCircleRegular />} onClick={() => updateSelected({ status: 'Resolved' })}>Mark resolved</Button>}
              <Button appearance="subtle" icon={<AlertRegular />}>Escalate</Button>
            </div>
          </aside>
        </section>
      </main>}
    </div>
  )
}