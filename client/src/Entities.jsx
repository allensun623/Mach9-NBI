import { Cartesian3, Color } from 'cesium';
// import React from 'react';
import { Entity, EntityDescription, PointGraphics } from 'resium';
import { bridgesPartials } from './assets/dataset/bridges';
import { convertCoordinates } from './utils/map';

const BridgeEntity = (bridge) => {
  const position = Cartesian3.fromDegrees(
    convertCoordinates(bridge.longitude),
    convertCoordinates(bridge.latitude)
  );
  console.log({ bridge });
  return (
    <Entity position={position} name={bridge.stateCode}>
      <PointGraphics pixelSize={50} color={Color.RED} />
      <EntityDescription>
        <h1>{bridge.stateCode}</h1>
        <p>
          <strong>County Code:</strong> {bridge.countyCode}
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
        {/* {bridge.bridgeImpCost && (
          <p>
            <strong>Bridge Improvement Cost:</strong> $
            {bridge.bridgeImpCost?.toLocaleString()}
          </p>
        )}
        {bridge.roadwayImpCost && (
          <p>
            <strong>Roadway Improvement Cost:</strong> $
            {bridge.roadwayImpCost?.toLocaleString()}
          </p>
        )}
        {bridge.totalImpCost && (<p>
          <strong>Total Improvement Cost:</strong> $
          {bridge.totalImpCost?.toLocaleString()}
        </p>)} */}
      </EntityDescription>
    </Entity>
  );
};

export default function Entities() {
  const bridges = bridgesPartials(10);
  return <>{bridges.map(BridgeEntity)}</>;
}
