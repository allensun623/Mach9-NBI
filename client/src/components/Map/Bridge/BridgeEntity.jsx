/* eslint-disable react/prop-types */
import { Entity } from 'resium';
import { toCartesian3 } from '../../../utils';
import BridgeEntityDescription from './BridgeEntityDescription';
import BridgeEntityGraphics from './BridgeEntityGraphics';

export default function BridgeEntity({ cluster, onClick, bridge }) {
  const [lng, lat] = cluster.geometry.coordinates;
  const cartesian = toCartesian3(lng, lat);
  const isCluster = cluster.properties?.cluster;

  return (
    <Entity
      position={cartesian}
      onClick={() =>
        onClick({
          isCluster,
          clusterPosition: cluster.geometry.coordinates,
          bridgeId: cluster.properties?.id,
        })
      }
    >
      <BridgeEntityGraphics isCluster={isCluster} cluster={cluster} />
      <BridgeEntityDescription
        isCluster={isCluster}
        cluster={cluster}
        bridge={bridge}
      />
    </Entity>
  );
}
