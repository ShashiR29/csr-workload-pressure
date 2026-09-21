import {
  Avatar,
  Badge,
  Button,
  Tab,
  TabList,
  Text,
  Textarea,
  Title2,
  Tooltip,
} from '@fluentui/react-components'
import {
  ArrowSwapRegular,
  CallRegular,
  CheckmarkCircleRegular,
  DatabaseRegular,
  DismissRegular,
  SearchRegular,
  SendRegular,
  SparkleRegular,
  WarningRegular,
} from '@fluentui/react-icons'
import { useState } from 'react'

type AgentMessage = {
  id: number
  message: string
  timestamp: string
}

const coachingSuggestions = [
  {
    label: 'Acknowledge and take ownership',
    message: 'You are right to be frustrated. I have the details you already shared, and I will take ownership of checking both charges now.',
  },
  {
    label: 'Set a clear next step',
    message: 'I can see both $149.99 charges and your earlier verification. I am checking whether each charge is pending or settled, then I will explain the available resolution.',
  },
  {
    label: 'Reassure without overpromising',
    message: 'You will not need to start over. I have your conversation history and will verify the duplicate charge before confirming what happens next and when.',
  },
] as const

type CoachingView = 'active' | 'history'
type NudgeStatus = 'active' | 'acknowledged' | 'dismissed'

function ChatMessage({ role, name, timestamp, message }: { role: string; name: string; timestamp: string; message: string }) {
  const isCustomer = role.toLowerCase().includes('customer')
  return (
    <div className={`chat-bubble ${isCustomer ? 'chat-customer' : 'chat-rep'}`}>
      <div className="chat-meta"><strong>{name}</strong><span>{timestamp}</span></div>
      <Text>{message}</Text>
    </div>
  )
}

function Composer({ initialValue, placeholder, onSubmit, ariaLabel }: { initialValue: string; placeholder: string; onSubmit: (message: string) => void; ariaLabel: string }) {
  const [value, setValue] = useState(initialValue)
  return (
    <div className="fluent-composer">
      <Textarea value={value} placeholder={placeholder} aria-label={ariaLabel} resize="vertical" onChange={(_, data) => setValue(data.value)} />
      <Button appearance="primary" icon={<SendRegular />} onClick={() => { onSubmit(value); setValue('') }}>Send</Button>
    </div>
  )
}

export default function AgentWorkspaceView() {
  const [handoffAccepted, setHandoffAccepted] = useState(false)
  const [draft, setDraft] = useState('')
  const [composerVersion, setComposerVersion] = useState(0)
  const [assistResult, setAssistResult] = useState('')
  const [notice, setNotice] = useState('Review AI-provided context before using it with the customer.')
  const [agentMessages, setAgentMessages] = useState<AgentMessage[]>([])
  const [coachingView, setCoachingView] = useState<CoachingView>('active')
  const [nudgeStatus, setNudgeStatus] = useState<NudgeStatus>('active')

  const prepareDraft = (message: string) => {
    setDraft(message)
    setComposerVersion((current) => current + 1)
    setNotice('Coaching suggestion added as an editable draft. Nothing has been sent.')
  }

  const retrievePolicy = () => setAssistResult('Policy match: Duplicate card charges must be checked for pending versus settled status. Refunds require confirmation that both charges settled; do not promise a refund before verification.')

  const draftNotes = () => setAssistResult('Draft after-call note: Customer reported two $149.99 charges after checkout. Identity verified by virtual agent. Refund eligibility check failed due to a service timeout. The CSR reviewed charge status and agreed the next step with the customer.')

  const sendMessage = (message: string) => {
    const trimmedMessage = message.trim()
    if (!trimmedMessage) return
    setAgentMessages((current) => [...current, { id: Date.now(), message: trimmedMessage, timestamp: 'Now' }])
    setDraft('')
    setComposerVersion((current) => current + 1)
    setNotice('Message sent by the CSR.')
  }

  return (
    <main className="prototype-main agent-workspace-main">
      <section className="page-heading impact-heading">
        <div>
          <Text className="eyebrow">CSR WORKSPACE</Text>
          <Title2 as="h1">Resolve the issue with context intact</Title2>
          <Text className="subtitle">Review the AI handoff, move the conversation forward, and retain judgment over every action.</Text>
        </div>
        <Badge appearance="outline" color="informative">Simulated conversation</Badge>
      </section>

      <div className="agent-workspace-grid">
        <aside className="agent-inbox" aria-label="Assigned conversations">
          <div className="agent-panel-heading agent-inbox-heading">
            <div><h2>My conversations</h2><Text size={200}>3 assigned <span aria-hidden="true">·</span> <strong>1 urgent</strong></Text></div>
          </div>
          <button className="agent-inbox-row selected-agent-conversation" type="button">
            <span><strong>Priya Sharma</strong><small>Duplicate card charge</small></span><Badge appearance="tint" color="danger">Now</Badge>
          </button>
          <button className="agent-inbox-row" type="button">
            <span><strong>Alex Morgan</strong><small>Account recovery</small></span><small>4m</small>
          </button>
          <button className="agent-inbox-row" type="button">
            <span><strong>Jordan Kim</strong><small>Delivery exception</small></span><small>8m</small>
          </button>
        </aside>

        <section className="agent-conversation" aria-label="Conversation with Priya Sharma">
          <div className="conversation-header-scroll">
            <div className="conversation-control-header">
              <div className="cch-identity">
                <Avatar name="Priya Sharma" size={36} />
                <div><strong>Priya Sharma</strong><Text size={200}>Customer since May 2022 · Billing support</Text></div>
              </div>
              <div className="cch-actions">
                <Tooltip content="Call" relationship="label"><Button appearance="subtle" icon={<CallRegular />} aria-label="Call" onClick={() => setNotice('Voice call action simulated.')} /></Tooltip>
                <Tooltip content="Transfer" relationship="label"><Button appearance="subtle" icon={<ArrowSwapRegular />} aria-label="Transfer" onClick={() => setNotice('Transfer action simulated. Handoff context will remain attached.')} /></Tooltip>
                <Tooltip content="Customer record" relationship="label"><Button appearance="subtle" icon={<DatabaseRegular />} aria-label="Customer record" onClick={() => setNotice('Customer record lookup simulated.')} /></Tooltip>
                <Tooltip content="End chat" relationship="label"><Button appearance="subtle" icon={<DismissRegular />} aria-label="End chat" onClick={() => setNotice('Conversation remains open until the CSR confirms closure.')} /></Tooltip>
              </div>
            </div>
          </div>

          <div className="handoff-arrival">
            <div><SparkleRegular /><span><Text weight="semibold">AI handoff received</Text><Text size={200}>Full conversation history and unresolved work are attached.</Text></span></div>
            {handoffAccepted
              ? <Badge appearance="tint" color="success" icon={<CheckmarkCircleRegular />}>Accepted</Badge>
              : <Button appearance="primary" size="small" onClick={() => { setHandoffAccepted(true); setNotice('Handoff accepted. Priya has been told a CSR has joined.') }}>Accept handoff</Button>}
          </div>

          <div className="conversation-history" aria-label="Preserved conversation history">
            <Text className="eyebrow">PRESERVED CONVERSATION</Text>
            <ChatMessage role="C2 customer" name="Priya Sharma" timestamp="10:42 AM" message="I was charged twice for the same order. This is unacceptable. I already gave the order number and verified my identity." />
            <div className="ai-transcript-message"><SparkleRegular /><span><Text weight="semibold">Virtual agent · 10:43 AM</Text><Text>I found two $149.99 card entries and tried to check refund eligibility. That service did not respond, so I am bringing in a billing specialist with this history.</Text></span></div>
            <ChatMessage role="C2 customer" name="Priya Sharma" timestamp="10:44 AM" message="This is ridiculous. I have already explained everything and I am not starting over. Tell me when you are returning my money." />
            <div className="handoff-event"><CheckmarkCircleRegular /><Text size={200}>10:44 AM · Conversation and handoff contract preserved for the CSR</Text></div>
            {agentMessages.map((message) => <ChatMessage key={message.id} role="CS rep" name="You" timestamp={message.timestamp} message={message.message} />)}
          </div>

          <div className="agent-composer">
            <Composer
              key={composerVersion}
              initialValue={draft}
              placeholder="Reply to Priya"
              onSubmit={sendMessage}
              ariaLabel="Reply to Priya Sharma"
            />
            <Text size={200} role="status">{notice}</Text>
          </div>
        </section>

        <aside className="handoff-sidecar" aria-label="AI handoff context and assistance">
          <section className="handoff-contract" aria-labelledby="handoff-contract-title">
            <div className="agent-panel-heading">
              <div><Text className="eyebrow">HANDOFF CONTRACT</Text><h2 id="handoff-contract-title">Know before responding</h2></div>
              <Badge appearance="tint" color="success">Complete</Badge>
            </div>
            <dl className="handoff-fields">
              <div><dt>Customer need</dt><dd>Confirm whether the second $149.99 card charge will be returned.</dd></div>
              <div><dt>AI attempted</dt><dd>Verified identity, found both card entries, and called refund eligibility.</dd></div>
              <div className="handoff-field-alert"><dt>What failed</dt><dd>Refund eligibility service timed out twice.</dd></div>
              <div><dt>Sentiment</dt><dd><Badge appearance="tint" color="warning">Frustrated · urgency rising</Badge></dd></div>
              <div><dt>Promises made</dt><dd>A billing CSR will review today. No refund was promised.</dd></div>
              <div><dt>Unresolved needs</dt><dd>Check pending versus settled charges, then agree the resolution and timing.</dd></div>
            </dl>
          </section>

          <section className="agent-ai-assist" aria-labelledby="agent-assist-title">
            <div className="agent-panel-heading coaching-heading"><div><Text className="eyebrow">COACHING</Text><h2 id="agent-assist-title">Conversation guidance</h2></div><SparkleRegular /></div>
            <TabList className="coaching-tabs" size="small" selectedValue={coachingView} onTabSelect={(_, data) => setCoachingView(data.value as CoachingView)}>
              <Tab value="active">Active nudges</Tab>
              <Tab value="history">History</Tab>
            </TabList>

            {coachingView === 'active' && nudgeStatus !== 'dismissed' ? <article className="coaching-nudge">
              <div className="coaching-nudge-header"><Text weight="semibold">Customer care</Text><Badge appearance="tint" color="warning">Medium</Badge></div>
              <Text><strong>Issue:</strong> Customer frustration is rising. Acknowledge the impact, confirm that context is preserved, and give a clear next step.</Text>
              <Text size={200} weight="semibold" className="suggested-response-label">Suggested responses</Text>
              <div className="coaching-responses">
                {coachingSuggestions.map((suggestion) => <button type="button" key={suggestion.label} onClick={() => prepareDraft(suggestion.message)}>
                  <strong>{suggestion.label}</strong>
                  <span>{suggestion.message}</span>
                  <small>Use response</small>
                </button>)}
              </div>
              <div className="coaching-nudge-actions">
                <Text size={100}>AI-generated content may be incorrect</Text>
                <span>
                  <Button appearance="primary" size="small" disabled={nudgeStatus === 'acknowledged'} onClick={() => { setNudgeStatus('acknowledged'); setNotice('Coaching nudge acknowledged. No response was sent.') }}>{nudgeStatus === 'acknowledged' ? 'Acknowledged' : 'Acknowledge'}</Button>
                  <Button size="small" onClick={() => { setNudgeStatus('dismissed'); setNotice('Coaching nudge dismissed.') }}>Dismiss</Button>
                </span>
              </div>
            </article> : coachingView === 'active' ? <div className="coaching-empty"><Text weight="semibold">No active nudges</Text><Text size={200}>Dismissed guidance remains available in History.</Text></div> : <div className="coaching-history">
              <Text weight="semibold">Recent coaching</Text>
              <div><span><Text>Customer frustration</Text><Text size={200}>10:44 AM</Text></span><Badge appearance="tint" color={nudgeStatus === 'active' ? 'informative' : 'subtle'}>{nudgeStatus === 'active' ? 'Active' : nudgeStatus === 'acknowledged' ? 'Acknowledged' : 'Dismissed'}</Badge></div>
            </div>}

            <div className="agent-assist-actions secondary-assist-actions">
              <Button icon={<SearchRegular />} onClick={retrievePolicy}>Retrieve policy</Button>
              <Button onClick={draftNotes}>Draft after-call note</Button>
            </div>
            {assistResult && <div className="assist-result"><Text weight="semibold">Review before use</Text><Text>{assistResult}</Text></div>}
            <div className="human-judgment-note"><WarningRegular /><Text size={200}>AI prepares guidance. The CSR verifies facts, edits language, chooses the action, and sends or saves it.</Text></div>
          </section>
        </aside>
      </div>
    </main>
  )
}