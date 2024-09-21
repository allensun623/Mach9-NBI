/* eslint-disable react/prop-types */
import { Color } from 'cesium';
import { Entity } from 'resium';
import {
  calculateClusterSize,
  formatPointCount,
  toCartesian3,
} from '../../utils/zoomUtils';

const getLabel = (isCluster, pointCount) =>
  isCluster
    ? {
        text: formatPointCount(pointCount), // Display formatted point count for clusters
        font: '10pt',
        style: { fillColor: Color.BLACK },
      }
    : undefined; // No label if it's not a cluster

export default function BridgeEntity({ cluster, onClusterClick }) {
  const [lng, lat] = cluster.geometry.coordinates;
  const cartesian = toCartesian3(lat, lng);

  const isCluster = cluster.properties?.cluster;
  const pointCount = isCluster ? cluster.properties.point_count : 1;

  // TODO remove focus camera on cluster object
  return (
    <Entity
      key={cluster.id ?? cluster.properties.id}
      position={cartesian}
      label={getLabel(isCluster, pointCount)}
      point={{
        pixelSize: calculateClusterSize(pointCount),
        color: new Color(1, 1, 0, 0.5),
      }}
      onClick={
        () => onClusterClick(isCluster, cartesian) // Trigger your click handler
      }
    />
  );
}

// const getBridgeDetails = (bridge) => [
//   { label: 'State Code', value: bridge.stateCode },
//   { label: 'County Code', value: bridge.countyCode },
//   { label: 'Area Type', value: bridge.areaType },
//   { label: 'Year Built', value: bridge.yearBuilt },
//   { label: 'Deck Condition', value: bridge.deckCondition },
//   {
//     label: 'Superstructure Condition',
//     value: bridge.superstructureCondition,
//   },
//   { label: 'Substructure Condition', value: bridge.substructureCondition },
//   { label: 'Culvert Condition', value: bridge.culvertCondition },
//   { label: 'ADT (Average Daily Traffic)', value: bridge.adt },
//   {
//     label: 'Bridge Improvement Cost',
//     value: bridge.bridgeImpCost?.toLocaleString() || 'N/A',
//   },
//   {
//     label: 'Roadway Improvement Cost',
//     value: bridge.roadwayImpCost?.toLocaleString() || 'N/A',
//   },
//   {
//     label: 'Total Improvement Cost',
//     value: bridge.totalImpCost?.toLocaleString() || 'N/A',
//   },
// ];

// export default function BridgeEntity(bridge) {
//   const bridgeDetails = getBridgeDetails(bridge);

//   return (
//     <Entity position={bridge.position} name={bridge.facilityCarried}>
//       <PointGraphics pixelSize={bridge.pixelSize} color={bridge.color} />
//       <EntityDescription>
//         {bridgeDetails.map((detail, index) => (
//           <p key={index}>
//             <strong>{detail.label}:</strong> {detail.value}
//           </p>
//         ))}
//       </EntityDescription>
//     </Entity>
//   );
// }
