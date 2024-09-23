import { gql } from '@apollo/client';

export const GET_BRIDGES = gql`
  query GetBridges {
    bridges {
      id
      stateCode
      facilityCarried
      latitude
      longitude
      countyCode
      deckCondition
      superstructureCondition
      substructureCondition
      culvertCondition
      yearBuilt
      yearReconstructed
      adt
      trafficLanesOn
      trafficLanesUnd
      percentAdtTruck
      scourCritical
      bridgeImpCost
      roadwayImpCost
      totalImpCost
      functionalClassificationCode
    }
  }
`;
