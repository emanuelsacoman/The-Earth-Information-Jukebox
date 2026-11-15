import { ScientificRecord } from './sonification.types';

const sourceDirectory = 'https://svs.gsfc.nasa.gov/vis/a000000/a005200/a005276/frames/7680x4320_16x9_3p/nightlights_flat_2012-2023_only_lights/';

/** Curated derivatives of two explicitly dated annual NASA SVS images; no inferred georeference. */
export const SCIENTIFIC_RECORDS: readonly ScientificRecord[] = [{
  id: 'nasa-svs-5276-night-lights',
  schemaVersion: 1,
  title: 'Luzes noturnas — NASA Black Marble',
  description: 'Duas médias anuais, 2012 e 2023, da visualização SVS 5276 relacionada à versão EIC 5313. A varredura percorre a imagem; não representa passagem do tempo.',
  originUrl: 'https://svs.gsfc.nasa.gov/5276/',
  credits: 'NASA\'s Scientific Visualization Studio. Visualização: Kel Elkins (USRA). Black Marble: NASA Earth Observatory/Joshua Stevens, dados Suomi NPP VIIRS de Miguel Román, NASA GSFC. Cientistas: Zhuosen Wang, Miguel Román, Ranjay Shrestha, Srija Chakraborty e Virginia Kalb.',
  usageUrl: 'https://www.nasa.gov/nasa-brand-center/images-and-media/',
  limitations: 'O som descreve brilho relativo dos pixels RGB, sem unidade física ou calibração de radiância. Preto pode ser fundo, pouca luz ou ausência de informação; não é uma medição de zero. O ano impresso é mascarado na extração. Redução de resolução e de profundidade de cor altera o brilho da representação. A projeção e a transformação geográfica não foram verificadas: a seleção no globo não controla este som.',
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
