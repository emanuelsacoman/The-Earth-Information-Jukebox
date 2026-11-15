import { ScientificRecord } from './sonification.types';

const sourceDirectory = 'https://svs.gsfc.nasa.gov/vis/a000000/a005200/a005276/frames/7680x4320_16x9_3p/nightlights_flat_2012-2023_only_lights/';

/** Curated derivatives of two explicitly dated annual NASA SVS images; no inferred georeference. */
export const SCIENTIFIC_RECORDS: readonly ScientificRecord[] = [{
  id: 'nasa-svs-5276-night-lights',
  schemaVersion: 1,
  title: 'Night lights — NASA Black Marble',
  description: 'Annual night-lights imagery for 2012 and 2023 from NASA SVS 5276, the original visualization linked by EIC version 5313. Playback scans a single image spatially.',
  originUrl: 'https://svs.gsfc.nasa.gov/5276/',
  credits: 'NASA\'s Scientific Visualization Studio. Visualizer: Kel Elkins (USRA). Black Marble: NASA Earth Observatory/Joshua Stevens, Suomi NPP VIIRS data from Miguel Román, NASA GSFC. Scientists: Zhuosen Wang, Miguel Román, Ranjay Shrestha, Srija Chakraborty and Virginia Kalb.',
  usageUrl: 'https://www.nasa.gov/nasa-brand-center/images-and-media/',
  limitations: 'Sound describes relative RGB pixel brightness without physical units or radiance calibration. Black may represent background, low brightness or unavailable information. The printed year is masked. Resizing and color-depth conversion affect the image. A geographic transform has not been validated, so globe selection does not control this sound.',
  frames: [{
    id: 'night-lights-2012',
    recordId: 'nasa-svs-5276-night-lights',
    order: 0,
    observationYear: 2012,
    resourceUrl: '/data/night-lights/night-lights-2012.png',
    sourceUrl: sourceDirectory + 'nightlights_flat_series_stills_8k_only_lights.2012.tif',
    width: 2048,
    height: 1152,
    sha256: 'c44f5063679801ef1be704d76258558dad8078a0b273f87118d3d923f6cd5701',
    roi: { x: 0, y: 0, width: 2048, height: 1152 },
    excludedRegions: [{ x: 870, y: 680, width: 150, height: 80 }]
  }, {
    id: 'night-lights-2023',
    recordId: 'nasa-svs-5276-night-lights',
    order: 1,
    observationYear: 2023,
    resourceUrl: '/data/night-lights/night-lights-2023.png',
    sourceUrl: sourceDirectory + 'nightlights_flat_series_stills_8k_only_lights.2023.tif',
    width: 2048,
    height: 1152,
    sha256: 'e189d5822db9515e1c4d6bc3c901fc45e2785f0243800b468342e0086aefc731',
    roi: { x: 0, y: 0, width: 2048, height: 1152 },
    excludedRegions: [{ x: 870, y: 680, width: 150, height: 80 }]
  }]
}];
