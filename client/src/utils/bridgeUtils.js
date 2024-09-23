import { BoundingSphere, Cartesian3, Color, Intersect } from 'cesium';
import { pick } from 'lodash';

/**
 * Converts an array of objects into a single object with dynamic keys.
 *
 * @param {Array} arrObjs - The array of objects to convert.
 * @param {String} key - The key whose value will become the new key in the resulting object.
 * @returns {Object} - The resulting object with dynamic keys.
 */
export const convertArrayObjectToSingleObject = (arrObjs, key) => {
  return arrObjs.reduce((acc, obj) => {
    const keyValue = obj[key]; // Extract the value of the specified key
    // eslint-disable-next-line no-unused-vars
    const { [key]: _, ...rest } = obj; // Destructure to exclude the specified key
    acc[keyValue] = rest; // Use the key value as the key in the resulting object
    return acc;
  }, {});
};

/**
 * Converts longitude and latitude to an array with transformed values.
 *
 * @param {Object} coordinate - The coordinate object containing longitude and latitude.
 * @returns {Array} - An array with transformed longitude and latitude.
 */
export const convertCoordinates = ({ longitude, latitude }) => {
  const BASE = 1_000_000; // Base value for transformation
  return [-longitude / BASE, latitude / BASE]; // Return transformed values
};

/**
 * Creates a Cartesian3 position object from longitude and latitude values.
 *
 * @param {Object} coordinate - The coordinate object containing longitude and latitude.
 * @returns {Cartesian3} - The Cartesian3 position object.
 */
export const getCartesian3Position = (coordinate) =>
  Cartesian3.fromDegrees(...convertCoordinates(coordinate)); // Create Cartesian3 object

/**
 * Calculates the pixel size based on a provided ADT (Average Daily Traffic) value.
 *
 * @param {number} adt - The ADT value to base the pixel size on.
 * @returns {number} - The calculated pixel size.
 */
export const pixelSizeBasedOnADT = (adt) => adt / 5000 + 3; // Calculate pixel size

/**
 * Determines the color for a given pixel size, interpolating between blue and red.
 *
 * @param {number} pixelSize - The pixel size to determine the color for.
 * @returns {Color} - The resulting color.
 */
export const getColorFromPixelSize = (pixelSize) => {
  const t = Math.min(Math.max(pixelSize / 50, 0), 1); // Normalize pixelSize to 0-1 range
  return Color.fromCssColorString(
    `rgba(${Math.floor(255 * t)}, 0, ${Math.floor(255 * (1 - t))}, 0.5)`
  ); // Interpolate between blue and red
};

/**
 * Converts a numerical traffic value to a string representation with a 'K' suffix.
 *
 * @param {number} x - The numerical traffic value.
 * @returns {string} - The formatted string with a 'K' suffix.
 */
export const convertTraffic = (x) => `${x % 1000}K`; // Format traffic value

/**
 * Computes the minimum and maximum values from an array of numbers.
 *
 * @param {Array<number>} values - The array of numerical values.
 * @returns {Array<number>} - An array containing the minimum and maximum values.
 */
export const getMinMax = (values) => [Math.min(...values), Math.max(...values)];

/**
 * Extracts the minimum and maximum years from an array of bridges.
 *
 * @param {Object} bridges - The bridge object.
 * @returns {Array<number>} - An array containing the minimum and maximum years.
 */
export const getMinMaxYears = (bridges) => {
  const years = Object.values(bridges).map(
    (b) => b?.yearReconstructed || b?.yearBuilt
  ); // Extract years
  return getMinMax(years); // Return min and max years
};

/**
 * Extracts the minimum and maximum ADT (Average Daily Traffic) values from an array of bridges.
 *
 * @param {Object} bridges - The bridge object.
 * @returns {Array<number>} - An array containing the minimum and maximum ADT values.
 */
export const getMinMaxAdts = (bridges) => {
  const adts = Object.values(bridges).map((b) => b?.adt || 0); // Extract ADT values
  return getMinMax(adts); // Return min and max ADT values
};

/**
 * Checks if a given point is within the camera's view frustum.
 *
 * @param {Object} point - The point to check, which should have a 'position' property.
 * @param {Object} cameraFrustumView - The camera's view frustum for visibility checking.
 * @returns {boolean} - Returns true if the point is within the view, otherwise false.
 */
const checkPointWithinView = (point, cameraFrustumView) => {
  const boundingSphere = new BoundingSphere(point.position); // Create bounding sphere
  return (
    cameraFrustumView.computeVisibility(boundingSphere) !== Intersect.OUTSIDE // Check visibility
  );
};

/**
 * Filters an array of points to find which ones are visible based on the camera's view.
 *
 * @param {Object} params - The parameters containing points and camera.
 * @param {Object} params.points - The point object for filter.
 * @param {Object} params.camera - The camera object used for visibility checking.
 * @returns {Array<Object>} - An array of visible points with ids only.
 */
export const filterVisiblePointsIds = ({ points, camera }) => {
  const cameraFrustumView = camera.frustum.computeCullingVolume(
    camera.position,
    camera.direction,
    camera.up
  ); // Compute camera's culling volume

  return Object.values(points)
    .filter((p) => checkPointWithinView(p, cameraFrustumView)) // Filter visible points
    .map((p) => p.id);
};

/**
 * Extracts the longitude and latitude from a point object and converts them
 * into an array of transformed coordinates.
 *
 * @param {Object} point - The object that contains longitude and latitude properties.
 * @returns {Array<number>} - An array containing the transformed longitude and latitude values.
 */
export const pickCoordinates = (point) =>
  convertCoordinates(pick(point, ['longitude', 'latitude']));
