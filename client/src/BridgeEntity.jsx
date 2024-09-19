// import React from 'react';
import { Cartesian3, Color } from 'cesium';
import { Entity, EntityDescription, PointGraphics } from 'resium';
import { convertCoordinates } from './utils/map';

const pixelSizeBasedOnADT = (adt) => adt / 5000 + 3;

const getColorFromPixelSize = (pixelSize) => {
  // Normalize pixelSize to a 0 to 1 range
  const t = Math.min(Math.max(pixelSize / 20, 0), 1);

  // Interpolate between blue and red
  return Color.fromCssColorString(
    `rgb(${Math.floor(255 * t)}, 0, ${Math.floor(255 * (1 - t))})`
  );
};

export default function BridgeEntity(bridge) {
  const position = Cartesian3.fromDegrees(
    -convertCoordinates(bridge.longitude),
    convertCoordinates(bridge.latitude)
  );
  const pixelSize = pixelSizeBasedOnADT(bridge.adt);

  // console.log({ bridge });
  return (
    <Entity position={position} name={bridge.stateCode}>
      <PointGraphics
        pixelSize={pixelSize}
        color={getColorFromPixelSize(pixelSize)}
      />
      <EntityDescription>
        <h1>{bridge.stateCode}</h1>
        <p>
          <strong>County Code:</strong> {bridge.countyCode}
        </p>
        <p>
          <strong>Area Type:</strong> {bridge.areaType}
        </p>
        <p>
          <strong>Year Built:</strong> {bridge.yearBuilt}
        </p>
        <p>
          <strong>Deck Condition:</strong> {bridge.deckCondition}
        </p>
        <p>
          <strong>Superstructure Condition:</strong>{' '}
          {bridge.superstructureCondition}
        </p>
        <p>
          <strong>Substructure Condition:</strong>{' '}
          {bridge.substructureCondition}
        </p>
        <p>
          <strong>Culvert Condition:</strong> {bridge.culvertCondition}
        </p>
        <p>
          <strong>ADT (Average Daily Traffic):</strong> {bridge.adt}
        </p>
        <p>
          <strong>Bridge Improvement Cost:</strong> $
          {bridge.bridgeImpCost?.toLocaleString() || 'N/A'}
        </p>
        <p>
          <strong>Roadway Improvement Cost:</strong> $
          {bridge.roadwayImpCost?.toLocaleString() || 'N/A'}
        </p>
        <p>
          <strong>Total Improvement Cost:</strong> $
          {bridge.totalImpCost?.toLocaleString() || 'N/A'}
        </p>
      </EntityDescription>
    </Entity>
  );
}
