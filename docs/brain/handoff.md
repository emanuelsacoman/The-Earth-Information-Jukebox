# Handoff operacional

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
