/* eslint-disable react/prop-types */
import { useMemo } from 'react';
import { Entity, EntityDescription } from 'resium';
import {
  calculateClusterSize,
  getColorFromPixelSize,
  getEntityDetails,
  getLabel,
  toCartesian3,
} from '../../utils';

export default function BridgeEntity({ cluster, onClick, bridge }) {
  const [lng, lat] = cluster.geometry.coordinates;
  const cartesian = useMemo(() => toCartesian3(lng, lat), [lng, lat]);

  const isCluster = cluster.properties?.cluster;
  const pointCount = isCluster ? cluster.properties.point_count : 1;
  const pixelSize = useMemo(
    () => calculateClusterSize(pointCount),
    [pointCount]
  );
  const color = useMemo(() => getColorFromPixelSize(pixelSize), [pixelSize]);
  const entityDetails = useMemo(
    () => getEntityDetails(isCluster, cluster, bridge),
    [isCluster, cluster, bridge]
  );

  return (
    <Entity
      position={cartesian}
      label={getLabel(isCluster, pointCount)}
      point={{
        pixelSize,
        color,
      }}
      onClick={() =>
        onClick({
          isCluster,
          clusterPosition: cartesian,
          bridgeId: cluster.properties?.id,
        })
      }
    >
      <EntityDescription>
        {entityDetails.map((detail, index) => (
          <p key={index}>
            <strong>{detail.label}:</strong> {detail.value}
          </p>
        ))}
      </EntityDescription>
    </Entity>
  );
}
