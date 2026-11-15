# Handoff operacional

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
