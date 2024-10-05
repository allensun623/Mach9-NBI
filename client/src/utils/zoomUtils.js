import { Cartesian3 } from 'cesium';
const MAX_ZOOM_LEVEL = 16; // Maximum zoom level (similar to Google Maps)
const BASE_ZOOM_AMOUNT = 100; // Base zoom amount used in zoom calculations
const MIN_HEIGHT = 1_000; // Closest zoom level height
const MAX_HEIGHT = 20_000_000; // Farthest zoom level height
const MIN_SIZE = 20; // Minimum size for small clusters
const MAX_SIZE = 60; // Maximum size for large clusters
const MILLION = 1_000_000;
const THOUSAND = 1_000;

// Array of zoom amount [2^16 * 100, 2^15 * 100, ..., 100]
const ZOOM_AMOUNTS = Array.from(
  { length: MAX_ZOOM_LEVEL + 1 },
  (_, i) => BASE_ZOOM_AMOUNT * Math.pow(2, MAX_ZOOM_LEVEL - i + 1)
);

const COUNT_SUFFIXES = {
  [MILLION]: 'M',
  [THOUSAND]: 'K',
};

/**
 * Calculates the zoom amount for a given zoom level.
 *
 * @param {number} currentZoomLevel - The current zoom level.
 * @returns {number} - The zoom amount corresponding to the provided zoom level.
 * @throws {Error} - Throws an error if the zoom level is invalid.
 */
export const calculateZoomAmount = (currentZoomLevel) => {
  if (typeof currentZoomLevel !== 'number' || currentZoomLevel < 0) {
    throw new Error('Invalid zoom level. Must be a non-negative number.');
  }

  return ZOOM_AMOUNTS[Math.min(currentZoomLevel, MAX_ZOOM_LEVEL)];
};

/**
 * Calculates the height of the camera based on the zoom level.
 *
 * @param {number} zoomLevel - The zoom level (0 is the farthest zoom out, MAX_ZOOM_LEVEL is the closest).
 * @returns {number} - The height corresponding to the zoom level.
 */
export const calculateHeightFromZoomLevel = (zoomLevel) => {
  const zoomFactor = (MAX_ZOOM_LEVEL - zoomLevel) / MAX_ZOOM_LEVEL;
  const heightRatio = MAX_HEIGHT / MIN_HEIGHT;

  return MIN_HEIGHT * Math.pow(heightRatio, zoomFactor);
};

/**
 * Converts a given height to the corresponding zoom level.
 *
 * @param {number} height - The height from which to derive the zoom level.
 * @returns {number} - The calculated zoom level.
 */
export const calculateZoomLevel = (height) => {
  const clampedHeight = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, height));
  const heightRatio = clampedHeight / MIN_HEIGHT;
  const logRatio = Math.log(heightRatio) / Math.log(MAX_HEIGHT / MIN_HEIGHT);
  const zoomLevel = MAX_ZOOM_LEVEL - logRatio * MAX_ZOOM_LEVEL;

  return Math.round(zoomLevel);
};

/**
 * Calculates the size of a cluster based on the number of points.
 *
 * @param {number} pointCount - The number of points in the cluster.
 * @returns {number} - The calculated size for the cluster.
 */
export const calculateClusterSize = (pointCount) => {
  const logCount = Math.log10(pointCount);
  const normalizedSize = Math.max(MIN_SIZE, Math.min(MAX_SIZE, logCount * 10));

  return normalizedSize;
};

/**
 * Divides a given count by a measurement and rounds it to the nearest whole number,
 * then appends a suffix (e.g., 'K', 'M') based on the measurement.
 *
 * @param {number} count - The number to be divided and rounded.
 * @param {number} measurement - The divisor, typically a large number such as 1,000 or 1,000,000.
 * @returns {string} - The formatted string with the rounded value and corresponding suffix (e.g., '1K', '2M').
 */
const divideAndRound = (count, measurement) =>
  `${(count / measurement).toFixed(0)}${COUNT_SUFFIXES[measurement]}`;

/**
 * Formats a count into a human-readable string (e.g., 1K, 1M).
 *
 * @param {number} count - The number to format.
 * @returns {string} - The formatted count string with K/M suffix.
 */
export const formatPointCount = (count) => {
  if (count >= MILLION) return divideAndRound(count, MILLION);
  if (count >= THOUSAND) return divideAndRound(count, THOUSAND);
  return count.toString();
};

/**
 * Converts latitude and longitude to a Cesium Cartesian3 object.
 *
 * @param {number} lng - The longitude value in degrees.
 * @param {number} lat - The latitude value in degrees.
 * @returns {Cartesian3} - The corresponding Cartesian3 object.
 */
export const toCartesian3 = (lng, lat) => Cartesian3.fromDegrees(lng, lat);
