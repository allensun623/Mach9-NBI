import functionalClassificationCodes from '../data/functionalClassificationCodes';
import bridges from '../data/rawBridges';

const resolvers = {
  Query: {
    bridges: () => bridges,
    functionalClassificationCodes: () => functionalClassificationCodes,
  },
};

export default resolvers;
