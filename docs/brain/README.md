# Cérebro de engenharia

Documentação operacional do **The Earth Information Jukebox**. Atualização de **15/11/2026** na branch local `feat/f3-sonification`, sobre `brain`/`64659fba`. A auditoria F0 preserva o snapshot técnico `aab5471` e o fechamento documental sobre `6fbc52f`; são históricos.

O mundo já está integrado à brain pelo PR #6. A [entrega de sonificação](sonification-delivery.md) acrescenta uma fatia funcional local de dados reais, mapa e Web Audio, com testes; escuta humana, validação assistiva e outros gates ainda impedem declarar o MVP completo. Não houve publicação nesta sessão.

## Start here

1. Leia [AGENTS.md](../../AGENTS.md), [roadmap](roadmap.md), [riscos](risks.md), [contratos](contracts.md) e [handoff](handoff.md) antes de alterar qualquer arquivo.
2. Confira `git status --short --branch`, `git rev-parse HEAD` e os arquivos da tarefa. Este snapshot não substitui a inspeção atual.
3. Confira o [handoff atual](handoff.md) e escolha uma tarefa autorizada com dependências atendidas. A próxima validação é **F3-03**, escuta humana e ciclos; F1-01 continua pendente para instalação limpa. Reaproveitar evidência de outra árvore exige conferir commit e escopo.
4. Registre responsável e estado, execute os critérios de aceite e atualize a evidência e o handoff.

## Índice e fontes de verdade

| Documento | Pergunta que responde |
|---|---|
| [Missão](mission.md) | Qual problema resolver e qual é o mínimo do MVP? |
| [Estado atual](current-state.md) | O que existe no código e o que foi realmente verificado? |
| [Entrega de sonificação](sonification-delivery.md) | Quais arquivos, fórmulas, testes e limites compõem a fatia de áudio? |
| [Entrega do mundo](world-delivery.md) | O que está entregue em outra branch e o que falta integrar? |
| [Arquitetura](architecture.md) | Como evoluir o Angular sem reescrever a aplicação? |
| [Contratos](contracts.md) | Quais dados atravessam o pipeline e quais invariantes cumprir? |
| [Roadmap](roadmap.md) | Qual tarefa executar, com quais dependências e aceite? |
| [Riscos](risks.md) | O que ameaça a entrega e qual mitigação adotar? |
| [Gates de qualidade](quality-gates.md) | Que evidências permitem aprovar uma entrega? |
| [Dados e fontes](data-and-sources.md) | Quais fontes oficiais e recursos foram confirmados? |
| [Fluxo de equipe](team-workflow.md) | Como colaborar com branches, conflitos e revisão humana? |
| [Índice de decisões](decisions/README.md) | Como registrar e substituir decisões? |
| [ADR 0001](decisions/0001-mvp-scope.md) | Por que priorizar uma visualização EIC com áudio em tempo real? |
| [Handoff](handoff.md) | Onde retomar agora? |

Fatos do código ficam em `current-state`; tarefas em `roadmap`; condições de aprovação em `quality-gates`; fatos externos e limitações de acesso em `data-and-sources`. Evite copiar esses registros para vários lugares. Uma proposta arquitetural não comprova implementação; um gate definido não significa gate aprovado.
