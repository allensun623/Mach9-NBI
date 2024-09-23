import { BoundingSphere, Cartesian3, Color, Intersect } from 'cesium';

/**
 * Converts an array of objects into a single object,
 * where each object's specified key becomes the new key in the result.
 *
 * @param {Array} arrObjs - The array of objects to convert.
 * @param {String} key - The key whose value will become the new key in the resulting object.
 * @returns {Object} - The resulting object with dynamic keys.
 */
export const convertArrayObjectToSingleObject = (arrObjs, key) => {
  return arrObjs.reduce((acc, obj) => {
    // Extract the value of the specified key from the object
    const keyValue = obj[key];
    // Destructure the object to exclude the specified key
    // eslint-disable-next-line no-unused-vars
    const { [key]: _, ...rest } = obj;
    // Use the key value as the key in the resulting object
    acc[keyValue] = rest;
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
  const BASE = 1_000_000;
  return [-longitude / BASE, latitude / BASE];
};

/**
 * Creates a Cartesian3 position object from longitude and latitude values.
 *
 * @param {Object} coordinate - The coordinate object containing longitude and latitude.
 * @returns {Cartesian3} - The Cartesian3 position object.
 */
export const getCartesian3Position = (coordinate) =>
  Cartesian3.fromDegrees(...convertCoordinates(coordinate));

/**
 * Calculates the pixel size based on a provided adt value.
 *
 * @param {number} adt - The adt (Average Daily Traffic) value to base the pixel size on.
 * @returns {number} - The calculated pixel size.
 */
export const pixelSizeBasedOnADT = (adt) => adt / 5000 + 3;

/**
 * Determines the color for a given pixel size, interpolating between blue and red.
 *
 * @param {number} pixelSize - The pixel size to determine the color for.
 * @returns {Color} - The resulting color.
 */
export const getColorFromPixelSize = (pixelSize) => {
  // Normalize pixelSize to a 0 to 1 range
  const t = Math.min(Math.max(pixelSize / 50, 0), 1);

  // Interpolate between blue and red
  return Color.fromCssColorString(
    `rgba(${Math.floor(255 * t)}, 0, ${Math.floor(255 * (1 - t))}, 0.5)`
  );
};

/**
 * Converts a numerical traffic value to a string representation with a 'K' suffix.
 *
 * @param {number} x - The numerical traffic value.
 * @returns {string} - The formatted string with a 'K' suffix.
 */
export const convertTraffic = (x) => `${x % 1000}K`;

/**
 * Computes the minimum and maximum values from an array of numbers.
 *
 * @param {Array<number>} values - The array of numerical values.
 * @returns {Array<number>} - An array containing the minimum and maximum values.
 */
export const getMinMax = (values) => [Math.min(...values), Math.max(...values)];

/**
 * Extracts the minimum and maximum years from an array of bridges
 * based on either the yearReconstructed or yearBuilt properties.
 *
 * @param {Array<Object>} bridges - The array of bridge objects.
 * @returns {Array<number>} - An array containing the minimum and maximum years.
 */
export const getMinMaxYears = (bridges) => {
  // Map over the bridges and extract the yearReconstructed or yearBuilt
  const years = bridges.map((b) => b?.yearReconstructed || b?.yearBuilt);
  // Return the minimum and maximum years using the getMinMax function
  return getMinMax(years);
};

/**
 * Extracts the minimum and maximum adt (Average Daily Traffic) values from an array of bridges.
 *
 * @param {Array<Object>} bridges - The array of bridge objects.
 * @returns {Array<number>} - An array containing the minimum and maximum adt values.
 */
export const getMinMaxAdts = (bridges) => {
  // Map over the bridges and extract the adt value, defaulting to 0 if undefined
  const adts = bridges.map((b) => b?.adt || 0);
  // Return the minimum and maximum adt values using the getMinMax function
  return getMinMax(adts);
};

/**
 * Checks if a given point is within the camera's view frustum.
 *
 * @param {Object} point - The point to check, which should have a 'position' property.
 * @param {Object} cameraFrustumView - The camera's view frustum for visibility checking.
 * @returns {boolean} - Returns true if the point is within the view, otherwise false.
 */
const checkPointWithinView = (point, cameraFrustumView) => {
  // Create a bounding sphere for the point using its position
  const boundingSphere = new BoundingSphere(point.position);

  // Check if the bounding sphere intersects with the camera's view frustum
  // Returns true if it's visible (not outside)
  return (
    cameraFrustumView.computeVisibility(boundingSphere) !== Intersect.OUTSIDE
  );
};

/**
 * Filters an array of points to find which ones are visible based on the camera's view.
 *
 * @param {Object} params - An object containing the points and camera.
 * @param {Array} params.points - An array of point objects to be filtered.
 * @param {Object} params.camera - The camera object used to compute visibility.
 * @returns {Array} - An array of points that are visible in the camera's view.
 */
export const filterVisiblePoints = ({ points, camera }) => {
  // Compute the camera's frustum (viewing volume) based on its position and orientation
  const cameraFrustumView = camera.frustum.computeCullingVolume(
    camera.position, // Camera's position in world coordinates
    camera.direction, // Direction the camera is facing
    camera.up // Up direction of the camera
  );

  const visiblePoints = points.filter((p) =>
    checkPointWithinView(p, cameraFrustumView)
  );

  return visiblePoints;
};
