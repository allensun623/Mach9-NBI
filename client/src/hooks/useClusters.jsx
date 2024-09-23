import { useEffect, useMemo, useState } from 'react';
import Supercluster from 'supercluster';

export const useClusters = (geoJSONPoints, zoomLevel) => {
  const [clusters, setClusters] = useState([]);

  const cluster = useMemo(
    () => new Supercluster({ radius: 30, maxZoom: 16 }),
    []
  );

  useEffect(() => {
    if (zoomLevel && geoJSONPoints.length) {
      const bounds = [-180, -85, 180, 85];
      cluster.load(geoJSONPoints);
      const clusterData = cluster.getClusters(bounds, zoomLevel);
      setClusters(clusterData);
    }
  }, [zoomLevel, geoJSONPoints, cluster]);

  return clusters;
};
