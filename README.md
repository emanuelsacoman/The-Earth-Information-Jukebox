# TheEarthInformationJukebox

Na `brain`, a experiência reúne o Observatório Âmbar e a sonificação de imagens NASA de luzes noturnas. A página abre no planeta; o painel de som está abaixo, acessível pelo link **Ouvir dados NASA**. Escolha 2012 ou 2023 e pressione **Reproduzir**: o som descreve o brilho das regiões da imagem 2D. A seleção no globo continua independente, sem associação geográfica inventada. Veja [o que falta para fechar a entrega frente ao desafio NASA](docs/brain/nasa-readiness.md).

## MVP — Observatório Âmbar

A branch `luiz` contém o MVP de exploração livre do planeta: rotação, zoom, seleção geográfica, destinos e teclado, sem camadas científicas ou áudio. O dashboard anterior foi preservado no código; a tela inicial desta entrega monta o mundo. Veja [implementação, validação e limites](docs/observatorio-ambar-mvp.md).

Validação executada com Node **22.23.5** e npm **10.9.9**, sem alteração do runtime global. Instalação do lockfile com scripts de instalação desativados:

```powershell
npm ci --ignore-scripts
$env:NG_CLI_ANALYTICS = 'false'
$env:NG_BUILD_MAX_WORKERS = '1'
npm run build
npm test -- --watch=false --browsers=ChromeHeadless
node --test tests/amber-earth.test.mjs
node tests/production-smoke.mjs
```

O teste Karma precisa de Chrome instalado. Para executar o resultado compilado:

```powershell
npm run serve:ssr:The-Earth-Information-Jukebox
```

O endereço padrão é `http://127.0.0.1:4000`. `PORT` define a porta e `HOST` permite configurar a interface explicitamente. As dependências preexistentes têm alertas conhecidos e avisos de engines/depreciação; este MVP não inicializa Firebase/Auth, e validação local não significa aprovação de deploy público. Não use `npm audit fix --force` automaticamente.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.21.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
