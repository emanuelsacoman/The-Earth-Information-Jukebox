# Entrega — experiência de tela única

## Referência e escopo

**15/11/2026**, contexto `America/Sao_Paulo`. Execução técnica: Codex; revisão humana: **UNASSIGNED**. Branch local `feat/single-screen-observatory`, derivada da `brain` limpa em `2c424b0474c7c96589d02d3db5e21a922aee258c`; versão do pacote `0.0.0`, Angular 18.2.14. `git ls-remote` confirmou `main` e `brain` remotas nesse mesmo commit antes da implementação. A `main` local possui divergências preexistentes e não foi alterada.

A tarefa anexada autoriza a implementação completa da experiência integrada. Corresponde à **F4-05**, com dependências e aceite no [roadmap](roadmap.md). Não estende autorização a publicar, fazer push, merge ou deploy. Não houve commit ou criação de PR remoto. O diff local é o artefato para revisão humana.

## Experiência implementada

Uma composição Angular em CSS Grid reúne cabeçalho discreto, globo Canvas2D existente, imagem científica contextual e player na base. O planeta ocupa o espaço central disponível. A navegação para uma segunda seção sonora e o cabeçalho duplicado do módulo nativo foram removidos da composição.

- **Entrada:** o globo aparece imediatamente; a fonte NASA é preparada no navegador sem criar `AudioContext`. “Listen to Earth” abre a imagem e move o foco para o painel, sem iniciar som. Se os dados não estiverem prontos, Play permanece inativo.
- **Escuta:** Play revela o painel científico e envia o comando ao coordenador existente. Pause preserva posição; Restart, Mute, Volume, Speed e Spatial position continuam funcionais. Volume/velocidade ficam em “Sound settings”, sem desmontar controles ou estado.
- **Ciência:** seletor 2012/2023, carregamento/erro, PNG real, célula atual, brilho relativo, nota/frequência, alternativa textual, método, limitações e créditos permanecem disponíveis. O destaque mais intenso da célula depende do evento executado, sem animação sonora decorativa.
- **Geografia:** arrastar, zoom, rotação, seleção, destinos, setas, Home, movimento reduzido e fallback continuam no renderer existente. “Places & coordinates” recolhe os controles secundários. Anúncios de seleção ficam fora do disclosure fechado.
- **Desktop:** painel científico lateral a partir de 1000 CSS px, recolhível; player permanece na mesma composição. Nas alturas normais testadas, não é necessário rolar a página para alternar entre globo e áudio.
- **Tablet/celular:** painel contextual sobre a área do globo, fechado inicialmente, com rolagem interna e botão de retorno. O globo coberto fica `inert` enquanto o painel está aberto. Cabeçalho e player permanecem disponíveis; fechar ou Escape restaura o foco à chamada de escuta.
- **Reflow:** `dvh`, safe area inferior, mínimos de canvas e rolagem interna preservam acesso aos controles. Em viewport baixa/zoom elevado, rolagem vertical é permitida; não se força conteúdo a caber em 100vh. O canvas ocupa a altura disponível e sua toolbar não é comprimida sob o player.

Toda a interface ativa permanece em inglês. O Dashboard legado continua desmontado; nenhum componente foi excluído.

## Arquitetura e fidelidade científica

`IndexComponent` fornece **um** `PlaybackCoordinator`. `AudioPanelComponent` foi reaproveitado para renderizar tanto o painel contextual quanto o player, mantendo uma instância mesmo ao recolher a imagem. O Index guarda apenas apresentação responsiva/abertura; não copia transporte, volume, leitura ou fonte. O listener de breakpoint e o callback de foco são liberados no ciclo de destruição.

`GlobeModel` conserva o estado geográfico. `observatory.mjs` organiza somente a interface geográfica; não recebe estado de áudio nem cria motor ou contexto adicional. `FrameLoader`, catálogo, extrator, mapper, `WebAudioEngine`, coordenador e contratos não foram alterados.

Foi adotada a **estratégia B**, fundamentada na [investigação científica](single-screen-science.md). Os TIFFs utilizados não fornecem CRS/transformação nas tags inspecionadas, e as fontes consultadas não validam lat/lon→pixel para estes recursos. A imagem NASA permanece visível em seu domínio de pixels; o marcador do globo comunica apenas geografia. A interface explica essa independência. Não há sobreposição científica fictícia no planeta.

Preservados os PNGs, hashes, manifesto, máscara do ano, grade 24×8, domínio `visual-pixel`, normalização/mapeamento determinísticos, limites de frequência/ganho, cancelamento, scheduler e descarte. Preto não passa a significar ausência científica conhecida ou zero físico. O ano é a seleção de uma média anual; seek continua espacial, sem interpolar anos.

## Arquivos para revisão

| Situação | Arquivos / área |
|---|---|
| Alterados | `src/app/view/index/index.component.{ts,html,css,spec.ts}`: composição, entrada, foco, breakpoint e teste integrado |
| Alterados | `src/app/view/screen-components/audio-panel/audio-panel.component.{ts,html,css,spec.ts}`: fonte contextual, player, disclosure, foco e testes de controles/preservação |
| Alterados | `src/app/view/screen-components/planet-earth/observatory.{mjs,css}` e `planet-earth.component.css`: DOM geográfico compacto e dimensionamento |
| Alterado | `src/app/view/screen-components/dashboard/dashboard.component.spec.ts`: alinhamento à API pt-BR já presente na base, mantendo 10 testes e 19 expectativas |
| Alterados | `tests/production-smoke.mjs`, `tests/sonification-browser-smoke.mjs`: composição SSR e regressões completas no navegador |
| Alterados | `current-state.md`, `architecture.md`, `roadmap.md`, `risks.md`, `quality-gates.md`, `handoff.md`: seções atuais sem apagar registros históricos |
| Criados | Este relatório e `single-screen-science.md`; evidências indicadas abaixo |
| Removidos | Nenhum arquivo; removida apenas a antiga divisão visual e sua navegação |

Uma alteração concorrente em `public/favicon.ico` apareceu durante a inspeção e foi preservada. Ela está fora da autoria e do escopo desta tarefa; deve ser separada na revisão/commit pelo responsável.

## Ambiente e validação

Windows, Node **20.20.0** / npm **10.8.2** nos comandos Angular e Node **24.22.2** no smoke CDP; Chrome **157.0.8103.51** (Karma informa 157.0.0.0). Runtimes/dependências existentes, sem instalação ou alteração de package/lock. PATH ajustado somente nos processos, `NG_CLI_ANALYTICS=false` e `NG_BUILD_MAX_WORKERS=1`.

O sandbox inicialmente bloqueou Git/runtime/rede com `Permission denied`, `EPERM lstat` ou indisponibilidade de conexão; comandos pertinentes foram repetidos com escalada autorizada. Nenhuma configuração global de NVM, navegador ou sistema foi alterada. A integração de Computer Use não expôs navegador/pipe nativo; a QA visual usa capturas reais do smoke de navegador explicitamente solicitado, sem afirmar uso de leitor de tela ou zoom nativo.

| Comando / roteiro | Resultado da árvore final |
|---|---|
| `npm run build` | **APROVADO**: uma rota prerenderizada, sem erro SSR; bundle inicial **306,63 kB** bruto / **85,44 kB** estimados; globo tardio **99,84 kB** |
| `npm test -- --watch=false --browsers=ChromeHeadless` | **78/78 aprovados** após corrigir spec legado; repetido após os ajustes finais com `--reporters=dots`, também 78/78 |
| `node --test tests/amber-earth.test.mjs` | **8/8 aprovados**; projeção/seleção/gestos/limites/movimento reduzido |
| `node tests/production-smoke.mjs` | **APROVADO** na compilação final: prerender, renderer SSR direto sem cache SSG, HTTP 200, scripts e PNGs/manifesto |
| `node tests/sonification-browser-smoke.mjs` (Node 24) | **APROVADO** na compilação final: 60,199 s de amostra, 274 leituras, máximo 25,67 ms; sinal real, cancelamento, integração e matriz de interface descritos abaixo |
| G-DOC / `git diff --check` | **APROVADO**: 22 Markdown, 204 links locais sem destinos ausentes, 30 IDs únicos com dependências existentes e sem ciclos; UTF-8/newline e históricos preservados |
| Escuta humana / leitor de tela / zoom nativo / aparelho físico | **PENDENTES**; não equivalem à medição digital ou emulação |

A primeira tentativa da suíte Angular encontrou uma divergência preexistente: o componente Dashboard já estava em pt-BR na base, mas seu spec usava identificadores em inglês. Apenas o spec foi alinhado; nenhum teste foi desabilitado e não se mudou a lógica de produto para satisfazê-lo. O 404 `missing-frame-for-test.png` é o caso negativo esperado do loader.

A revisão identificou e corrigiu foco em elementos cobertos pelo drawer móvel, callback tardio de foco após fechar/destruir, área vazia no globo móvel e possibilidade de controles geográficos avançarem sob o player em altura reduzida. As correções foram feitas na apresentação e no seu ciclo de vida, sem alterar eventos/algoritmos científicos.

O smoke final instrumenta contexto e osciladores reais e usa AnalyserNode para medir o sinal, sem substituir a síntese do produto ou liberar autoplay por flag. RMS em 20%: **0,0044091488**; em 80%: **0,0176371000** (~4×); mute: **0**. Foi observado **um AudioContext**, máximo de duas vozes alocadas/uma simultânea e zero após pausa. A amostra teve **60,199 s**, **274 leituras** e atraso máximo **25,67 ms**; frequência/texto/marcador foram conferidos. TaskDuration: **1,906093 s**; heap JS: **4.658.424 bytes**, sem representar a memória total do áudio/canvas ou um aceite integral de G-PERF.

As larguras **320/390/768/1280/1920 CSS px**, com altura 900, passaram nos estados fechado/aberto/em reprodução, sem overflow horizontal observado. O player permaneceu no viewport (borda inferior 900 px); nos desktops testados a página coube em uma tela. O roteiro também confirmou CTA antes de dados prontos sem novas notas, erro/recuperação de imagem, fonte antiga descartada, dez ciclos, troca rápida, drag real, rotação, teclado, `prefers-reduced-motion`, fallback real de Canvas e destinos/setas no fallback. Shift+Tab não alcança o globo coberto em 320/390/768. Em **640×450**, equivalente à área CSS de 1280×900 a 200%, controles secundários e toolbar continuam alcançáveis por foco/rolagem. Essa emulação não é zoom nativo do navegador. O click de Restart é coberto pelo spec Angular integrado; descarte do coordenador/motor e desmontagem do canvas continuam cobertos pela suíte, sem tratar navegação para `about:blank` como prova isolada de teardown Angular.

O [relatório JSON completo](evidence/single-screen-2026-11-15/report.json) e capturas selecionadas estão preservados no repositório:

- [Desktop em reprodução — 1280 px](evidence/single-screen-2026-11-15/layout-1280-playing.png).
- [Globo móvel — 320 px](evidence/single-screen-2026-11-15/layout-320-closed.png).
- [Imagem NASA no painel móvel — 390 px](evidence/single-screen-2026-11-15/layout-390-open.png).
- [Reflow equivalente a 200%](evidence/single-screen-2026-11-15/reflow-200-percent-equivalent.png).
- [Erro de carregamento](evidence/single-screen-2026-11-15/loading-error.png).

As capturas foram inspecionadas visualmente. O conjunto completo é regenerado pelo smoke; `SONIFICATION_SMOKE_ARTIFACTS` seleciona o destino. Não houve erro de JavaScript não tratado na rodada final. O primeiro ajuste do harness de teclado corrigiu a emissão de Enter no CDP antes da rodada verde; nenhuma expectativa funcional foi desabilitada. G-BUILD/G-TEST, G-SYNC automatizado e G-DOC estão aprovados para esta árvore; as limitações humanas da tabela permanecem.

## Firebase Hosting e continuidade

`firebase.json`, `.firebaserc`, diretório de build, assets públicos e manifesto permanecem preservados. A saída estática em `dist/the-earth-information-jukebox/browser` continua contendo `index.html`, scripts, imagens e metadados para Hosting estático. O servidor Node local foi usado para teste de produção/SSR; a experiência não exige backend novo. Não houve publicação, mudança de projeto Firebase ou deploy.

G-BUILD/G-TEST e as evidências automatizadas são distintos do aceite humano. F4-05 permanece **IN_PROGRESS** pelos aceites humanos/revisão ainda pendentes; a implementação e a rodada automatizada final estão concluídas. G-AUDIO/G-A11Y/G-PERF integrais não são concluídos por esta rodada. Próximo passo exato: **F3-03**, escuta humana e ciclos de uso; **F5-03**, leitor de tela/zoom nativo/dispositivo físico; revisão humana do diff antes de eventual PR/publicação autorizada.
