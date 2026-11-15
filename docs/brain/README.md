# Cérebro de engenharia

Documentação operacional do **The Earth Information Jukebox**. Fechamento documental em **15/11/2026**, sobre a branch `brain`, commit-base `6fbc52fe7a577d779315ba6e972d66350efc91df`. A auditoria F0 preserva o snapshot técnico `aab5471`; não representa o estado de todas as branches hoje.

O planejamento inicial está concluído. O MVP completo de dados e sonificação ainda não está implementado na `brain`. Existe uma entrega separada do mundo na `luiz`, registrada em [entrega do mundo](world-delivery.md), sem integração de código nesta atualização.

## Start here

1. Leia [AGENTS.md](../../AGENTS.md), [roadmap](roadmap.md), [riscos](risks.md), [contratos](contracts.md) e [handoff](handoff.md) antes de alterar qualquer arquivo.
2. Confira `git status --short --branch`, `git rev-parse HEAD` e os arquivos da tarefa. Este snapshot não substitui a inspeção atual.
3. Confira o [handoff atual](handoff.md) e escolha uma tarefa autorizada com dependências atendidas. A próxima tarefa técnica na `brain` é **F1-01**. Reaproveitar evidência de outra branch exige conferir o commit e o escopo; esta atualização autoriza somente documentação.
4. Registre responsável e estado, execute os critérios de aceite e atualize a evidência e o handoff.

## Índice e fontes de verdade

| Documento | Pergunta que responde |
|---|---|
| [Missão](mission.md) | Qual problema resolver e qual é o mínimo do MVP? |
| [Estado atual](current-state.md) | O que existe no código e o que foi realmente verificado? |
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
