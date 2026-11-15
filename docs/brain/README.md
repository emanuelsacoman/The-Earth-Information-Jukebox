# Cérebro de engenharia

Documentação operacional do **The Earth Information Jukebox**. A F0 prepara o trabalho; o MVP ainda não foi implementado. Snapshot técnico: **15/11/2026**, branch `brain`, commit `aab547114375c7232807d31dbaa726c6fec0b1a2`.

## Start here

1. Leia [AGENTS.md](../../AGENTS.md), [roadmap](roadmap.md), [riscos](risks.md), [contratos](contracts.md) e [handoff](handoff.md) antes de alterar qualquer arquivo.
2. Confira `git status --short --branch`, `git rev-parse HEAD` e os arquivos da tarefa. Este snapshot não substitui a inspeção atual.
3. Escolha uma tarefa autorizada com dependências atendidas. A próxima recomendada é **F1-01**; a conferência do prazo em **F7-01** é urgente e pode ocorrer em paralelo. F1–F7 exigem nova autorização de execução.
4. Registre responsável e estado, execute os critérios de aceite e atualize a evidência e o handoff.

## Índice e fontes de verdade

| Documento | Pergunta que responde |
|---|---|
| [Missão](mission.md) | Qual problema resolver e qual é o mínimo do MVP? |
| [Estado atual](current-state.md) | O que existe no código e o que foi realmente verificado? |
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
