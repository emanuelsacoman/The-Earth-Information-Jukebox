# Estado atual

## Demo atualizada — 15/11/2026

A [apresentação editável](../demo/earth-jukebox-demo.pptx) mantém seis slides em inglês e agora representa o observatório de tela única com a camada geográfica NASA 2012, player integrado, painel científico recolhível e capturas desktop/mobile atuais. Explicita a independência do ano da camada e das imagens sonoras 2012/2023. Textos/fontes Arial e identidade grafite/âmbar preservados; fontes e limitações atualizadas nas notas. Renderização pelo PowerPoint 16.0, inspeção dos seis slides, estrutura/relacionamentos, dimensões e encaixe de texto aprovados. Identificação da equipe, escuta/aceite assistivo e submissão oficial continuam pendentes.

## Globo NASA e tipografia — 15/11/2026

Na mesma branch local `feat/single-screen-observatory`/base `2c424b0`, a camada visual **NASA Black Marble 2012** está IMPLEMENTED no Canvas2D existente, com georreferenciamento próprio EPSG:4326 conferido no GeoTIFF, PNG local de 215.356 bytes, SHA-256, amostragem bilinear, rotação/zoom, toggle e fallback. Ela é independente dos recursos de sonificação 2012/2023, que permanecem sem alterações. Isso não encerra a limitação geográfica dos PNGs de áudio. Tipografia ativa ampliada com tokens system-ui, pesos 500–700 e reflow preservado, sem fonte externa obrigatória. [Relatório, fonte e evidências](night-lights-globe-delivery.md).

Build/SSR, **79 Angular**, **11 Node**, smoke de produção, smoke do globo e smoke de áudio aprovados. Perfil desktop: ~30 fps com/sem camada, p95 da superfície 14,8→20,0 ms; uma requisição/decode e crescimento retido de 14.392 bytes após 40 alternâncias. Sinal de áudio, um contexto, cancelamento e cinco larguras conferidos. Zoom nativo, leitor de tela, dispositivo físico e escuta humana continuam UNKNOWN/PENDENTES; não há conformidade assistiva integral declarada. Sem commit/push/merge/deploy, favicon e entrega anterior preservados.

## Tela única — implementação atual em 15/11/2026

Branch **`feat/single-screen-observatory`**, alterações locais sobre **`2c424b0474c7c96589d02d3db5e21a922aee258c`** da `brain`. A tarefa atual autoriza a implementação integrada; as seções seguintes preservam snapshots anteriores. Registro de entrega e resultados finais em [single-screen-delivery](single-screen-delivery.md); decisão científica em [single-screen-science](single-screen-science.md).

| Capacidade atual | Classificação e evidência disponível |
|---|---|
| Composição em uma experiência | IMPLEMENTED: Index reúne topo discreto, globo Canvas2D, painel científico contextual e player na base. A antiga seção inferior deixou de existir; nenhum componente foi excluído. |
| Imagem e leitura NASA | IMPLEMENTED: AudioPanel reaproveitado, imagem real 2012/2023, célula e leitura da revisão aceita pelo coordenador, fonte/legenda/créditos acessíveis. Estratégia B; seleção do globo não determina a nota. |
| Controles de áudio | IMPLEMENTED: Play/Pause, Restart, Mute, volume, velocidade e seek usam o PlaybackCoordinator existente. Play revela a ciência; abrir/recolher o painel não desmonta o player nem reinicia a posição. Escuta humana continua PENDENTE. |
| Exploração geográfica | IMPLEMENTED: mesmo renderer e GlobeModel; mudanças de composição DOM/CSS preservam rotação, zoom, seleção, destinos, teclado, movimento reduzido e fallback. |
| Layout e foco | IMPLEMENTED na interface: painel lateral a partir de 1000 CSS px e drawer abaixo desse limite, player acessível, painéis com rolagem interna e reflow em alturas pequenas. CTA/skip link levam ao painel; About abre método/créditos; Close/Escape retornam ao CTA. Globo fica inert sob o drawer aberto, com listener de breakpoint removido no teardown. Validação assistiva integral UNKNOWN. |
| Build e regressão automatizada | APROVADOS na árvore final: build/SSR de uma rota, 78 Angular repetidos após foco/inert/CSS, 8 Node, smoke de produção e smoke de navegador. G-SYNC automatizado aprovado em amostra de 60,199 s e 274 leituras, com atraso máximo de 25,67 ms. |

O estado sonoro continua somente no PlaybackCoordinator; o estado geográfico continua no GlobeModel. Motor, catálogo, loader, extrator/mapper, PNGs, manifesto, núcleo/projeção do renderer, Firebase, package e lock permanecem sem alterações. Dashboard legado continua fora da aplicação; somente seu spec foi alinhado à API pt-BR já presente na base, mantendo dez testes e 19 expectativas.

As verificações finais incluem cinco larguras 320/390/768/1280/1920 CSS px, estados aberto/fechado/em reprodução, erro/loading e recuperação, fallback, arrasto, movimento reduzido, Shift+Tab com inert e reflow emulado 640×450 com ajustes/barra alcançáveis. A altura do documento e a base do player permaneceram em 900 px na matriz de cinco larguras. Capturas CDP reais foram inspecionadas; [relatório automatizado](evidence/single-screen-2026-11-15/report.json) e capturas estão versionáveis junto à entrega. CUA não pôde conectar ao navegador neste ambiente. Escuta humana, leitor de tela, zoom nativo de 200% e dispositivo físico permanecem pendentes. A tarefa **F4-05 permanece IN_PROGRESS** por esses aceites e revisão humana. Sem commit, push, PR, merge ou deploy; o favicon humano concorrente foi preservado fora do escopo.

## Release atual — 15/11/2026

`brain` sobre `6581f24`: interface ativa e manifesto em inglês, composição Observatório enxuta, skip link, controles legíveis e detalhes científicos recolhidos. Instalação isolada, development/production, SSR, 75/75 Angular e 8/8 Node aprovados. Demo de seis slides validada. Algoritmos, identidades dos recursos e package/lock preservados; apenas textos mudaram no núcleo. Aceites humanos e identidade da equipe pendentes. Evidências completas em [handoff](handoff.md).

## Sonificação em 64659fba — histórico de 15/11/2026

Referência atual: `feat/f3-sonification`, alterações locais sobre `brain`/`64659fba8e45fd6f635df909e69923588db92d44`. Árvore inicialmente limpa; sem commit/push/merge/deploy nesta sessão. O PR #6 já havia integrado o Observatório Âmbar e correções de boot/SSR. O Dashboard legado permanece desmontado. O relato anterior abaixo é histórico e não descreve o código presente.

| Capacidade atual | Classificação / evidência |
|---|---|
| Globo Canvas2D, rotação/zoom/teclado e saída Angular | IMPLEMENTED; entrega já integrada em 64659fb, módulos preservados; 8 testes Node e specs Angular passam |
| Fonte NASA | IMPLEMENTED para dois derivados curados de 2012/2023 da SVS 5276, relacionada à versão EIC 5313; manifesto/hash/créditos e loader real em Canvas2D |
| Extração e mapeamento | IMPLEMENTED; grade 24×8, brilho de RGB codificado, máscara do ano, pentatônica determinística e 11 testes; sem unidade física calibrada |
| Motor Web Audio | IMPLEMENTED com 20 testes de scheduling, ganho, suspensão, cancelamento e liberação; escuta humana PENDENTE |
| Transporte e sincronização | IMPLEMENTED no desktop automatizado; coordenador único e revisão, pausa/retomada/seek/velocidade; 60,616 s de amostra, máximo 25,67 ms de atraso textual. Escuta humana e validação em aparelho real pendentes |
| Interface utilizável | IMPLEMENTED no AudioPanel montado pelo Index, imagem real, controles sem autoplay, fonte/legenda/erro; acessibilidade assistiva ainda UNKNOWN |
| Integração geográfica científica | Indisponível explicitamente; pointSelected recebido, sem converter lat/lon em pixels ou sons |
| Build/SSR/testes | 74 testes Angular e 8 Node aprovados; build sem erros de prerender. Reprodução limpa isolada não repetida |

Arquivos, fórmulas, comandos, resultados completos, limites e roteiro auditivo em [entrega de sonificação](sonification-delivery.md). G-AUDIO/G-A11Y completos não são aprovados por mocks, estado ou sinal digital. O MVP completo permanece pendente.

## Auditoria F0 preservada

## Leitura do registro documental anterior — histórico

A auditoria abaixo é histórica, referente ao código `aab5471`. A documentação inicial foi publicada em `brain` no commit `6fbc52fe7a577d779315ba6e972d66350efc91df`. A revisão documental parte desse commit: o diff de aplicação, configuração e dependências contra `aab5471` continua vazio. Portanto, os hooks TODO e o placeholder de PlanetEarth ainda descrevem o código da `brain`.

O mundo recebeu implementação em outra branch: veja [entrega do mundo](world-delivery.md), com referência fixa a `53b577e`. Seus resultados de build, testes e navegador pertencem àquela entrega; não aprovam os gates desta branch. Nenhum build ou teste Angular foi repetido para a presente alteração exclusivamente documental. Estado de continuidade em [handoff](handoff.md).

## Referência e método

- Inspeção em **15/11/2026**, contexto de datas `America/Sao_Paulo`.
- Branch **`brain`**, HEAD **`aab547114375c7232807d31dbaa726c6fec0b1a2`** (merge do PR #3). `git status --short --branch`, `git diff` e `git diff --cached` inicialmente limpos.
- Os 40 arquivos versionados de aplicação/configuração coincidem com HEAD. Existem arquivos locais ignorados, inclusive `src/environments/environment.ts`, `src/environments/environment.development.ts`, `node_modules` e cache `.angular`; isso não equivale a um clone limpo reproduzível.
- Auditoria por leitura de código, templates, CSS, specs, configurações, lockfile, assets e histórico local; build e testes existentes executados conforme abaixo. Não houve teste manual da experiência em navegador nem auditoria assistiva.
- Sem `fetch`, checkout, alteração de branch, commit, push, PR, merge ou deploy. Referências `origin/*` são snapshots locais; ver [fluxo de equipe](team-workflow.md).

As classificações funcionais são: **IMPLEMENTED** (comportamento real evidenciado, com nível de verificação indicado), **PARTIAL** (parte real com lacunas), **MOCK** (simulado), **TODO** (ausente), **BLOCKED** (dependência identificada impede avanço) e **UNKNOWN** (não verificado). Não são os estados de tarefas do roadmap.

## Inventário técnico

```text
src/
  main.ts / main.server.ts / index.html / styles.css
  robots.txt / sitemap.xml
  environments/                         # local, ignorado, não versionado
  app/
    app.component.* / app.routes.ts
    app.config.ts / app.config.server.ts
    view/index/index.component.*
    view/screen-components/dashboard/dashboard.component.*
    view/screen-components/planet-earth/planet-earth.component.*
public/favicon.ico                      # único asset versionado em public
server.ts                               # Express + CommonEngine
angular.json / firebase.json / tsconfig*.json
package.json / package-lock.json / .editorconfig / .gitignore / .vscode/
```

Não há serviços de domínio, modelos compartilhados, pipeline científico, workflows `.github` ou ferramenta E2E versionados (`git ls-files`). Não há `AGENTS.md`/`docs/brain` preexistentes; foram adicionados em F0.

| Área | Estado observado e evidência |
|---|---|
| Angular | Standalone; `AppComponent` importa Index (`src/app/app.component.ts:5`); template monta `<app-index>`. Index reúne Dashboard e PlanetEarth como irmãos (`src/app/view/index/index.component.html:4`). |
| Navegação | `src/app/app.routes.ts:3` tem rotas vazias; painéis são alternados por estado no Dashboard, sem rotas por seção. |
| Dashboard | Concentra tipos locais, catálogo, navegação, controles, preferências, sharing e hooks TODO em 684 linhas. Records/Sound/Listening/Globe/Accessibility/About são painéis do mesmo componente, não seis componentes separados. |
| PlanetEarth | Classe vazia (`src/app/view/screen-components/planet-earth/planet-earth.component.ts:10`); HTML apenas `planet-earth works!`. |
| TypeScript | Strict, strictTemplates, noImplicitReturns e outras verificações configuradas em `tsconfig.json:7` e `:29`. Bootstrap browser/server e Express incluídos em `tsconfig.app.json`. |
| SSR | `angular.json:35` habilita server, prerender e `server.ts`; configuração do servidor mescla providers comuns, inclusive Firebase (`src/app/app.config.server.ts:11`). Configurado, com erro real observado. |
| Firebase | Providers App/Auth em `src/app/app.config.ts:5` e `:13`; não foram encontrados consumidores de autenticação ou banco na aplicação. |

### Dependências e scripts

`package.json:13` declara Angular 18.2, AngularFire 18, Firebase 13.3, Express 4, RxJS 7.8, Zone 0.14; desenvolvimento usa CLI/build-angular 18.2, TypeScript 5.5, Jasmine e Karma. O lockfile resolve `@angular/core` **18.2.14**, CLI/SSR **18.2.21**, AngularFire **18.0.1**, Firebase direto **13.3.0** e aninhado no AngularFire **10.14.1**, TypeScript **5.5.4**, Express **4.22.3**. Duplicação Firebase é confirmada; incompatibilidade de produto não foi demonstrada.

| Script existente (`package.json:4`) | Comportamento |
|---|---|
| `npm start` | `ng serve` (development por padrão) |
| `npm run build` | `ng build` (production por padrão) |
| `npm run watch` | Build development em watch |
| `npm test` | `ng test` (Karma) |
| `npm run serve:ssr:The-Earth-Information-Jukebox` | Executa `dist/the-earth-information-jukebox/server/server.mjs` |

Não há scripts lint/E2E. README preexistente é o scaffold CLI; a menção genérica a E2E não comprova ferramenta configurada.

## Matriz funcional

Nos caminhos abreviados abaixo, `dashboard.*` pertence a `src/app/view/screen-components/dashboard/`.

| Capacidade | Estado | Evidência e limite |
|---|---|---|
| Composição standalone e navegação de painéis | IMPLEMENTED | App/Index montam os componentes; `dashboard.component.ts:302` abre/fecha seções; casos de estado passaram na suíte. |
| Catálogo NASA/EIC | MOCK | `dashboard.component.ts:117` declara amostras; `:121–155` contém períodos/descrições/legendas placeholders e 100 frames por registro sem recursos associados. |
| Seleção/anterior/próximo | PARTIAL | Muda seleção e reseta índice em `dashboard.component.ts:338`; `loadFrame` chamado está vazio. |
| Carregamento de catálogo/frames | TODO | `dashboard.component.ts:601` e `:611`: apenas comentários TODO. `/api/records` é exemplo em comentário, não API existente. |
| Extração e mapeamento visual-sonoro | TODO | Legenda genérica em `dashboard.component.ts:210`; nenhuma leitura de pixels ou transformação funcional encontrada em `src`. |
| Áudio real / Play / Pause | TODO | `dashboard.component.ts:364` alterna booleano; `startAudio`, `pauseAudio`, `applySoundSettings` vazios em `:623–638`. Teste do booleano não comprova som. |
| Presets/escala/volume/velocidade/modo | PARTIAL | Atualizam estado local (`dashboard.component.ts:375–420`); não afetam áudio real. |
| Visualizador | MOCK | Barras decorativas (`dashboard.component.ts:207`), animação CSS `pulse` (`dashboard.component.css:658`); não há AnalyserNode. Template `:188` afirma que seguem o som, sem evidência. |
| Leitura científica atual | TODO | `reading` inicia com `?` em `dashboard.component.ts:202`; `receiveReading(:646)` não possui produtor no código. |
| Timeline/data | PARTIAL | `setFrame(:427)` muda índice; `frameDate(:232)` é placeholder; sem frame visual ou relógio associado. |
| Sequência automática | TODO | `toggleSequence(:356)` muda somente flag. |
| Globo/zoom/rotação | TODO | PlanetEarth vazio; placeholder no Dashboard HTML `:45`; handlers de globo vazios em TS `:657–674`. |
| Comunicação Dashboard–PlanetEarth | TODO | Irmãos sem inputs/outputs ou estado compartilhado (`index.component.html:4`). |
| Explore | PARTIAL | Cursor e limites geográficos em `dashboard.component.ts:454`; `explorePoint(:681)` vazio; sem ligação mouse/touch/dado ou georreferência comprovada. |
| Estrutura de acessibilidade | PARTIAL | Botões/labels/switches e aria-live (HTML `:8`), foco inicial (TS `:290`), contraste/texto/movimento/foco em CSS `:53–88`, `:152`. Sem teste assistivo manual. |
| Atalhos | PARTIAL | `dashboard.component.ts:486` protege campos/botões/links e modificadores; não contempla contenteditable; Escape ocorre antes da guarda de campos. |
| Preferências locais | IMPLEMENTED | `dashboard.component.ts:521–537` usa localStorage com catch; teste de alternância passou. Schema persistido não é validado; persistência entre sessões não foi testada manualmente. |
| Vibração | PARTIAL | API guardada em `dashboard.component.ts:480`; depende de leitura/peak, hoje sem produtor. |
| Compartilhamento | PARTIAL | URL/clipboard/restauração em `dashboard.component.ts:544–582`, fallback de cópia manual; sem teste de clipboard em navegador. Acesso a window quebra SSR. |
| Responsividade | PARTIAL | CSS tem breakpoint ≤900px (`dashboard.component.css:924`); ainda sem teste visual/reflow. |
| Instalação limpa | UNKNOWN | Não executada; node_modules e environments locais já existiam. |
| SSR/prerender saudável | BLOCKED | Erro `window is not defined` observado no build; cadeia `ngOnInit → readSettingsFromUrl` (`dashboard.component.ts:284`, `:566`). |
| Deploy/CI | PARTIAL / TODO | `firebase.json` só contém rewrites no topo; `.firebaserc`/workflows ausentes. Nenhum link publicado verificado. |
| Rulesets GitHub | UNKNOWN | Apenas histórico/refs locais consultados; proteção técnica não inspecionada no servidor. |

## Verificações realizadas

1. **Git/inventário:** `git status --short --branch`, `git rev-parse HEAD`, `git branch -avv`, `git log -8 --oneline --decorate`, `git ls-files`, `git diff` e `git diff --cached`; leitura dos 40 arquivos versionados e configurações locais relevantes. Valores de configuração Firebase não foram publicados.
2. **Runtime padrão:** `node --version`, `npm --version`, `npm run build` e `npm test -- --watch=false --browsers=ChromeHeadless` pararam com código 1 no shim NVM: `No active Node.js version is configured`. Sem instalação ou mudança global de NVM.
3. **Runtime alternativo existente:** Node **v20.20.0** localizado em `C:\Users\Emanuel\AppData\Local\Author Software\nvm\installs\v20.20.0`. Ajuste de PATH apenas no processo. A tentativa restrita encontrou `EPERM` de lstat; execução autorizada fora do sandbox permitiu os checks abaixo, sem editar configurações.
4. **Build production:** CLI local `ng build` gerou bundles, **exit 0**, em cerca de 8,6 s. Browser inicial **386,42 kB** raw / **102,31 kB** estimados de transferência. Saída diz uma rota prerenderizada, mas também registra **`ReferenceError: window is not defined`** em `readSettingsFromUrl`, repetido durante prerender. Aviso CommonJS de `undici` via Firebase/Auth. **Build gera artefatos, mas G-BUILD não aprovado; exit 0 sozinho é insuficiente.** HTML prerenderizado não foi validado visualmente.
5. **Testes:** CLI local `ng test --watch=false --browsers=ChromeHeadless`, Karma **6.4.4**, Chrome Headless **157.0.0.0**. **15 executados, 14 passaram, 1 falhou, exit 1.** `src/app/app.component.spec.ts:27` espera `Hello, The-Earth-Information-Jukebox`, mas h1 é `Global temperature`. Nenhuma correção executada em F0.

Comandos usados para contornar somente o shim da sessão (PowerShell, caminho específico desta máquina):

```powershell
$taskNodeDir = 'C:\Users\Emanuel\AppData\Local\Author Software\nvm\installs\v20.20.0'
$env:PATH = "$taskNodeDir;" + $env:PATH
$env:NG_CLI_ANALYTICS = 'false'
& "$taskNodeDir\node.exe" '.\node_modules\@angular\cli\bin\ng.js' build
& "$taskNodeDir\node.exe" '.\node_modules\@angular\cli\bin\ng.js' test --watch=false --browsers=ChromeHeadless
```

Essa execução usa os environments ignorados já presentes e **não aprova reprodução em clone limpo**. `dist` e caches são saídas locais ignoradas. Os testes do Dashboard cobrem estado/ações diretas; Index e PlanetEarth somente criação. Não há prova de áudio, ciência, sincronização ou acessibilidade ponta a ponta.

## Lacunas e incertezas que orientam a próxima fase

- **Ambientes:** `git ls-files src/environments` vazio; `.gitignore:36` ignora a pasta. `app.config.ts:7` importa development diretamente, enquanto `angular.json:61` substitui `environment.ts`. Clone limpo não inclui os arquivos exigidos; separação development/production precisa ser definida em F1-02.
- **Integrações:** Firebase inicializado não tem uso de produto evidenciado; revisar necessidade/duplicação em F1-02 sem remoção automática.
- **Acessibilidade:** modal usa `aria-modal` sem mecanismo de confinamento/restauração de foco ou inert; risco confirmado na implementação, impacto assistivo ainda requer teste. Contraste efetivo, reflow, navegação mobile e posicionamento absoluto/z-index do Index são pendências, não falhas demonstradas em navegador.
- **Publicação:** `firebase.json:2` sem bloco hosting/diretório/backend; `.firebaserc` ausente. `robots.txt:4` e `sitemap.xml:9` contêm `website.com.br` de exemplo. `.gitignore:40–41` ignora pastas ocultas e também ignoraria `.github/workflows`.
- **Fontes externas:** estudo inicial feito; guia/desafio completos indisponíveis e material temporal Night Lights ainda não qualificado para uso. Ver [catálogo](data-and-sources.md), [riscos](risks.md) e tarefas F2/F7.

Na conclusão F0, apenas `AGENTS.md`, `docs/brain/**` e o link mínimo no README raiz são alterações de entrega. Código/configuração/lockfile preexistentes permanecem idênticos a HEAD; o [handoff](handoff.md) registra a validação documental final.
