import { gql } from '@apollo/client';

export const GET_FUNCTIONAL_CLASSIFICATION_CODES = gql`
  query GetFunctionalClassificationCodes {
    functionalClassificationCodes {
      code
      name
      description
    }
  }
`;
