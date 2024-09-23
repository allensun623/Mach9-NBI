import { useEffect } from 'react';
import { filterVisiblePointsIds } from '../utils';

export const useFilterPointsByView = (
  camera,
  scene,
  bridges,
  setVisibleBridgeIds
) => {
  useEffect(() => {
    const filterPointsByView = () => {
      const visibleBridgeIdsFiltered = filterVisiblePointsIds({
        points: bridges,
        camera,
        scene,
      });
      setVisibleBridgeIds(visibleBridgeIdsFiltered);
    };

    camera.changed.addEventListener(filterPointsByView);
  }, [camera, scene, bridges]);
};
