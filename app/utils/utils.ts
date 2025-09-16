// Prefer generated map (created by scripts/generate-image-map.js). This avoids
// webpack-specific APIs and works with Metro bundler for React Native.
let generated: {
  imageMap?: Record<string, any>;
  getImage?: (s?: string) => any;
} = {};
try {
  generated = require("./generatedImageMap");
} catch (e) {
  // If the generated file is missing, the consumer can run the generator:
  // node ./scripts/generate-image-map.js
  console.warn("generatedImageMap not found, images may be missing", e);
}

export const imageMap: Record<string, any> = generated.imageMap || {};
export const getImage =
  generated.getImage ||
  ((f?: string) => (f ? imageMap[f.toLowerCase()] : undefined));
