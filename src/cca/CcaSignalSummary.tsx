import { Badge, Text } from '@fluentui/react-components'

type CcaSignalSummaryProps = {
  incidentId: string
  signals: string[]
}

export const ccaIntegrationStatus = 'fluent-fallback' as const

export function CcaSignalSummary({ incidentId, signals }: CcaSignalSummaryProps) {
  return (
    <div className="cca-signal-summary" data-cca-integration={ccaIntegrationStatus}>
      <div className="cca-signal-heading">
        <Text size={200} weight="semibold">CURRENT SIGNALS</Text>
        <Badge appearance="outline" color="informative">CCA-ready</Badge>
      </div>
      <div className="signal-list">
        {signals.map((signal, index) => <span id={`signal-${incidentId}-${index}`} key={signal}>{signal}</span>)}
      </div>
    </div>
  )
}