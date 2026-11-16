# Handoff operacional

## Atualização da apresentação — 15/11/2026

- **Autorização:** pedido do usuário para atualizar o slide em `docs/demo`, na mesma branch `feat/single-screen-observatory`/HEAD `2c424b0`, preservando todos os diffs anteriores e o favicon. Nenhuma alteração na aplicação, commit, push, merge ou deploy.
- **Entrega:** [PPTX de seis slides](../demo/earth-jukebox-demo.pptx) e README atualizados. Novas capturas mostram luzes NASA 2012 e a experiência integrada com tipografia atual; fontes/manifestos/notas distinguem a camada visual fixa de 2012 do áudio 2012/2023. Mapeamento sonoro e identificação humana pendente preservados.
- **Validação:** cópia de trabalho privada antes da edição; origem conferida por hash antes de substituir o arquivo. PowerPoint 16.0 renderizou os seis slides antes/depois; imagens finais inspecionadas. Formato 12192000×6858000 EMU (16:9), seis slides, 27 caixas de texto editáveis, Arial, zero texto fora do frame e zero objeto fora da página. Pacote final com 58 entradas únicas, separadores ZIP normalizados e 56 relacionamentos internos válidos. Cópia final idêntica por SHA-256 ao arquivo validado.
- **Limite de ambiente:** `load_workspace_dependencies`/Artifact Tool não foram disponibilizados, import `@oai/artifact-tool` indisponível e nenhuma sessão de apresentação conectada. Edição pontual do pacote Open XML preservou masters/layouts; renderização/medição usou o PowerPoint instalado, sem janela. Não foi instalado substituto. A validação de importação do Artifact Tool e o playback de slideshow não foram executados nesta revisão.
- **Continuidade:** fatia da demo em F7-04 validada tecnicamente, sem encerrar dependências/submissão. Próximo passo: revisão humana da apresentação e preenchimento da equipe/evento quando autorizado; F3-03/F5-03 para escuta e aceite assistivo. Nenhuma nova rodada Angular/áudio foi necessária porque a aplicação não mudou.

## Continuidade atual — globo NASA e tipografia, 15/11/2026

- **Branch/base:** mesma `feat/single-screen-observatory`, HEAD `2c424b0`, sobre a entrega local de tela única, preservada. Favicon humano inalterado desde a inspeção. Sem commit/push/merge/deploy.
- **Entregue:** camada opcional NASA Black Marble **2012** no Canvas2D existente, GeoTIFF WGS84/PixelIsArea validado, PNG local 1800×900/215.356 bytes e hash próprio. Consulta bilinear pela inversa ortográfica existente, rotação/zoom/hemisfério alinhados, cache único e fallback/retry. Sem transformação geográfica do áudio, textura 2023 ou luzes inventadas.
- **Tipografia:** system-ui, corpo 16 px, controles 15 px/600, labels 13 px/600, títulos 22–30 px/650–700 e coordenadas 24–26 px/600; tokens globais, sem fonte externa. Mantidos planeta central/painel/player e reflow. Foco do painel usa `afterNextRender` cancelável após falha real detectada no smoke.
- **Validação final:** build/SSR e smoke de produção aprovados; **79 Angular**, **11 Node**, smoke do globo e smoke de áudio aprovados. Três rotações/2.454 amostras, erro ≤0,5 byte; ~30 fps, p95 da superfície sem/com camada 14,8/20,0 ms. Uma requisição/decode; +14.392 bytes retidos após 40 alternâncias. Áudio 60,101 s/273 leituras/máximo 25,67 ms; um contexto/mute zero/zero vozes após Pause. Cinco larguras e reflow emulado aprovados.
- **Artefatos:** [fonte/transformação/arquivos/limites](night-lights-globe-delivery.md), [relatório do globo](evidence/night-lights-globe-2026-11-15/report.json), [relatório sonoro](evidence/night-lights-globe-2026-11-15/audio-report.json), [camada ativa](evidence/night-lights-globe-2026-11-15/globe-layer-on.png) e [320 px](evidence/night-lights-globe-2026-11-15/layout-320-closed.png). Capturas anteriores, fontes e históricos não foram apagados.
- **Preservados:** core/modelo geográfico, pipeline de áudio, assets/manifesto/hashes sonoros, configurações Angular/Firebase e package/lock. Novo raster tem manifesto separado; saída estática continua compatível com Hosting, sem backend obrigatório.
- **Próximo passo exato:** **F5-03**, zoom nativo/leitor de tela/dispositivo físico, e **F3-03**, escuta humana; revisão do diff antes de integração autorizada. F6-04 fica IN_PROGRESS apenas por esses aceites/dependências/revisão, com implementação e rodada automatizada concluídas. Não declarar acessibilidade integral ou desempenho móvel universal.
- **G-DOC:** 23 Markdown, 235 links locais válidos, 31 IDs únicos/dependências existentes/sem ciclos; históricos e UTF-8/newline preservados, diff check sem erros. A integração nativa foi consultada novamente e segue sem navegador/pipe disponível; o zoom validado é a emulação de reflow, não zoom nativo.

## Continuidade atual — experiência de tela única, 15/11/2026

- **Branch/base:** `feat/single-screen-observatory`, criada da `brain` em **`2c424b0474c7c96589d02d3db5e21a922aee258c`**. A consulta remota main/brain confirmou esse mesmo SHA; a main local divergente foi preservada. Sem commit, push, PR, merge ou deploy. Favicon humano concorrente preservado fora do escopo.
- **Autorização e estado:** a tarefa anexada autoriza implementação completa da composição integrada, testes e documentação. **F4-05 IN_PROGRESS**, dependências F4-01/F4-02/F6-01. Responsável técnico Codex; humano **UNASSIGNED**. Nenhum gate humano anterior foi encerrado pela mudança visual.
- **Entregue no código:** Index com topo compacto, planeta, painel NASA lateral em desktop/drawer compacto e player na base da mesma experiência. AudioPanel reaproveitado sem desmontar ao recolher, com imagem real, ano, loading/erro, leitura, método/créditos e todos os controles existentes. Nenhum componente excluído; antiga segunda seção inferior removida da composição.
- **Fluxo:** Listen/skip link abrem e focalizam ciência; About abre método/créditos, sem autoplay. Play revela ciência e usa o coordenador existente. Close/Escape restauram foco ao CTA. Globo fica inert sob o drawer em telas compactas; matchMedia e foco adiado têm descarte. Painéis permitem rolagem interna e reflow em alturas pequenas.
- **Ciência/arquitetura:** [estratégia B](single-screen-science.md), com TIFFs originais/PNGs e ausência de transformação geográfica conferidos. Célula/leitura vêm do evento/feature aceitos pelo PlaybackCoordinator; GlobeModel conserva exploração geográfica. Seleção do globo não determina a nota. Sem segundo motor, contexto, pipeline ou backend.
- **Preservação:** engine, loader, catálogo, extrator/mapper, PNGs, manifesto/hash/máscaras, núcleo/projeção do renderer, Firebase, package/lock e configuração de build sem diff. Dashboard continua desmontado; somente seu spec foi alinhado aos nomes pt-BR já presentes na base, preservando dez testes e 19 expectativas.
- **Validação final:** build/SSR com uma rota sem erros, bundle inicial 306,63 kB bruto/85,44 kB estimados e globo tardio 99,84 kB; **78 Angular** repetidos após foco/inert/CSS, **8 Node** e smoke final de prerender/SSR direto/HTTP/assets aprovados. Nenhum teste desabilitado.
- **Áudio/sincronização final:** smoke de navegador com contexto/osciladores reais e AnalyserNode aprovado, 60,199 s, 274 leituras e atraso máximo de 25,6667 ms. RMS 20% = 0,00440914879; 80% = 0,01763709999; mute = 0. Um contexto, até duas vozes alocadas/uma simultânea, zero após Pause. TaskDuration 1,906093 s; heap final 4.658.424 bytes, sem representar memória total ou escuta física.
- **Interface final:** 320/390/768/1280/1920 CSS px, fechado/aberto/em reprodução, altura do documento/base do player em 900 px, Shift+Tab com inert, loading/erro/recuperação, fallback, arrasto e movimento reduzido aprovados. Reflow emulado 640×450 manteve ajustes/barra alcançáveis. Capturas CDP reais inspecionadas; CUA não conectou ao navegador neste ambiente. [Relatório JSON](evidence/single-screen-2026-11-15/report.json), [desktop em reprodução](evidence/single-screen-2026-11-15/layout-1280-playing.png), [320 px fechado](evidence/single-screen-2026-11-15/layout-320-closed.png), [390 px aberto](evidence/single-screen-2026-11-15/layout-390-open.png), [reflow](evidence/single-screen-2026-11-15/reflow-200-percent-equivalent.png) e [erro](evidence/single-screen-2026-11-15/loading-error.png) preservam as evidências.
- **Gates:** G-BUILD/G-TEST/G-SYNC automatizado aprovados para a árvore final. G-AUDIO/G-A11Y/G-PERF integrais continuam pendentes pelos aceites humanos. Comandos, ambiente e resultados completos em [single-screen-delivery](single-screen-delivery.md); [quality-gates](quality-gates.md) registra o alcance da validação.
- **Fechamento documental:** G-DOC aprovado em 15/11/2026: 22 Markdown em docs/brain, 204 links locais sem destino ausente, 30 tarefas com IDs únicos/dependências existentes/sem ciclos. Os seis documentos operacionais receberam somente adições; históricos comparados integralmente com HEAD após normalizar CRLF/LF. UTF-8, newline final e git diff --check aprovados. F4-05 depende de F4-01/F4-02/F6-01 e permanece IN_PROGRESS pelos aceites humanos/revisão.
- **Próximo passo exato:** **F3-03**, escuta e ciclos humanos, e **F5-03**, leitor de tela/zoom nativo de 200%/dispositivo físico, além de revisão humana desta entrega. A rodada automática final foi concluída; não há confirmação auditiva humana nem conformidade assistiva integral. Publicação depende de autorização própria.

Os registros seguintes são preservados como histórico e não descrevem a composição atual.

## Continuidade atual — Observatório em inglês e demo

Revisão sobre `brain`/`6581f2470bbf9549e4ac02b462030e8313a94623`, em 15/11/2026. O usuário escolheu a direção **Observatório, planeta em destaque** e pediu concluir o trabalho restante possível. Equipe, autores e evento ficam pendentes por instrução explícita.

- Interface ativa, mensagens de erro/leitura, manifesto, metadados e README de entrada em inglês. Planeta primeiro; título curto, controles maiores, sem slogans/badges de MVP; detalhes científicos e créditos recolhidos no painel sonoro.
- Skip link é o primeiro foco por Tab; Enter leva e dá foco à seção de som. Seleção por destino/setas/zoom e movimento reduzido conferidos. Dez ciclos Play/Pause e troca de ano conferidos no navegador, sem substituir escuta humana.
- Build de produção aprovado, uma rota prerenderizada; **75/75 Angular**, **8/8 Node**, smoke SSR/HTTP/assets aprovado. A rodada RED observou 3 falhas esperadas das novas expectativas de idioma; a rodada final GREEN passou. O teste adicional de nome acessível da rotação também foi observado falhando nos dois estados e passou após alinhar o rótulo; nenhum teste foi desabilitado. O smoke foi adaptado ao novo título em inglês e passou sem mudar o produto para satisfazer texto antigo.
- Desktop e larguras 320/390/640 CSS px conferidos sem overflow horizontal observado. Nenhum erro/warning de console observado. Nove amostras reais de cores de texto: contraste mínimo **9,41:1**. Isso não é auditoria completa de WCAG, leitor de tela ou zoom nativo de 200%.
- Comparação da árvore sintática confirmou que extrator, loader, coordenador, motor e renderer receberam somente mudanças de texto. IDs/URLs/hashes/bytes/geometria dos frames foram preservados. Package/lock inalterados; alertas de dependências preexistentes continuam pendentes.
- Demo editável em inglês: [seis slides](../demo/earth-jukebox-demo.pptx), com capturas reais, fontes e limites. Arquivo validado estruturalmente e visualmente; identificação da equipe explicitamente pendente. Sem envio oficial ou publicação em hosting.
- Development também compilou em saída separada, sem environments privados, preservando a compilação de produção. Revisão independente identificou textos imprecisos sobre panorama e formato do arquivo e uma divergência de nome acessível; corrigidos. O último ponto recebido do globo agora é rotulado como histórico para não aparentar seleção atual após Reset.
- O pacote de produção também passou no smoke de prerender/SSR/HTTP/assets em uma pasta separada sem `node_modules`, com NODE_PATH vazio. O ZIP compilado inclui instruções para executar diretamente com Node 22, sem instalação npm.
- Próximos aceites humanos: ouvir a saída real, validar leitor de tela/zoom/dispositivo físico, revisar a origem da ideia e preencher a identificação quando houver. Publicação/submissão requerem destino e autorização específicos. Planos/evidências: [release-plan](release-plan.md) e [README em inglês](../../README.md).

## Revisão de layout anterior — histórico

## Continuidade atual — layout e fechamento NASA, 15/11/2026

- **Branch:** `brain`, revisão sobre `3b5793a6939505664f32f489b6f8eadb92525645`. O usuário autorizou corrigir o painel, conferir os requisitos NASA, fazer o plano e começar a execução. Nenhuma alteração ou push na `luiz` nesta revisão.
- **Correção:** o mundo abre a página, com link ao painel sonoro abaixo e retorno ao globo. O motor e os dados não mudaram; o texto do globo agora limita a ausência de áudio à seleção geográfica, evitando negar o áudio existente na outra seção.
- **Plano em execução:** [fechamento mínimo](finalization-plan.md). Comparativo com o site oficial em [nasa-readiness](nasa-readiness.md); texto/roteiro de demo em [inglês](submission-draft-en.md). Uso de IA declarado em `AI_USAGE.md`, metadados JSON publicados como asset e link na interface.
- **Reprodução atual:** cópia isolada no Windows, Node 22.23.5/npm 10.9.9, instalação limpa do lockfile com lifecycle scripts desativados (1.158 pacotes). Build de produção sem erro SSR, uma rota prerenderizada; Karma ChromeHeadless 157 com **74/74** e Node **8/8**. Os testes passaram antes dos ajustes finais apenas textuais de créditos/legenda; após esses ajustes foram repetidos build, smoke SSR/HTTP/assets e verificação do aplicativo compilado.
- **Navegador atual:** planeta primeiro no desktop; destino Amazônia correto; links de ida/volta; seleção 2012/2023, estado Play/Pause e mute operantes. Larguras 390 e 320 CSS px sem overflow horizontal observado. Entrada no painel por Enter verificada; nenhum erro/warning de console observado. Isso não substitui escuta humana nem auditoria completa de teclado/leitor de tela.
- **Integridade:** hashes e bytes dos dois PNGs conferem com o manifesto; package/lock e algoritmos de sonificação inalterados. Revisão independente do diff não identificou problema importante. Alertas preexistentes de dependências continuam pendentes, sem certificação de risco zero.
- **Próximo passo exato:** preparar/revisar a versão em inglês da interface e materiais vinculados; completar escuta e validação assistiva, demo final e links. O guia oficial foi lido: vídeo ≤30 s ou slides ≤7, inglês, links públicos e declaração de IA/SI. Confirmar autoria/origem da ideia e o evento/fuso da equipe. Nenhuma publicação de site, aceite de termos ou submissão oficial foi executada.

## Entrega de sonificação — registro histórico

## Continuidade atual — sonificação, 15/11/2026

- **Branch:** `feat/f3-sonification`, criada da brain limpa em `64659fba8e45fd6f635df909e69923588db92d44`; entrega local sem commit/push/merge/deploy. Não houve alteração de main ou das branches de colaboradores.
- **Autorização da sessão:** implementar F3-01/02/03 e integração mínima F4-01/02, com partes indispensáveis F2-01/02/03. As restrições “somente documentação” abaixo descrevem a sessão anterior.
- **Entregue:** dois frames anuais NASA curados, loader com SHA-256/Canvas, extrator/mapper puros, síntese Web Audio, scheduler/cancelamento, coordenador por revisão e painel montado no Index. Globo já integrado na brain por PR #6, preservado nesta implementação; pointSelected recebido sem transformar coordenadas em som.
- **Evidência atual:** build sem erros SSR, 74 testes Angular, 8 Node e smoke de produção/SSR; navegador com sinal real, dez ciclos, mute/volume, 60,616 s de amostra e sincronização máxima 25,67 ms. Fórmulas, arquivos, origem e limites em [entrega de sonificação](sonification-delivery.md).
- **Pendências:** escuta humana, validação assistiva, instalação limpa isolada e aceite integral de performance/sincronização. Não declarar MVP completo ou G-AUDIO integral.
- **Próxima tarefa exata:** F3-03, executar escuta e dez ciclos humanos conforme roteiro; continuar F4-02/F5-01/02 e reprodução F1-01. Responsáveis humanos: UNASSIGNED.

## Fechamento documental anterior — histórico preservado

- **Atualizado em:** 15/11/2026, contexto `America/Sao_Paulo`.
- **Branch de entrega:** `brain`. **Commit-base da revisão:** `6fbc52fe7a577d779315ba6e972d66350efc91df` (“Cérebro”), no qual a documentação inicial já está publicada. O commit desta revisão é o commit que contém este arquivo; não confundir a base com o HEAD posterior.
- **Escopo confirmado:** finalizar somente a documentação da `brain`. Preservar a `luiz`; não implementar dados, áudio ou integração nesta revisão.
- **Situação:** planejamento inicial e fechamento documental concluídos; F0-01/02/03 continuam DONE. F1–F7 permanecem não iniciadas nesta branch. O produto completo não está concluído.
- **Entrega de mundo disponível fora desta branch:** `luiz` / `53b577ef51789a0f7532610623af07ededee7dc1`, documentada em [entrega do mundo](world-delivery.md). Nenhum código foi integrado ou alterado naquela branch.
- **Próxima tarefa técnica recomendada:** F1-01, quando houver instrução para implementar. Conferir F7-01 com a equipe antes de afirmar prazo ou requisitos de submissão.
- **Responsáveis futuros:** UNASSIGNED; o registro por frente está em [entrega do mundo](world-delivery.md). Não foram atribuídas tarefas a colaboradores sem confirmação.

## Histórico preservado

A auditoria F0 analisou o código `aab547114375c7232807d31dbaa726c6fec0b1a2`. Ela produziu `AGENTS.md`, 13 documentos em `docs/brain/**` e o link no README raiz: 15 arquivos Markdown, depois publicados no commit `6fbc52f`. A informação anterior de que esses documentos ainda estavam “sem commit” foi corrigida.

O ambiente da F0 gerou bundles com exit 0, mas registrou `ReferenceError: window is not defined` no prerender; G-BUILD não foi aprovado. A suíte daquela execução teve 15 testes, 14 aprovados e 1 falha; G-TEST não foi aprovado. Instalação limpa e smoke manual não foram realizados na F0. Esses são resultados históricos, não checks executados novamente nesta revisão. A evidência detalhada e os limites permanecem em [estado atual](current-state.md).

## O que esta revisão fecha

1. Distingue a auditoria técnica `aab5471`, a publicação documental `6fbc52f` e a entrega separada do mundo `53b577e`.
2. Atualiza índice, estado, roadmap, fluxo de equipe, riscos e gates para separar histórico de continuidade atual.
3. Registra código, resultados anteriores e limites do mundo com links fixos ao commit, sem importar sua substituição da tela inicial.
4. Preserva a decisão 2D/Sweep da ADR 0001 e os 29 IDs existentes do roadmap; não marca integração ou sonificação como concluídas.
5. Mantém explícitas as frentes pendentes e a ausência de responsáveis humanos confirmados.

## Validação documental desta revisão

**G-DOC — APROVADO em 15/11/2026**, para esta revisão sobre `6fbc52f`: inspeção automatizada dos **16 arquivos Markdown**, **123 links locais** sem destinos ausentes, **29 tarefas** com IDs preservados e dependências existentes/sem ciclos; estados conferidos em **3 DONE e 26 NOT_STARTED**. As quatro fontes fixas da entrega do mundo foram verificadas nos objetos Git do commit `53b577e`. UTF-8, newline final e ausência de marcadores de conflito conferidos; `git diff --check 6fbc52f` limpo. Os oito arquivos alterados são apenas Markdown em `docs/brain`; nenhum arquivo de aplicação, configuração, manifest ou lockfile mudou. A referência local `luiz` permaneceu em `53b577e`.

Revisão independente somente leitura não identificou problemas importantes; a observação de registrar o resultado efetivo dos checks foi incorporada neste fechamento. A aprovação original da F0 (15 Markdown, 105 links locais e 29 tarefas) fica preservada como evidência histórica da publicação inicial, sem substituir a contagem desta revisão.

Não houve instalação, execução de código da branch, build/testes Angular, merge em main, deploy ou submissão nesta revisão. G-DOC aprova a documentação; não aprova os demais gates de produto. O [quadro de gates](quality-gates.md) preserva o baseline F0 e identifica a origem das evidências externas.

## Pendências de produto

- F1: reprodução da baseline da `brain`, configuração de ambientes, SSR e testes. Avaliar a evidência de outro commit antes de reutilizá-la.
- F2: fonte NASA qualificada, créditos, recurso real, manifesto e carregamento confiável.
- F3/F4: extração, mapeamento, áudio real e coordenação de imagem, som e leitura textual.
- F5/F6: acessibilidade e usabilidade do fluxo integrado; avaliar o mundo separado conforme F4-04/F6-02, sem antecipar aceite.
- F7: validação ponta a ponta, requisitos oficiais vigentes, publicação e demonstração. Nenhum prazo vigente, fuso da equipe ou elegibilidade é confirmado por este documento.

## Como retomar

Conferir branch/HEAD e diff atuais; ler [roadmap](roadmap.md), [riscos](risks.md), [contratos](contracts.md) e [entrega do mundo](world-delivery.md). Selecionar a tarefa autorizada com dependências atendidas e responsável confirmado. Quando houver implementação, registrar evidência no commit correspondente e atualizar estado, roadmap e handoff sem apagar a auditoria histórica.
