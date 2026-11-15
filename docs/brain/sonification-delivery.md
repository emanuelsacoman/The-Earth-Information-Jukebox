# Entrega de sonificação — 15/11/2026

## Referência e autorização

Execução por Codex em `feat/f3-sonification`, criada da `brain` limpa em `64659fba8e45fd6f635df909e69923588db92d44` (merge do PR #6, que já integra o Observatório Âmbar). Alterações locais, sem commit, push, merge ou deploy. Responsáveis humanos continuam **UNASSIGNED**. A tarefa anexada nesta sessão autoriza F3-01/02/03, integração mínima F4-01/02 e as partes necessárias de F2-01/02/03; substitui a restrição histórica da TASK 0 para este escopo.

O código presente foi conferido antes da implementação. Boot/SSR e expectativas antigas do teste raiz já tinham sido corrigidos pela entrega do mundo; Firebase não participa do boot e ambientes locais não são importados. Esses arquivos e os módulos nativos do globo foram preservados. Não se atribui esta correção preexistente à sonificação.

## Implementação e arquivos

| Área | Arquivos / comportamento |
|---|---|
| Contratos | [sonification.types.ts](../../src/app/sonification/sonification.types.ts): registro, frame, feature, evento e estado explícito |
| Fonte local | [scientific-catalog.ts](../../src/app/sonification/scientific-catalog.ts), [manifesto](../../public/data/night-lights/manifest.json) e dois PNGs anuais |
| Carregamento | [frame-loader.ts](../../src/app/sonification/frame-loader.ts): fetch com AbortSignal, SHA-256 antes do decode, dimensões, Canvas2D, pixels e fechamento de bitmap/canvas |
| Extração e mapa | [feature-mapping.ts](../../src/app/sonification/feature-mapping.ts): funções puras, ROI/máscara/amostragem, origem e parâmetros versionados |
| Síntese | [web-audio-engine.ts](../../src/app/sonification/web-audio-engine.ts): um contexto tardio, osciladores senoidais, ganho, panorama, envelopes, scheduler e descarte |
| Coordenação | [playback-coordinator.ts](../../src/app/sonification/playback-coordinator.ts): fonte única de estado, revisão monotônica, seleção, Play/Pause/Resume/seek, erro e teardown |
| Interface | [AudioPanel](../../src/app/view/screen-components/audio-panel/audio-panel.component.html), TS/CSS e [Index](../../src/app/view/index/index.component.html): painel operável antes do globo; imagem e célula da leitura |
| Verificação | Specs junto aos módulos; [smoke SSR](../../tests/production-smoke.mjs) ampliado; [smoke de navegador](../../tests/sonification-browser-smoke.mjs) |

O Dashboard legado continua desmontado e foi preservado. Não há opções simuladas de timbre/escala nem visualizador decorativo de áudio no painel novo. `pointSelected` é recebido pelo coordenador Angular; as coordenadas não originam eventos de dados porque não existe transformação geográfica validada.

## Fonte e limites científicos

Utilizam-se os TIFFs anuais **only-lights de 2012 e 2023** publicados na [SVS 5276](https://svs.gsfc.nasa.gov/5276/). A [SVS 5313](https://svs.gsfc.nasa.gov/5313/) identifica a 5276 como versão original da visualização EIC. A amostra local não é extraída do vídeo panorâmico EIC nem contém anos interpolados.

Os originais 7680×4320 RGB 48 bits foram convertidos pelo mesmo processo GDI+ bicúbico para PNG RGBA de 2048×1152. Os dois derivados somam **802.687 bytes**; hashes, bytes dos originais, datas com precisão anual, transformação, URLs e créditos completos estão no manifesto. O buffer RGBA de um frame ocupa 9.437.184 bytes; somente um frame é decodificado por seleção, sem cache crescente.

ROI inteira, com exclusão retangular `(x=870, y=680, largura=150, altura=80)` do texto do ano, identificada visualmente nos dois derivados. Não existe máscara científica de ausência de dados. Preto pode ser fundo, pouca luz ou ausência não identificada; é estatística visual, sem significado de zero físico. Alpha zero produz feature ausente; qualquer alpha positivo é aceito sem ponderação por cobertura. As bordas dos derivados têm alpha parcial decorrente do redimensionamento.

Crédito solicitado: **NASA's Scientific Visualization Studio**, com colaboradores e Black Marble/VIIRS discriminados no manifesto e na interface. Uso educacional/informativo conforme [diretrizes NASA](https://www.nasa.gov/nasa-brand-center/images-and-media/), sem alegar endosso ou licença CC0. Não foi identificado aviso específico de terceiros nos recursos selecionados. Não se usa logotipo NASA.

## Fórmulas reproduzíveis

Extração `encoded-rgb-grid/v1`: 24 colunas × 8 linhas, percurso por coluna de cima para baixo, depois coluna seguinte; amostras a cada dois pixels dentro de cada célula. A referência fixa entre frames é 0–255, sem equalização por imagem.

1. Para amostras válidas, `b = 0,2126 R + 0,7152 G + 0,0722 B` nos canais **codificados**, sem inversão radiométrica; `n = média(b) / 255`.
2. Máscaras/exclusões/alpha zero não entram na média. Célula sem amostras válidas permanece ausente/mascarada, sem nota. O intervalo espacial fica preservado e a leitura informa indisponibilidade.
3. Mapeamento `brightness-pentatonic/v1`: `i = round(15 n)`; MIDI `[48,50,52,55,57,60,62,64,67,69,72,74,76,79,81,84][i]`, de C3 a C6, pentatônica maior para reduzir dissonância na primeira experiência.
4. `f = 440 × 2^((MIDI − 69)/12)` Hz; ganho da voz `g = 0,06 + 0,14 n`; panorama `p = 2 x − 1`, com x no centro normalizado da célula.
5. Offset lógico `índice × 0,24 s`; duração lógica `0,18 s`. A velocidade `s ∈ [0,5; 2]` divide offsets/durações de áudio por s, preservando frequências. A varredura completa dura `46,08 / s` segundos. Ritmo fixo, sem alegar que variação visual controla ritmo.

Cada evento guarda record/frame/feature/hash/método/mapeamento e snapshot da feature. Não há aleatoriedade. Ganho não é volume percebido uniforme; frequência sonora e duração são escolhas de apresentação. A média de regiões escuras pode concentrar notas graves; não se expande o histograma para aparentar variação científica.

## Política de áudio e sincronização

Contexto criado/retomado somente em Play por gesto, com confirmação de `state=running`. Master inicia em 30%, limitado a `[0,1]`; mute preserva o volume escolhido. Limites do motor: 100–1600 Hz, ganho por voz ≤0,2, até quatro vozes (soma linear ≤0,8 antes do master), duração lógica de 0,04–1 s. O mapa usa 130,81–1046,50 Hz e 0,18 s. A duração efetiva varia com a velocidade.

Relógio mestre `AudioContext.currentTime`; lead 25 ms, horizonte 100 ms, tick de 25 ms. Ataque 8 ms, release 15 ms, cancelamento suave de voz ativa em 8 ms; notas futuras são canceladas antes de tocar. `onended` desconecta os nós. Tick atrasado descarta notas vencidas, sem rajada acumulada. Suspensão interrompe o scheduler e apresenta recuperação por Play.

Pausa preserva posição; retomada cria uma nova âncora e revisão. Alterar velocidade pausa antes de retomar; seek também pausa e permite ler uma prévia sem som. Ao fim, Play reinicia. Seleção aborta carregamento anterior, limpa frame/leitura e invalida callbacks; resposta obsoleta nunca volta a `ready`. `currentFeature` conserva a validade de cada posição; `execution` registra ID/revisão/horários de áudio agendado e observado quando o relógio alcança a nota. Esse feedback não comprova audição física.

Ao destruir Index, Angular destrói seu coordenador, cancela fetch/timer/fontes, desconecta nós e fecha o contexto. O construtor não acessa APIs browser; SSR renderiza fonte/legenda/controles sem carregar pixels ou criar áudio.

## Validação desta árvore

Data **15/11/2026**, contexto `America/Sao_Paulo`, base `64659fba`, branch local indicada acima. Windows, Node **20.20.0**, npm **10.8.2**, Angular 18.2, Karma 6.4.4, ChromeHeadless **157.0.0.0**. Smoke CDP usa Node **24.22.2** existente e Chrome **157.0.8103.51**, sem instalar bibliotecas. NVM padrão sem versão ativa; PATH ajustado apenas nos processos. O sandbox inicialmente causou `EPERM lstat C:\Users\Emanuel`; os checks foram executados com escalada aprovada, sem mudar runtime global. Um worker (`NG_BUILD_MAX_WORKERS=1`) e analytics desativado no processo.

| Comando / roteiro | Resultado |
|---|---|
| `npm run build` | APROVADO: uma rota prerenderizada, logs sem erro SSR; bundle inicial 297,25 kB bruto / 83,91 kB estimados; globo tardio 101,07 kB |
| `npm test -- --watch=false --browsers=ChromeHeadless` | **74/74 aprovados**: 17 preexistentes + 11 extração/mapa + 20 motor + 13 coordenador + 11 loader + 2 painel |
| `node --test tests/amber-earth.test.mjs` | **8/8 aprovados**; módulos nativos do globo inalterados |
| `node tests/production-smoke.mjs` | APROVADO: prerender, SSR em runtime sem cache SSG, HTTP 200, painel, dois PNGs com bytes/MIME e scripts de produção |
| `node tests/sonification-browser-smoke.mjs` (Node 24) | APROVADO: arquivos/hash/Canvas reais, sem autoplay, dez ciclos e trocas, volume/mute, seek/velocidade/fim, preservação do globo e viewport 320 px |
| Escuta humana / leitor de tela | **PENDENTE**: não há confirmação auditiva ou validação assistiva nesta sessão |
| Instalação limpa isolada | Não repetida: dependências locais existentes; G-INSTALL permanece pendente |

Os testes do loader incluem PNG NASA real, SHA-256, Canvas2D e pixels sem mocks no caminho feliz; mocks são usados nas falhas e no motor para controlar relógio/nós. Fixtures sintéticas do mapper/coordenador/painel são identificadas no código e não pertencem ao catálogo. O 404 do asset `missing-frame-for-test.png` no log é o caso negativo esperado.

O smoke CDP instrumenta o **contexto e osciladores reais** e deriva um ramo de monitoramento do master para AnalyserNode, sem substituir o som do produto nem liberar autoplay por flag. RMS em 20%: **0,0044035**; em 80%: **0,0176274** (~4×); mute: **0**. Um único contexto, máximo duas vozes alocadas/uma simultânea observadas, zero após pausa. O roteiro inclui amostra de **60,616 s**, com **274 leituras rastreadas no total**; frequência efetiva/texto e marcador coincidem, atraso máximo de **25,67 ms** entre início no relógio de áudio e mutação textual. CPU TaskDuration da amostra: **3,62863 s**; heap JS ao fim **4.897.564 bytes**, sem equivaler à memória total do áudio/canvas. Leituras Canvas2D dos frames: aproximadamente 4,7–7,5 ms; extração inteira não foi cronometrada isoladamente.

Relatório JSON e capturas foram gerados em `%TEMP%\earth-jukebox-sonification-smoke\` e podem ser regenerados pelo script (`SONIFICATION_SMOKE_ARTIFACTS` altera o destino). Capturas desktop 1440×1000 e móvel emulado 320×900 inspecionadas visualmente; sem overflow horizontal observado. O ano foi colocado no início das opções para permanecer visível em largura estreita. Chrome/servidor de teste foram encerrados, e o perfil temporário removido. Navegar para about:blank não substitui a prova de teardown Angular, que permanece nos testes de componentes/coordenador/motor. Nenhuma escuta humana foi realizada.

Fechamento documental: **15 Markdown em docs/brain, 129 links locais sem destinos ausentes e 29 IDs únicos**; dependências e ausência de ciclos verificadas. `git diff --check` limpo, UTF-8/newline conferidos nos arquivos novos; sem alterações em package/lock/Angular/Firebase, Dashboard ou módulos do globo. O smoke de 60 s precede somente o ajuste textual da ordem do ano no seletor; build e SSR foram repetidos após esse ajuste, sem repetir a medição sonora por não haver mudança no motor ou nos eventos.

As primeiras rodadas focadas revelaram apenas expectativas de precisão IEEE e de alpha opaco no canto do PNG; foram corrigidas para a política/resultado efetivos. A revisão independente encontrou duas falhas reais: posição antiga durante resume pendente e leitura antiga em slot sem dados; ambas receberam correções e testes de regressão antes da rodada de 74 testes. Build/test inicial não substitui o resultado após essas correções.

Revisão independente final somente leitura não identificou novos defeitos materiais nem inconsistências relevantes nas classificações/gates. Não substitui revisão humana para integração ou a escuta pendente.

## Gates e continuidade

G-MAP aprovado para esta estratégia e G-DATA aprovado para os dois derivados locais, sem inferência física/geográfica. G-BUILD/G-TEST têm evidência atual; **G-SYNC aprovado no desktop automatizado** dentro do alvo de 100 ms, com concorrência/cancelamento também testados. G-AUDIO depende de escuta humana. G-A11Y/G-PERF/G-INSTALL/G-DEMO/PUBLISH não foram aprovados integralmente. A classificação de pipeline é **PARTIAL com sinal digital real verificado**, sem declarar o MVP completo ou sonificação NASA integrada validada por audição.

F2-01/02 têm aceite do subconjunto curado. F3-01 tem G-MAP, mas a dependência formal F1-04 completa ainda não foi encerrada. F2-03, F3-01/02/03 e F4-01/02 permanecem em andamento até seus gates/dependências; não promover fases inteiras pela fatia técnica. Próxima tarefa exata: **F3-03**, completar escuta e dez ciclos humanos; depois F4-02 e F5-01/02 para sincronização/experiência assistiva, e F1-01 para reprodução isolada.

## Como testar e ouvir

Com Node compatível disponível e dependências do lockfile instaladas, execute `npm start`, abra `http://localhost:4200`, aguarde “Pronto para ouvir” e pressione **Reproduzir**. Nenhum áudio inicia ao abrir a página ou trocar o ano.

Neste ambiente o shim NVM estava sem versão ativa. O procedimento usado para selecionar somente o runtime do processo, sem modificar a instalação global, é:

```powershell
$taskNodeDir = 'C:\Users\Emanuel\AppData\Local\Author Software\nvm\installs\v20.20.0'
$env:PATH = "$taskNodeDir;" + $env:PATH
& "$taskNodeDir\npm.cmd" start -- --host 127.0.0.1
```

1. Escolha 2012 e ouça uma varredura; acompanhe região destacada, leitura e legenda. Registre navegador/SO/dispositivo/saída de som.
2. Faça dez ciclos Play/Pause/Resume; cada pausa deve silenciar em até o release, sem notas antigas ao retomar. Registre o que foi realmente ouvido.
3. Compare volume 20%/70%, silencie e reative preservando o ajuste; confirme o efeito auditivo. Mude velocidade e retome manualmente.
4. Mova a posição com setas no slider, confirme pausa e leitura correspondente; retome. Troque rapidamente 2012/2023 durante carga e reprodução: não deve soar a fila anterior.
5. Interrompa acesso aos assets em DevTools: erro deve bloquear Play inválido e oferecer preparação novamente. Restaure acesso e repita.
6. Teste Tab/Shift+Tab/Enter/Espaço/setas, 320 CSS px, zoom 200%, movimento reduzido e leitor de tela. O status anuncia transporte/erro; as notas não são anunciadas continuamente.
7. Use destinos/zoom/teclado do globo: controles continuam funcionais, e seleção não deve modificar o som. Destrua/navegue para fora da experiência e confirme silêncio/contexto liberado.

Registrar o resultado por etapa. Som observado por AnalyserNode comprova sinal digital, mas não substitui escuta ou avaliação de conforto. Medir desktop e dispositivo móvel real antes de G-PERF integral.
