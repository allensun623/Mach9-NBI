/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import Supercluster from 'supercluster';
import { calculateZoomAmount } from '../../utils/zoomUtils';
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

export default function ClusteredMap({ zoomLevel, viewer }) {
  const [clusters, setClusters] = useState([]);

  useEffect(() => {
    // if (isNil(zoomLevel)) return;
    const bounds = [-180, -85, 180, 85]; // global bounds
    const clusterData = cluster.getClusters(bounds, zoomLevel);

    setClusters(clusterData);
  }, [zoomLevel]);

  const handleClusterClick = (isCluster, clusterPosition) => {
    if (!isCluster) return;
    if (!viewer || !clusterPosition) {
      console.warn('Invalid cluster position:', clusterPosition);
      return;
    }
    // Zoom in by a specified amount (you can adjust the amount as needed)
    const zoomAmount = calculateZoomAmount(zoomLevel);
    viewer.camera.zoomIn(zoomAmount);
  };

  return (
    <>
      {clusters.map((cluster, i) => (
        <BridgeEntity
          key={i}
          cluster={cluster}
          onClusterClick={handleClusterClick}
        />
      ))}
    </>
  );
}
