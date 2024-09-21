import { Cartesian3 } from 'cesium';

const MAX_ZOOM_LEVEL = 16; // Max zoom level (similar to Google Maps)
const BASE_ZOOM_AMOUNT = 100; // Base zoom amount for calculations

// Function to calculate zoom amount based on zoom level
export const calculateZoomAmount = (currentZoomLevel) => {
  // Ensure currentZoomLevel is within bounds
  if (typeof currentZoomLevel !== 'number' || currentZoomLevel < 0) {
    throw new Error('Invalid zoom level. Must be a non-negative number.');
  }

  // Generate zoom amounts for each zoom level
  const zoomAmounts = Array.from(
    { length: MAX_ZOOM_LEVEL + 1 }, // Include level 16
    (_, i) => BASE_ZOOM_AMOUNT * Math.pow(2, MAX_ZOOM_LEVEL - i + 1)
  );

  // Return the zoom amount corresponding to the current zoom level
  return zoomAmounts[Math.min(currentZoomLevel, MAX_ZOOM_LEVEL)];
};

// Function to calculate height from zoom level
export const calculateHeightFromZoomLevel = (zoomLevel) => {
  const minHeight = 1000;
  const maxHeight = 20000000;

  // Calculate height based on zoom level
  const height =
    minHeight *
    Math.pow(
      maxHeight / minHeight,
      (MAX_ZOOM_LEVEL - zoomLevel) / MAX_ZOOM_LEVEL
    );

  return height;
};

export const calculateZoomLevel = (height) => {
  const minHeight = 1000; // Corresponds to highest zoom level (close to ground)
  const maxHeight = 20000000; // Corresponds to lowest zoom level (far from earth)

  // Clamp height between minHeight and maxHeight
  height = Math.max(minHeight, Math.min(maxHeight, height));

  // Convert height to zoom level
  const level =
    MAX_ZOOM_LEVEL -
    (Math.log(height / minHeight) / Math.log(maxHeight / minHeight)) *
      MAX_ZOOM_LEVEL;

  return Math.round(level);
};

// Helper function to calculate the standardized size
export const calculateClusterSize = (pointCount) => {
  const minSize = 10; // Minimum size for small clusters
  const maxSize = 50; // Maximum size cap

  // Use a logarithmic scale to differentiate between sizes
  const logCount = Math.log10(pointCount); // Log base 10 of the cluster size
  const normalizedSize = Math.max(minSize, Math.min(maxSize, logCount * 10));

  return normalizedSize;
};

// Helper function to format the pointCount
export const formatPointCount = (count) => {
  if (count >= 1_000_000) {
    return `${(count / 1_000_000).toFixed(0)}M`; // Display millions as XM
  } else if (count >= 1_000) {
    return `${(count / 1_000).toFixed(0)}K`; // Display thousands as XK
  } else {
    return count.toString(); // Display the exact number for smaller values
  }
};

// Helper function to convert latitude and longitude to Cartesian3
export const toCartesian3 = (lat, lng) => {
  return Cartesian3.fromDegrees(lng, lat);
};
