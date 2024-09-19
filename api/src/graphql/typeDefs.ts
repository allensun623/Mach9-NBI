import bridgeType from './types/bridge';
import functionalClassificationCodeType from './types/functionalClassificationCode';

const queryType = `#graphql
  type Query {
    bridges: [Bridge]
    functionalClassificationCodes: [FunctionalClassificationCode]
  }
`;

const typeDefs = `
  ${bridgeType}
  ${functionalClassificationCodeType}
  ${queryType}
`;

export default typeDefs;
