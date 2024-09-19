import { functionalClassificationCodes } from '../constants/FunctionalClassificationCodes';

export const convertCoordinates = (x) => x / 1_000_000;

export const extractFuncClass = (funcCode) =>
  functionalClassificationCodes[funcCode]?.name || 'unknown';

/**
 * 
 * @param {Number} adt - curved pixel size based on average daily traffic
 * @returns {Number}
 */
export const pixelSizeBasedOnADT = (adt) => adt / 1000 + 10;

/**
 * 
 * @param {Number} adt - curved pixel size based on active daily traffic
 * @returns {Number}
 */
export const colorBasedOnADT = (adt) => adt / 1000 + 10;

export const getMinMax = (values) => [Math.min(...values), Math.max(...values)];