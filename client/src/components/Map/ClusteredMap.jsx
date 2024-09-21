/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import Supercluster from 'supercluster';
import BridgeEntity from './BridgeEntity';

function generateArray(length) {
  return Array.from({ length }, (_, i) => ({
    id: i,
    lat: 34.052235 + Math.random() * 5,
    lng: -118.243683 + Math.random() * 5,
  }));
}

const points = generateArray(100_000);

// Map points to Supercluster format
const geoJSONPoints = points.map((point) => ({
  type: 'Feature',
  properties: { id: point.id },
  geometry: {
    type: 'Point',
    coordinates: [point.lng, point.lat],
  },
}));

// Initialize Supercluster instance
const cluster = new Supercluster({
  radius: 40, // adjust clustering radius
  maxZoom: 16, // zoom level for clustering
});

// Load points into Supercluster
cluster.load(geoJSONPoints);

export default function ClusteredMap({ zoomLevel, onClusterClick }) {
  const [clusters, setClusters] = useState([]);

  useEffect(() => {
    // if (isNil(zoomLevel)) return;
    const bounds = [-180, -85, 180, 85]; // global bounds
    const clusterData = cluster.getClusters(bounds, zoomLevel);

    setClusters(clusterData);
  }, [zoomLevel]);

  return (
    <>
      {clusters.map((cluster, i) => (
        <BridgeEntity
          key={i}
          cluster={cluster}
          onClusterClick={onClusterClick}
        />
      ))}
    </>
  );
}
