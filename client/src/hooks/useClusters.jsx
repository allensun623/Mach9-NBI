import { useEffect, useMemo, useState } from 'react';
import Supercluster from 'supercluster';

// https://github.com/mapbox/supercluster#readme
const bounds = [-180, -85, 180, 85]; // Default world bounds

export const useClusters = (geoJSONPoints, zoomLevel) => {
  const [clusters, setClusters] = useState([]);

  const cluster = useMemo(
    () => new Supercluster({ radius: 30, maxZoom: 16 }),
    []
  );

  // Effect to update clusters based on the current zoom level and geoJSONPoints
  useEffect(() => {
    if (zoomLevel && geoJSONPoints.length) {
      cluster.load(geoJSONPoints);
      const clusterData = cluster.getClusters(bounds, zoomLevel);
      setClusters(clusterData);
    }
  }, [zoomLevel, geoJSONPoints, cluster]);

  return clusters;
};
