/* eslint-disable react/prop-types */
import { Color } from 'cesium';
import { useCallback } from 'react';
import { Entity, EntityDescription } from 'resium';
import {
  calculateClusterSize,
  formatPointCount,
  getColorFromPixelSize,
  toCartesian3,
} from '../../utils';

const getBridgeDetails = (bridge) =>
  bridge
    ? [
        { label: 'State Code', value: bridge.stateCode },
        { label: 'County Code', value: bridge.countyCode },
        { label: 'Area Type', value: bridge.areaType },
        { label: 'Year Built', value: bridge.yearBuilt },
        { label: 'Deck Condition', value: bridge.deckCondition },
        {
          label: 'Superstructure Condition',
          value: bridge.superstructureCondition,
        },
        {
          label: 'Substructure Condition',
          value: bridge.substructureCondition,
        },
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
      ]
    : [];

const getLabel = (isCluster, pointCount) =>
  isCluster
    ? {
        text: formatPointCount(pointCount), // Display formatted point count for clusters
        font: '10pt',
        style: { fillColor: Color.BLACK },
      }
    : undefined; // No label if it's not a cluster

export default function BridgeEntity({ cluster, onClick, bridge, id }) {
  const [lng, lat] = cluster.geometry.coordinates;
  const cartesian = toCartesian3(lng, lat);

  const isCluster = cluster.properties?.cluster;
  const pointCount = isCluster ? cluster.properties.point_count : 1;
  const pixelSize = calculateClusterSize(pointCount);
  const color = getColorFromPixelSize(pixelSize);
  const bridgeDetails = getBridgeDetails(bridge);
  const handleClick = useCallback(
    () => onClick({ isCluster, clusterPosition: cartesian, id }),
    [isCluster, cartesian, id, onClick]
  );

  // TODO remove focus camera on cluster object
  return (
    <Entity
      key={id}
      position={cartesian}
      label={getLabel(isCluster, pointCount)}
      point={{
        pixelSize,
        color,
      }}
      onClick={handleClick}
    >
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