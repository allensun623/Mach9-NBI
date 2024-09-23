const bridgeType = `#graphql
  type Bridge {
    id: Int
    stateCode: String
    facilityCarried: String
    latitude: Float
    longitude: Float
    countyCode: String
    deckCondition: String
    superstructureCondition: String
    substructureCondition: String
    culvertCondition: String
    yearBuilt: Int
    yearReconstructed: Int
    adt: Int
    trafficLanesOn: Int
    trafficLanesUnd: Int
    percentAdtTruck: Int
    scourCritical: String
    bridgeImpCost: Int
    roadwayImpCost: Int
    totalImpCost: Int
    functionalClassificationCode: Int
  }
`;

export default bridgeType;
