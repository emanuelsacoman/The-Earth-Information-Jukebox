# Gates de qualidade

## Apresentação em docs/demo — 15/11/2026

Fatia F7-04 sobre `feat/single-screen-observatory`/`2c424b0`: PPTX atualizado por pacote Open XML em cópia privada, renderizado antes/depois com PowerPoint 16.0. Seis slides finais inspecionados; 27 caixas editáveis em Arial, dimensões preservadas, texto/objetos dentro dos frames, 58 entradas únicas e 56 relações internas válidas. Hash da cópia entregue confere com o arquivo validado. **QA documental/visual aprovada** para a atualização; **G-DEMO integral permanece pendente** de revisão/identificação/aceites humanos e requisitos oficiais. Artifact Tool e playback do slideshow não executados. Não repetir build/áudio para esta alteração exclusiva da demo/documentação. Detalhes no [handoff](handoff.md).

## F6-04 — camada NASA e tipografia, 15/11/2026

Árvore local `feat/single-screen-observatory` sobre `2c424b0`; Windows/Node 20.20.0 e 24.22.2/Chrome 157; execução Codex, humano UNASSIGNED. [Relatório completo](night-lights-globe-delivery.md).

| Gate | Resultado nesta tarefa |
|---|---|
| G-BUILD/G-TEST | APROVADOS: produção/SSR uma rota, 309,56 kB inicial/86,15 kB estimados, observatório tardio 103,65 kB; 79 Angular, 11 Node; smoke de SSR/HTTP/assets incluindo novo PNG/manifesto/hash. |
| G-DATA visual | APROVADO no subconjunto 2012: GeoTIFF com CRS/tiepoint/scale/PixelIsArea e derivado de média 2×2 conferidos. Não valida georreferência dos PNGs de áudio ou radiância física. |
| G-SYNC/G-AUDIO automatizado | Smoke real aprovado, 60,101 s/273 leituras/máximo 25,67 ms, volume ~4× RMS, mute zero, um contexto e zero vozes após Pause. G-AUDIO integral continua pendente de escuta. |
| G-PERF parcial | 2.454 amostras de superfície em três rotações, erro ≤0,5 byte; zoom/seleção/fallback/recuperação. ~30 fps com/sem camada, p95 da superfície 14,8/20,0 ms. Uma requisição/decode, +14.392 bytes retidos após 40 alternâncias. Sem aceite integral em aparelho físico. |
| G-A11Y parcial | Cinco larguras, controles/painéis, foco/inert, movimento reduzido e reflow 640×450 aprovados; capturas inspecionadas. Zoom nativo de 200%, leitor de tela e aparelho real pendentes. |
| G-PUBLISH/G-INSTALL | Nenhum deploy/publicação nem nova instalação nesta tarefa. Configuração Firebase, package/lock preservados. |

G-DOC APROVADO: 23 Markdown em docs/brain, 235 links locais sem destinos ausentes, 31 IDs únicos com dependências existentes/sem ciclos, históricos preservados por adições e `git diff --check` limpo. Os registros seguintes são históricos e preservam suas métricas originais.

Gate só é aprovado com **comando/roteiro, resultado, data, commit, ambiente e evidência inspecionável**. Registrar também limitações e responsável que validou; revisão humana continua necessária para integrar/publicar. `exit 0`, screenshot isolado ou flag `playing=true` não comprovam uma experiência funcional.

## F4-05 — tela única, validação final automatizada em 15/11/2026

Árvore local **`feat/single-screen-observatory`**, base **`2c424b0474c7c96589d02d3db5e21a922aee258c`**, Windows; execução técnica Codex e revisão humana **UNASSIGNED**. Os resultados abaixo são da rodada final após ajustes de foco/inert/CSS. Comandos, runtime, resultados e artefatos em [single-screen-delivery](single-screen-delivery.md) e no [relatório automatizado](evidence/single-screen-2026-11-15/report.json).

| Gate / comando ou roteiro | Evidência disponível e limite |
|---|---|
| G-BUILD — `npm run build` | APROVADO: uma rota prerenderizada sem erro SSR; bundle inicial 306,63 kB bruto / 85,44 kB estimados, módulo tardio do globo 99,84 kB. |
| G-TEST — `npm test -- --watch=false --browsers=ChromeHeadless` | APROVADO: 78/78, repetidos após foco/inert/CSS. Spec legado corrigido para a API atual sem reduzir cobertura; nenhum teste desabilitado. |
| G-TEST — `node --test tests/amber-earth.test.mjs` | 8/8 aprovados; núcleo do renderer/modelo geográfico preservado. |
| G-BUILD — `node tests/production-smoke.mjs` | APROVADO: HTML prerenderizado da composição, SSR direto em runtime, HTTP, scripts e recursos locais de produção. Configuração Firebase e saída estática preservadas; nenhum deploy. |
| G-DATA/G-MAP | Catálogo, PNGs, manifesto, máscaras, hashes e algoritmos sem diff. Inspeção dos originais sustenta estratégia B, não uma projeção validada; ver [decisão científica](single-screen-science.md). |
| G-SYNC — `node tests/sonification-browser-smoke.mjs` | APROVADO no desktop automatizado: contexto/osciladores reais e AnalyserNode, amostra de 60,199 s, 274 leituras, atraso máximo 25,6667 ms. Notas/texto/marcador, cancelamento, volume/mute/seek/velocidade/trocas conferidos. RMS a 20%: 0,00440914879; a 80%: 0,01763709999; mute: 0. Um contexto, até duas vozes alocadas/uma simultânea e zero após Pause. Não comprova audição física. |
| G-A11Y/G-PERF — roteiro de interface | PARCIAL: rodada final exercitou 320/390/768/1280/1920 CSS px, painel aberto/fechado/em reprodução, altura do documento/base do player em 900 px; Shift+Tab com inert, loading/erro/recuperação, fallback, arrasto e movimento reduzido. Reflow 640×450 com ajustes/barra alcançáveis. TaskDuration da amostra 1,906093 s; heap final 4.658.424 bytes, sem equivaler à memória total. Capturas CDP reais inspecionadas. Zoom nativo de 200%, leitor de tela e dispositivo físico permanecem pendentes. CUA indisponível por falha de conexão ao navegador neste ambiente. |
| G-AUDIO | PARCIAL: sinal digital e transporte exercitados; escuta/conforto humanos pendentes em F3-03. |
| G-DOC | APROVADO: 22 Markdown em docs/brain, 204 links locais sem destino ausente, 30 IDs únicos, dependências existentes e sem ciclos. Os seis históricos foram preservados integralmente após normalizar CRLF/LF; UTF-8/newline e git diff --check aprovados. |
| G-INSTALL/G-PUBLISH/G-DEMO | Instalação limpa não repetida nesta tarefa; nenhuma publicação, deploy ou nova demonstração humana. Registros anteriores continuam vinculados a seus próprios commits. |

Capturas selecionadas: [desktop em reprodução](evidence/single-screen-2026-11-15/layout-1280-playing.png), [320 px fechado](evidence/single-screen-2026-11-15/layout-320-closed.png), [390 px aberto](evidence/single-screen-2026-11-15/layout-390-open.png), [reflow equivalente a 200%](evidence/single-screen-2026-11-15/reflow-200-percent-equivalent.png) e [erro de carregamento](evidence/single-screen-2026-11-15/loading-error.png). A equivalência de viewport não substitui zoom nativo.

F4-05 permanece **IN_PROGRESS** somente pelos aceites humanos/dependências ainda abertos e revisão humana. G-BUILD/G-TEST/G-SYNC automatizado estão aprovados para esta entrega; G-AUDIO/G-A11Y/G-PERF integrais continuam pendentes. Não declarar conformidade integral de acessibilidade ou o MVP completo.

## Evidência atual de release

Sobre `brain`/`6581f24`: G-INSTALL/G-BUILD/G-TEST aprovados para a aplicação ativa com instalação isolada sem lifecycle scripts, development/production, SSR, 75 Angular e 8 Node. G-DATA/G-MAP preservados e novamente exercitados pela suíte. G-A11Y é parcial: teclado e reflow emulados verificados, nove amostras de contraste com mínimo 9,41:1; faltam leitor de tela, zoom nativo e aparelho físico. G-AUDIO continua parcial sem escuta humana. A demo de seis slides está preparada e validada, mas o aceite G-DEMO e a identificação da equipe permanecem pendentes. Não houve deploy ou submissão. A medição de sincronização de 60 s abaixo é histórica, não foi repetida nesta revisão. Ver [handoff](handoff.md).

## Evidência da sonificação em 64659fba — histórico de 15/11/2026

Árvore local `feat/f3-sonification` sobre `64659fba`, execução Codex, revisão humana UNASSIGNED. Ambiente, comandos e limites em [entrega de sonificação](sonification-delivery.md); o quadro F0 abaixo permanece histórico.

| Gate | Resultado atual para a fatia |
|---|---|
| G-BUILD | APROVADO: build production sem erro SSR/prerender e smoke do servidor; painel renderizado no servidor sem áudio/pixels |
| G-TEST | APROVADO: 74/74 Angular, 8/8 Node; leitura real do PNG e falhas de fronteira, regressões do motor/coordenador/interface |
| G-DATA | APROVADO para dois derivados locais da SVS 5276 vinculada à EIC 5313; hashes, dimensões, máscara visual, datas e uso. Sem calibração física/georreferência |
| G-MAP | APROVADO para encoded-rgb-grid/v1 + brightness-pentatonic/v1; fórmulas, origem, min/médio/max/ausente/inválido/máscara e determinismo testados |
| G-AUDIO | PARCIAL: motor e controles automatizados; escuta humana PENDENTE, não aprovar integralmente |
| G-SYNC | APROVADO no desktop automatizado: amostra de 60,616 s, 274 leituras no roteiro, máximo 25,67 ms; frequência/texto/marcador coincidem; revisões e slots sem dados também testados |
| G-DOC | Fechamento desta implementação com links/IDs/estado/diff verificados conforme relatório; a restrição “apenas documentação” da F0 não se aplica à tarefa atual autorizada |
| G-INSTALL / G-A11Y / G-PERF | PENDENTES para aceite integral: instalação isolada, leitor de tela/medições e dispositivo móvel real não demonstrados nesta sessão |
| G-PUBLISH / G-DEMO | NÃO EXECUTADOS; sem publicação nem afirmação de MVP completo |

## Gates e baseline F0

Os resultados da tabela pertencem à auditoria histórica `aab5471`, preservada em [estado atual](current-state.md). A revisão documental não executou novamente build/testes nem validou o produto. As evidências do mundo em outra branch estão separadas em [entrega do mundo](world-delivery.md); não são aprovação dos gates da `brain`.

| Gate | Critério de aprovação verificável | Evidência esperada | Baseline F0 |
|---|---|---|---|
| G-DOC | Todos os documentos/links locais existem, IDs/dependências coerentes; estado e handoff correspondem ao Git; apenas documentação alterada | Inventário, validação de links/IDs, `git diff --check`, lista de alterações e diff de código vazio | Ver resultado final no [handoff](handoff.md) |
| G-INSTALL | Em checkout isolado, runtime registrado e instalação do lockfile existente concluída; configuração necessária reconstruível a partir de instruções sem segredos | Versões Node/npm/SO, `npm ci`, procedimento de ambientes, `git diff` de manifests/lock vazio | NÃO VALIDADO; instalação limpa não executada |
| G-BUILD | `npm run build` gera artefatos sem erros de compilação/prerender; página SSR/prerender contém conteúdo esperado e inicializa no browser | Código de saída **e logs**, inspeção de HTML, smoke browser/servidor; avisos classificados | REPROVADO: bundles gerados/exit 0, porém ReferenceError no prerender |
| G-TEST | `npm test -- --watch=false --browsers=ChromeHeadless` passa integralmente; testes relevantes cobrem comportamento alterado | Relatório com contagem e falhas; testes de extração/mapeamento/coordenação conforme implementação | REPROVADO: 14/15 passaram, 1 falhou |
| G-DATA | Pelo menos um record EIC com recurso real acessível, créditos/uso conferidos e manifesto com datas ou ausência explícita; amostra local legítima | URL oficial e arquivo/hash, correspondência frame-origem, legenda, dimensões, transformação e limites | NÃO ATENDIDO: somente pesquisa; sem assets no pipeline |
| G-MAP | Mesmo frame/método/versão/configuração gera mesmos features/eventos; valores mínimo/médio/máximo e sem dados têm resultado explicado | Tabela entrada→normalização→frequência/intensidade, fixtures legítimas identificadas e casos limite | NÃO ATENDIDO: legenda genérica, sem transformação |
| G-AUDIO | Áudio real varia previsivelmente com features; inicia por ação do usuário; pausa/mute/volume/velocidade têm efeito real; teardown interrompe fontes | Testes da cadeia de áudio/eventos e escuta manual registrada; 10 ciclos play/pause e troca de record sem vozes antigas | NÃO ATENDIDO: hooks vazios |
| G-SYNC | Record/frame/posição ativos correspondem ao som e texto; seek/pausa/troca durante load descartam resultados antigos | Trace com IDs/tempos; roteiro de corrida e retomada; tolerância proposta abaixo | NÃO ATENDIDO: sem coordenador |
| G-A11Y | Fluxo mínimo completo por teclado e leitor; conteúdo científico legível sem som e operável sem ver imagem; foco/modal/erros/movimento/contraste verificados | Roteiro manual com navegador/leitor/versões e resultados, medições de contraste, viewport e zoom | PARCIAL: estrutura existe, validação assistiva ausente |
| G-PERF | Amostra curada carrega e reproduz no desktop e dispositivo móvel documentados; memória/vozes/cache limitados; sem travamento progressivo | Perfil de 60 s, amostra/resolução/bytes/rede/dispositivo, pico de memória e contagem de nós ativos antes/depois | NÃO VALIDADO |
| G-PUBLISH | Destino/hosting/configuração revisados, build aprovado, publicação autorizada; URL HTTPS real abre em sessão limpa e serve assets/rotas/fallback | Plano, autorização, URL e smoke após deploy; nenhum segredo no bundle/repositório | NÃO VALIDADO; nenhum deploy autorizado em F0 |
| G-DEMO | Outro colaborador reproduz seleção→play→pausa→explicação→fonte→alternativa textual; guia/prazo/links/material conferidos | Roteiro e gravação/registro de execução; texto em inglês, fontes, limitações e IA; checklist do guia vigente | NÃO ATENDIDO |

## Critérios transversais do MVP

Metas iniciais de engenharia, **não requisitos NASA confirmados**:

- **Sincronização:** medir diferença entre apresentação do frame/posição e evento programado; alvo ≤100 ms durante 60 s. Pausa e seek cancelam eventos pendentes antes da retomada, sem áudio do record anterior. Se o dispositivo não atingir a meta, reduzir resolução/densidade e registrar a limitação; não aprovar silenciosamente.
- **Som:** valores finitos, frequência/duração dentro dos limites documentados do mapper, teto explícito de vozes e ganho, envelope sem cortes abruptos; sem clipping na amostra de validação. Mute mantém silêncio inclusive em mudança de frame. Zero fontes antigas ativas após teardown.
- **Texto/ciência:** distinguir instante científico, instante do vídeo e posição da varredura; nunca exibir unidade física não calibrada. Região sem dados tem tratamento explícito e não vira zero medido.
- **Acessibilidade:** testar Tab/Shift+Tab/Enter/Espaço/Escape/setas, campos e contenteditable; modal contém foco e restaura destino lógico; erro/loading anunciado sem inundar leitor; alternativa com fonte/data/característica/som. Validar reflow a 320 CSS px, zoom 200% e texto ampliado. Medir contraste de texto normal ≥4,5:1 e texto grande ≥3:1; não depender só da cor. Referência técnica: [WCAG 2.2](https://www.w3.org/TR/WCAG22/). Isso orienta verificações e não constitui declaração de conformidade integral.
- **Desempenho:** cache/quantidade de frames/vozes têm limite definido e perfil registrado; 60 s sem crescimento contínuo dos recursos após repetir seleção e pausa. A extração não deve monopolizar a thread principal; medir antes de introduzir workers ou bibliotecas.

## Gates por fase

| Fase | Saída necessária |
|---|---|
| F0 | G-DOC; demais falhas registradas, sem implementação |
| F1 | G-INSTALL, G-BUILD, G-TEST para baseline existente |
| F2 | G-DATA e carregamento real/fallback verificável |
| F3 | G-MAP e G-AUDIO com entrada científica rastreável |
| F4 | G-SYNC, fluxo integrado e testes comportamentais |
| F5 | G-A11Y; partes fundamentais P0 já acompanham F3/F4 |
| F6 | G-PERF e usabilidade 2D; 3D opcional não bloqueia saída |
| F7 | Gates obrigatórios anteriores, G-PUBLISH e G-DEMO; formalidades confirmadas em F7-01 |

Ao falhar, não marcar tarefa `DONE`. Guardar saída relevante em registro de validação da tarefa/PR ou documento apropriado, relacionar risco e indicar próximo passo. Para mudanças somente documentais, validar links/consistência/diff; não repetir build/test sem alteração ou preocupação nova.
