/* eslint-disable react/prop-types */
import { BillboardGraphics, LabelGraphics, PointGraphics } from 'resium';
import locationIcon from '../../../assets/Location Vector Icon.svg';
import {
  calculateClusterSize,
  getColorFromPixelSize,
  getLabel,
} from '../../../utils';

export default function EntityGraphics({ isCluster, cluster }) {
  if (!isCluster) {
    return <BillboardGraphics image={locationIcon} scale={0.5} />;
  }

  const pointCount = cluster.properties.point_count;
  const pixelSize = calculateClusterSize(pointCount);
  const color = getColorFromPixelSize(pixelSize);
  return (
    <>
      <LabelGraphics {...getLabel(pointCount)} />
      <PointGraphics pixelSize={pixelSize} color={color} />
    </>
  );
}
