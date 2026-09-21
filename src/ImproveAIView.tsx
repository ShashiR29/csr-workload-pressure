import {
  Badge,
  Button,
  ProgressBar,
  Tab,
  TabList,
  Text,
  Title2,
} from '@fluentui/react-components'
import {
  CheckmarkCircleRegular,
  ShieldCheckmarkRegular,
  SparkleRegular,
  WarningRegular,
} from '@fluentui/react-icons'
import { useState } from 'react'

const candidates = [
  { topic: 'Billing fee explanation', weekly: 142, reason: 'Repeated policy explanation', stage: 'Ready for shadow', color: 'success' as const },
  { topic: 'Failed payment status', weekly: 96, reason: 'Needs account verification', stage: 'Assist first', color: 'warning' as const },
  { topic: 'Financial hardship or threat', weekly: 24, reason: 'High customer risk', stage: 'Human only', color: 'danger' as const },
]

const maturityStages = ['Observe', 'Assist', 'Shadow', 'Limited autonomy'] as const

type ConversationArea = 'Billing support' | 'Account access' | 'Orders and delivery'

const historyAreas: ConversationArea[] = ['Billing support', 'Account access', 'Orders and delivery']

const difficultConversations: { id: string; area: ConversationArea; date: string; severity: 'Moderate' | 'High' | 'Critical'; summary: string; excerpt: string; whyDifficult: string; outcome: string }[] = [
  { id: 'b1', area: 'Billing support', date: 'Mon 10:42', severity: 'High', summary: 'Duplicate charge dispute', excerpt: 'I was charged twice for the same order and I need this fixed before my rent is due.', whyDifficult: 'Repeat contact, financial urgency, and rising frustration.', outcome: 'Refund confirmed after a settled-status check.' },
  { id: 'b2', area: 'Billing support', date: 'Wed 14:08', severity: 'Moderate', summary: 'Unexpected fee explanation', excerpt: 'Why is there a $9.99 fee I never agreed to? Nobody told me about this.', whyDifficult: 'Policy ambiguity and several back-and-forth turns.', outcome: 'Fee explained and waived once as goodwill.' },
  { id: 'a1', area: 'Account access', date: 'Tue 09:20', severity: 'High', summary: 'Locked out after failed verification', excerpt: 'I have tried three times and still cannot get into my account. This is urgent.', whyDifficult: 'Multiple failed attempts, identity risk, and urgency.', outcome: 'Manual verification and reset completed.' },
  { id: 'a2', area: 'Account access', date: 'Thu 16:35', severity: 'Moderate', summary: 'Email change not recognized', excerpt: 'I updated my email but the system still uses the old one and I cannot log in.', whyDifficult: 'System sync delay and customer confusion.', outcome: 'Record corrected and sync delay explained.' },
  { id: 'o1', area: 'Orders and delivery', date: 'Mon 11:15', severity: 'High', summary: 'Delivery lost before an event', excerpt: 'The package never arrived and I need it for an event tomorrow. What are you doing about it?', whyDifficult: 'Time-critical, high emotion, and carrier dependency.', outcome: 'Replacement expedited with a goodwill credit.' },
  { id: 'o2', area: 'Orders and delivery', date: 'Fri 13:47', severity: 'Moderate', summary: 'Wrong item shipped again', excerpt: 'I ordered a blue one and got a red one for the second time.', whyDifficult: 'Repeat error and eroded trust.', outcome: 'Correct item shipped with a return label.' },
]

const severityColor = { Moderate: 'informative', High: 'warning', Critical: 'danger' } as const

export default function ImproveAIView() {
  const [shadowStarted, setShadowStarted] = useState(false)
  const [historyArea, setHistoryArea] = useState<ConversationArea>('Billing support')

  return (
    <main className="prototype-main impact-main improve-main">
      <section className="page-heading impact-heading">
        <div>
          <Text className="eyebrow">SUPERVISOR WORKSPACE</Text>
          <Title2 as="h1">Improve AI</Title2>
          <Text className="subtitle">Reduce difficult work at its source without compromising customer safety.</Text>
        </div>
        <Badge appearance="outline" color="informative">Simulated recommendations</Badge>
      </section>

      {shadowStarted && <div className="plan-confirmation" role="status">
        <CheckmarkCircleRegular />
        <div><Text weight="semibold">Supervised shadow test prepared</Text><Text size={200}>AI responses will be evaluated alongside human resolutions. Customers will not see them.</Text></div>
        <Button appearance="subtle" size="small" onClick={() => setShadowStarted(false)}>Undo</Button>
      </div>}

      <section className="readiness-hero" aria-labelledby="readiness-title">
        <div className="readiness-copy">
          <span className="readiness-icon"><SparkleRegular /></span>
          <div><Text className="eyebrow">BEST NEXT CANDIDATE</Text><h2 id="readiness-title">Billing fee explanations may be ready for supervised testing</h2><Text>These moderate-severity contacts are frequent, structured, and usually require a consistent policy explanation.</Text></div>
        </div>
        <div className="readiness-action">
          <Badge appearance="tint" color="success">Ready for shadow</Badge>
          <Button appearance="primary" onClick={() => setShadowStarted(true)}>Prepare shadow test</Button>
        </div>
      </section>

      <section className="improvement-grid">
        <div className="planning-section candidate-section">
          <div className="section-heading-row"><div><h2>Moderate-work candidates</h2><Text size={200}>Topics repeatedly handed to humans that AI could learn to assist with safely.</Text></div></div>
          <div className="candidate-list">
            {candidates.map((candidate) => <div className="candidate-row" key={candidate.topic}>
              <div><Text weight="semibold">{candidate.topic}</Text><Text size={200}>{candidate.reason}</Text></div>
              <span><strong>{candidate.weekly}</strong><Text size={200}>per week</Text></span>
              <Badge appearance="tint" color={candidate.color}>{candidate.stage}</Badge>
            </div>)}
          </div>
        </div>

        <aside className="quality-gates" aria-labelledby="quality-title">
          <div className="quality-heading"><ShieldCheckmarkRegular /><div><h2 id="quality-title">Quality gates</h2><Text size={200}>All gates must pass before autonomy expands.</Text></div></div>
          <div className="quality-list">
            <div><span><Text>Resolution quality</Text><strong>92%</strong></span><ProgressBar value={0.92} color="success" /></div>
            <div><span><Text>Repeat contacts</Text><strong>No increase</strong></span><ProgressBar value={0.88} color="success" /></div>
            <div><span><Text>Representative review</Text><strong>18 of 25</strong></span><ProgressBar value={0.72} color="warning" /></div>
          </div>
          <div className="human-only-boundary"><WarningRegular /><Text size={200}>Critical, vulnerable, legal, and safety-related contacts remain human-only in this concept.</Text></div>
        </aside>
      </section>

      <section className="planning-section" aria-labelledby="maturity-title">
        <div className="section-heading-row"><div><h2 id="maturity-title">Controlled path to autonomy</h2><Text size={200}>AI earns more responsibility through observed outcomes, not containment targets alone.</Text></div></div>
        <ol className="maturity-path">
          {maturityStages.map((stage, index) => <li className={stage === 'Shadow' ? 'current-stage' : index < 2 ? 'complete-stage' : ''} key={stage}>
            <span>{index + 1}</span><div><Text weight="semibold">{stage}</Text><Text size={200}>{stage === 'Observe' ? 'Find recurring patterns' : stage === 'Assist' ? 'Help representatives respond' : stage === 'Shadow' ? 'Compare hidden AI responses' : 'Resolve approved cases with monitoring'}</Text></div>
          </li>)}
        </ol>
      </section>

      <section className="planning-section" aria-labelledby="history-title">
        <div className="section-heading-row">
          <div><Text className="eyebrow">DATA SCIENCE VIEW</Text><h2 id="history-title">Difficult conversation history (last 7 days)</h2><Text size={200}>Sampled difficult contacts across billing, account access, and orders. Use these to find patterns AI could learn to prevent or assist with.</Text></div>
          <Badge appearance="tint" color="informative">Simulated transcripts</Badge>
        </div>
        <TabList className="history-tabs" selectedValue={historyArea} onTabSelect={(_, data) => setHistoryArea(data.value as ConversationArea)} aria-label="Filter conversation history by area">
          {historyAreas.map((area) => <Tab value={area} key={area}>{area}</Tab>)}
        </TabList>
        <div className="conversation-history-list">
          {difficultConversations.filter((item) => item.area === historyArea).map((item) => <article className="history-item" key={item.id}>
            <div className="history-item-head">
              <div><Text weight="semibold">{item.summary}</Text><Text size={200}>{item.date} <span aria-hidden="true">·</span> {item.area}</Text></div>
              <Badge appearance="tint" color={severityColor[item.severity]}>{item.severity}</Badge>
            </div>
            <blockquote className="history-excerpt">“{item.excerpt}”</blockquote>
            <div className="history-meta">
              <div><Text size={200}>Why difficult</Text><Text>{item.whyDifficult}</Text></div>
              <div><Text size={200}>Outcome</Text><Text>{item.outcome}</Text></div>
            </div>
          </article>)}
        </div>
        <Text size={200} className="severity-note">Invented transcripts for a learning prototype. Real conversation review needs consent, privacy controls, de-identification, sampling rigor, and bias checks before use.</Text>
      </section>
    </main>
  )
}