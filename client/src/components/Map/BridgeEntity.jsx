import { Entity, EntityDescription, PointGraphics } from 'resium';

const getBridgeDetails = (bridge) => [
  { label: 'State Code', value: bridge.stateCode },
  { label: 'County Code', value: bridge.countyCode },
  { label: 'Area Type', value: bridge.areaType },
  { label: 'Year Built', value: bridge.yearBuilt },
  { label: 'Deck Condition', value: bridge.deckCondition },
  {
    label: 'Superstructure Condition',
    value: bridge.superstructureCondition,
  },
  { label: 'Substructure Condition', value: bridge.substructureCondition },
  { label: 'Culvert Condition', value: bridge.culvertCondition },
  { label: 'ADT (Average Daily Traffic)', value: bridge.adt },
  {
    label: 'Bridge Improvement Cost',
    value: bridge.bridgeImpCost?.toLocaleString() || 'N/A',
  },
  {
    label: 'Roadway Improvement Cost',
    value: bridge.roadwayImpCost?.toLocaleString() || 'N/A',
  },
  {
    label: 'Total Improvement Cost',
    value: bridge.totalImpCost?.toLocaleString() || 'N/A',
  },
];

export default function BridgeEntity(bridge) {
  const bridgeDetails = getBridgeDetails(bridge);

  return (
    <Entity position={bridge.position} name={bridge.facilityCarried}>
      <PointGraphics pixelSize={bridge.pixelSize} color={bridge.color} />
      <EntityDescription>
        {bridgeDetails.map((detail, index) => (
          <p key={index}>
            <strong>{detail.label}:</strong> {detail.value}
          </p>
        ))}
      </EntityDescription>
    </Entity>
  );
}
