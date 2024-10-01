import { BoundingSphere, Cartesian3, Color, Intersect } from 'cesium';
import { pick } from 'lodash';
import { formatPointCount } from './zoomUtils';
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

const BASE_DEGREE = 1_000_000; // Base value for transformation
const MIN_DEGREE = 10_000;
const SEC_DEGREE = 100;

/**
 * Converts a DMS (Degrees, Minutes, Seconds) format coordinate into decimal degrees.
 *
 * https://www.fhwa.dot.gov/bridge/mtguide.pdf
 * Item 17 - Longitude (XXX degrees XX minutes XX.XX seconds) 9 digits
 * The input is a number in the format DDD°MM'SS.SS'', where:
 * - The first three digits represent degrees (XXX degrees)
 * - The next two digits represent minutes (XX minutes)
 * - The last four digits represent seconds (XX.XX seconds, implied decimal)
 *
 * @param {number} dms - The coordinate in DMS format as a 9-digit number.
 * @returns {number} - The coordinate converted to decimal degrees.
 */
const DMSToDecimal = (dms) => {
  // Extract degrees, minutes, and seconds from the packed format
  const degrees = Math.floor(dms / BASE_DEGREE); // First 3 digits
  const minutes = Math.floor((dms % BASE_DEGREE) / MIN_DEGREE); // Next 2 digits
  const seconds = (dms % MIN_DEGREE) / SEC_DEGREE; // Last 4 digits, with implied decimal

  // Convert to decimal degrees
  const decimal = degrees + minutes / 60 + seconds / 3600;
  return decimal;
};


/**
 * Converts longitude and latitude in DMS format to decimal degrees and returns them as an array.
 *
 * The longitude is negated to transform it to a format suitable for use in mapping systems.
 *
 * @param {Object} coordinate - The coordinate object containing longitude and latitude in DMS format.
 * @param {number} coordinate.longitude - The longitude in DMS format as a 9-digit number.
 * @param {number} coordinate.latitude - The latitude in DMS format as a 9-digit number.
 * @returns {Array<number>} - An array with transformed [longitude, latitude] in decimal degrees.
 */
export const convertCoordinates = ({ longitude, latitude }) => {
  return [-DMSToDecimal(longitude), DMSToDecimal(latitude)];
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
 * Converts a numerical traffic value to a string representation with a 'k' suffix.
 *
 * @param {number} x - The numerical traffic value.
 * @returns {string} - The formatted string with a 'k' suffix.
 */
export const convertTraffic = (x) => `${x % 1000}k`; // Format traffic value

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

/**
 * Retrieves details about a specific bridge, returning an array of objects
 * containing label and value pairs for various bridge attributes.
 *
 * @param {Object} bridge - The bridge object containing data about the bridge.
 * @param {string} bridge.stateCode - The state code where the bridge is located.
 * @param {string} bridge.countyCode - The county code where the bridge is located.
 * @param {string} bridge.areaType - The area type (e.g., urban or rural).
 * @param {number} bridge.yearBuilt - The year the bridge was constructed.
 * @param {string} bridge.deckCondition - The condition of the bridge's deck.
 * @param {string} bridge.superstructureCondition - The condition of the bridge's superstructure.
 * @param {string} bridge.substructureCondition - The condition of the bridge's substructure.
 * @param {string} bridge.culvertCondition - The condition of the bridge's culvert.
 * @param {number} bridge.adt - The Average Daily Traffic (ADT) the bridge handles.
 * @param {number} [bridge.bridgeImpCost] - The estimated cost to improve the bridge.
 * @param {number} [bridge.roadwayImpCost] - The estimated cost to improve the roadway associated with the bridge.
 * @param {number} [bridge.totalImpCost] - The total improvement cost for both the bridge and roadway.
 *
 * @returns {Array<Object>} - An array of objects where each object contains
 *                            a `label` and `value` representing a piece of bridge information.
 *                            Returns an empty array if no bridge is provided.
 */
const getBridgeDetails = (bridge) =>
  bridge
    ? [
        { label: 'State Code', value: bridge.stateCode },
        { label: 'County Code', value: bridge.countyCode },
        { label: 'Area Type', value: bridge.areaType },
        { label: 'Year Built', value: bridge.yearBuilt },
        { label: 'Deck Condition', value: bridge.deckCondition },
        {
          label: 'Superstructure Condition',
          value: bridge.superstructureCondition,
        },
        {
          label: 'Substructure Condition',
          value: bridge.substructureCondition,
        },
        { label: 'Culvert Condition', value: bridge.culvertCondition },
        { label: 'ADT (Average Daily Traffic)', value: bridge.adt },
        {
          label: 'Bridge Improvement Cost',
          value: bridge.bridgeImpCost?.toLocaleString() || 'N/A',
        },
        {
          label: 'Roadway Improvement Cost',
          value: bridge.roadwayImpCost?.toLocaleString() || 'N/A',
        },
        {
          label: 'Total Improvement Cost',
          value: bridge.totalImpCost?.toLocaleString() || 'N/A',
        },
      ]
    : [];

/**
 * Generates a label for a map marker as a cluster of bridges.
 *
 * @param {number} pointCount - The number of points (bridges) in the cluster.
 * @returns {Object} - Returns an object with a text label, font size, and style for the cluster.
 *
 */
export const getLabel = (pointCount) => ({
  text: formatPointCount(pointCount), // Display formatted point count for clusters
  font: '10pt',
  style: { fillColor: Color.BLACK },
});

/**
 * Retrieves details about a cluster, returning an array of objects that
 * represent the label and value for the cluster's properties.
 *
 * @param {Object} cluster - The cluster object containing data about the bridges in the cluster.
 * @param {Object} cluster.properties - The properties of the cluster.
 * @param {number} cluster.properties.point_count - The number of bridges in the cluster.
 *
 * @returns {Array<Object>} - An array with a single object containing the label 'Cluster'
 *                            and the value representing the number of bridges in the cluster.
 */
const getClusterDetails = (cluster) => [
  { label: 'Cluster', value: `${cluster.properties.point_count} bridges` },
];

/**
 * Determines the appropriate details to display based on whether the entity
 * is a cluster of bridges or a single bridge. If it's a cluster, returns cluster
 * details. If it's a single bridge, returns bridge details.
 *
 * @param {Object} entity - A cluster or bridge.
 * @param {boolean} isCluster - A flag indicating whether the entity is a cluster.
 * @param {Object} cluster - The cluster object if `isCluster` is true (ignored if false).
 * @param {Object} bridge - The bridge object if `isCluster` is false (ignored if true).
 *
 * @returns {Array<Object>} - An array of detail objects for the entity, either cluster
 *                            details or bridge details, depending on the value of `isCluster`.
 */
export const getEntityDetails = ({ isCluster, cluster, bridge }) => {
  return isCluster ? getClusterDetails(cluster) : getBridgeDetails(bridge);
};
