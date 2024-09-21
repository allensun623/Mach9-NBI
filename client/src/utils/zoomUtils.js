import { Cartesian3 } from 'cesium';

const MAX_ZOOM_LEVEL = 16; // Maximum zoom level (similar to Google Maps)
const BASE_ZOOM_AMOUNT = 100; // Base zoom amount used in zoom calculations

/**
 * Calculates the zoom amount for a given zoom level, where the zoom level affects how much
 * the map zooms in or out.
 *
 * @param {number} currentZoomLevel - The current zoom level.
 * @returns {number} - The zoom amount corresponding to the provided zoom level.
 * @throws {Error} - Throws an error if the zoom level is invalid.
 */
export const calculateZoomAmount = (currentZoomLevel) => {
  // Ensure currentZoomLevel is a valid non-negative number
  if (typeof currentZoomLevel !== 'number' || currentZoomLevel < 0) {
    throw new Error('Invalid zoom level. Must be a non-negative number.');
  }

  // Array of zoom amounts for each level, using a power of 2 scaling
  const zoomAmounts = Array.from(
    { length: MAX_ZOOM_LEVEL + 1 }, // +1 to include MAX_ZOOM_LEVEL
    (_, i) => BASE_ZOOM_AMOUNT * Math.pow(2, MAX_ZOOM_LEVEL - i + 1) // Exponential scaling
  );

  // Return the appropriate zoom amount for the current zoom level
  return zoomAmounts[Math.min(currentZoomLevel, MAX_ZOOM_LEVEL)];
};

/**
 * Calculates the height of the camera (or map view) based on the zoom level, where
 * higher zoom levels correspond to lower heights (closer to the ground).
 *
 * @param {number} zoomLevel - The zoom level (0 is the farthest zoom out, MAX_ZOOM_LEVEL is the closest).
 * @returns {number} - The height corresponding to the zoom level.
 */
export const calculateHeightFromZoomLevel = (zoomLevel) => {
  const minHeight = 1000; // Minimum height for closest zoom
  const maxHeight = 20000000; // Maximum height for farthest zoom

  // Calculate the height based on the zoom level using exponential scaling
  return (
    minHeight *
    Math.pow(
      maxHeight / minHeight,
      (MAX_ZOOM_LEVEL - zoomLevel) / MAX_ZOOM_LEVEL
    )
  );
};

/**
 * Converts a given height to the corresponding zoom level.
 *
 * @param {number} height - The height from which to derive the zoom level.
 * @returns {number} - The calculated zoom level.
 */
export const calculateZoomLevel = (height) => {
  const minHeight = 1000; // Closest zoom level height
  const maxHeight = 20000000; // Farthest zoom level height

  // Ensure the height is within the allowed bounds
  height = Math.max(minHeight, Math.min(maxHeight, height));

  // Calculate the zoom level from height using logarithmic scaling
  const level =
    MAX_ZOOM_LEVEL -
    (Math.log(height / minHeight) / Math.log(maxHeight / minHeight)) *
      MAX_ZOOM_LEVEL;

  return Math.round(level); // Round to the nearest zoom level
};

/**
 * Calculates the size of a cluster based on the number of points it contains.
 * Larger clusters will have larger sizes, but size is capped at maxSize.
 *
 * @param {number} pointCount - The number of points in the cluster.
 * @returns {number} - The calculated size for the cluster.
 */
export const calculateClusterSize = (pointCount) => {
  const minSize = 10; // Minimum size for small clusters
  const maxSize = 50; // Maximum size for large clusters

  // Logarithmic scaling based on the number of points
  const logCount = Math.log10(pointCount); // Log base 10 of the point count
  const normalizedSize = Math.max(minSize, Math.min(maxSize, logCount * 10)); // Normalize size

  return normalizedSize;
};

/**
 * Formats a count into a human-readable string (e.g., 1K, 1M).
 *
 * @param {number} count - The number to format.
 * @returns {string} - The formatted count string with K/M suffix.
 */
export const formatPointCount = (count) => {
  if (count >= 1_000_000) {
    return `${(count / 1_000_000).toFixed(0)}M`; // Format as millions
  } else if (count >= 1_000) {
    return `${(count / 1_000).toFixed(0)}K`; // Format as thousands
  } else {
    return count.toString(); // Return the exact count for smaller values
  }
};

/**
 * Converts latitude and longitude to a Cesium Cartesian3 object.
 *
 * @param {number} lat - The latitude value in degrees.
 * @param {number} lng - The longitude value in degrees.
 * @returns {Cartesian3} - The corresponding Cartesian3 object.
 */
export const toCartesian3 = (lng, lat) => {
  return Cartesian3.fromDegrees(lng, lat); // Convert degrees to Cartesian3
};
