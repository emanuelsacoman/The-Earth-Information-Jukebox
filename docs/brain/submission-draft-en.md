# Earth Information Jukebox — submission draft

Draft for team review, prepared with AI assistance. Do not submit before confirming team details, public links, final language coverage and the acceptance checks in [the finalization plan](finalization-plan.md). This file is not proof of eligibility, submission or human listening.

## Project name

Earth Information Jukebox — Amber Observatory

## High-level project summary

Our web application pairs NASA night-lights imagery with sound synthesized from the image itself. Users choose an annual image, start a spatial scan and follow the highlighted region and its textual reading. Relative brightness controls a reproducible musical mapping. A freely explorable globe introduces the Earth experience, while the scientific image and its sound remain explicitly linked in a separate panel. The project explores another way to experience visual Earth information without presenting pixel brightness as a calibrated physical measurement.

## Final project and demo links

- Final project: [public brain repository](https://github.com/emanuelsacoman/The-Earth-Information-Jukebox/tree/brain), with local run instructions in the English README. No hosted app deployment is claimed.
- Demo: [six-slide English presentation](../demo/earth-jukebox-demo.pptx), prepared as an editable draft. Team identification remains intentionally pending; confirm it before official use.
- Team name and members: **PENDING — use only confirmed team information.**

All submission fields and linked materials require English according to the guide. The release interface, README, metadata, source manifest and demo are in English. Historical engineering notes also include Portuguese. The team must review the materials it actually links. A Portuguese spoken video demo requires English subtitles.

## Detailed project description

Two annual night-lights images, 2012 and 2023, are curated from NASA SVS 5276, the original visualization linked by its EIC version, SVS 5313. The local images include provenance, transformation details, credit and integrity hashes. The loader verifies the image before decoding its pixels.

The application divides the accepted image into 24 columns and eight rows and scans top-to-bottom within each column. Mean encoded RGB brightness selects one of 16 notes in a C-major pentatonic scale and controls voice gain. Horizontal position controls stereo panorama. The Web Audio API synthesizes the result at runtime, with playback, pause, mute, volume, speed and spatial position controls. A marker and textual reading identify the current region. The displayed progress represents movement through one selected image, not progression through observation years.

The printed year is excluded from extraction. Black pixels can mean several things and are not labeled as measured zero radiance. Resizing and image processing affect the representation. The globe uses separate Natural Earth geography; selecting a latitude/longitude does not generate scientific sound because the image-to-geography transform has not been validated.

The implementation uses Angular, TypeScript, Canvas2D and the Web Audio API. Its potential benefit is a reproducible way to connect visible image patterns, musical choices and descriptive text. Actual accessibility and listening benefits still require user validation; they are not claimed as demonstrated outcomes.

## NASA data and references

- [Night Lights — EIC version, SVS 5313](https://svs.gsfc.nasa.gov/5313/).
- [Original visualization and annual imagery, SVS 5276](https://svs.gsfc.nasa.gov/5276/).
- [Local scientific manifest with exact source URLs and credits](../../public/data/night-lights/manifest.json).
- [Natural Earth and implementation credits](../../src/app/view/screen-components/planet-earth/CREDITS.md).
- [AI use disclosure](../../AI_USAGE.md) and [machine-readable metadata](../../public/project-metadata.json).

Credit: NASA's Scientific Visualization Studio. Full visualizer, scientist and Black Marble/VIIRS dataset attribution is preserved in the manifest and application. No NASA endorsement is implied.

## AI / SI use

AI assisted with design exploration, code, debugging, tests, review and documentation, including this draft. The runtime sound is deterministic synthesis implemented with AI assistance; it is not a generative-model soundtrack. NASA imagery is sourced and conventionally resized, without invented observations. The team must confirm the full contribution history and the origin of its solution idea before answering the official AI/SI field. See the disclosure above rather than claiming exclusively human ideation.

## Demo script — target 28–30 seconds

Use the actual application on screen, including a brief sample of its real output. Do not replace it with an unrelated soundtrack. Confirm the final recorded duration and supply English subtitles if speech is in another language.

> We are [team name]. Our Earth Jukebox lets people explore NASA imagery through sight, text and sound. Choose a night-lights image and press Play. Each highlighted region produces notes from its relative brightness, using clear musical rules. The reading and source stay visible. Our globe adds free exploration. This is image sonification, not calibrated radiance. We aim to make Earth information easier to explore through multiple senses.

The bracketed team name must be replaced with confirmed information before recording. Human listening, assistive checks, public-link checks and final language review are still pending.
