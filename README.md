# Earth Information Jukebox

Explore a globe and listen to NASA night-lights imagery. The application opens on Earth, then offers a separate image-sonification panel. Choose 2012 or 2023 and press **Play**. Relative image brightness controls notes and voice gain. Horizontal image position controls stereo panorama. A highlighted region and text reading follow playback.

[Demo presentation](docs/demo/earth-jukebox-demo.pptx) · [Submission text](docs/brain/submission-draft-en.md) · [AI assistance](AI_USAGE.md)

## Run locally

Use Node.js 22 and a compatible npm version. Chrome is required for the Angular tests.

```powershell
npm ci --ignore-scripts --no-audit --no-fund
npm start -- --host 127.0.0.1
```

Open `http://127.0.0.1:4200`. No audio starts automatically. Installation lifecycle scripts stay disabled. Dependencies retain their existing lockfile and known advisories; no security certification is implied.

## Build and verify

```powershell
$env:NG_CLI_ANALYTICS = 'false'
$env:NG_BUILD_MAX_WORKERS = '1'
npm run build
npm test -- --watch=false --browsers=ChromeHeadless
node --test tests/amber-earth.test.mjs
node tests/production-smoke.mjs
```

Run the compiled server with `node dist/the-earth-information-jukebox/server/server.mjs` and open `http://127.0.0.1:4000`. The server binds to loopback by default. `PORT` and `HOST` allow explicit configuration. Public deployment requires a separate hosting/security review.

## Controls and access

The first keyboard link skips to the sound panel. Globe destinations, direction buttons and canvas arrow keys select a point; plus/minus change zoom and Home resets the view. Reduced motion disables automatic rotation. The sound panel provides Play/Pause, Restart, Mute, Volume, Speed and Spatial position. The text reading can be used without sound. Source, formulas and limitations appear under **Method, credits and limitations**.

## Data and interpretation

The two annual images derive from [NASA SVS 5276](https://svs.gsfc.nasa.gov/5276/), the original visualization linked by its [EIC version, SVS 5313](https://svs.gsfc.nasa.gov/5313/). The [manifest](public/data/night-lights/manifest.json) records exact resources, hashes, transformation and credits. The globe uses [Natural Earth geography](src/app/view/screen-components/planet-earth/CREDITS.md).

The sound represents RGB image brightness without calibrated radiance. Black pixels may have several meanings. Progress is a spatial scan through one annual image. Globe coordinates do not control the audio because a geographic transform has not been validated. NASA's Scientific Visualization Studio and its contributors retain the credits listed in the manifest. No NASA endorsement is implied.

## Delivery status

The release interface and public metadata are in English. The demo is an editable draft because the user requested that team name, members and event remain pending. Human listening, screen-reader testing and mobile-device acceptance still require confirmation. No official submission has been performed. [Project metadata](public/project-metadata.json) records AI assistance and the remaining limitations.
