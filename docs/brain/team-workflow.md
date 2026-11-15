# Fluxo de colaboração

[Índice do cérebro](README.md) · [Roadmap](roadmap.md) · [Handoff](handoff.md)

## Snapshot verificado

Inspeção local em **15/11/2026**, na branch `brain`, commit `aab547114375c7232807d31dbaa726c6fec0b1a2`. A árvore rastreada estava limpa antes da F0. Foram consultados `git status`, `git branch -avv`, `git log`, `git remote -v` e `git rev-list --left-right --count`. Não houve fetch; referências `origin/*` são cópias locais e não comprovam o estado atual do servidor.

| Branch/referência observada | Commit | Situação local |
|---|---|---|
| `brain` | `aab5471` | Branch da F0; sem upstream exibido |
| `emanuel` / `origin/emanuel` | `aab5471` | Referências coincidentes |
| `luiz` / `origin/luiz` | `aab5471` | Referências coincidentes |
| `main` | `8c391cc` | Sete commits atrás da referência local `origin/main` |
| `origin/main` | `aab5471` | Coincide com o commit analisado |
| `yanna` | `77adb7f` | Dois commits atrás da referência local `origin/yanna` |
| `origin/yanna` | `3421980` | Referência remota armazenada localmente |
| `origin/guilherme` | `82a0b87` | Sem branch local `guilherme` observada |

Remote configurado: [repositório no GitHub](https://github.com/emanuelsacoman/The-Earth-Information-Jukebox). O histórico contém merges dos PRs #1, #2 e #3. Esse histórico evidencia uso de PRs, mas não comprova revisão obrigatória, proteção de branch ou ruleset aplicado. Essas configurações permanecem **UNKNOWN** até inspeção autorizada do GitHub.

Os nomes das branches não atribuem tarefas nem comprovam disponibilidade dos colaboradores. Responsáveis não confirmados devem permanecer `UNASSIGNED` no roadmap e no registro de riscos.

## Regras de integração

- `main` é a branch de integração. Nunca editar ou integrar diretamente nela.
- Trabalhar na branch apropriada à tarefa e ao colaborador. Confirmar a branch atual antes de qualquer escrita; não trocar automaticamente uma branch que contenha trabalho alheio.
- Usar PRs pequenos, com um resultado verificável e escopo descrito. F0 não autoriza criar PR, fazer push, merge ou deploy.
- Publicação, push e merge por agentes exigem autorização explícita. Não inferir autorização a partir de um teste aprovado.
- Nunca executar force push sem autorização explícita. Não reescrever uma branch compartilhada por conveniência.
- Exigir revisão humana pelo responsável do projeto antes do merge. O agente não pode aprovar suas próprias alterações em nome de outra pessoa.
- Não afirmar que o GitHub impede uma operação apenas porque esta documentação a proíbe. São regras de equipe até comprovação técnica de sua aplicação.
- Preservar alterações locais, arquivos ignorados e trabalho concorrente. Não usar `reset --hard`, `clean`, descarte de arquivo ou resolução automática de conflitos para obter uma árvore limpa.

## Antes de iniciar uma tarefa

1. Ler [AGENTS.md](../../AGENTS.md), [roadmap](roadmap.md), [riscos](risks.md), [contratos](contracts.md) e [handoff](handoff.md).
2. Conferir `git status --short`, `git branch --show-current`, `git rev-parse HEAD` e alterações locais relevantes. O snapshot acima envelhece; reinspecionar sempre.
3. Escolher um ID estável do roadmap, confirmar autorização, dependências e critérios de aceite. Não executar uma fase futura apenas porque a anterior terminou.
4. Registrar o responsável quando confirmado e mudar a tarefa para `IN_PROGRESS`. Manter `UNASSIGNED` até existir atribuição real.
5. Coordenar arquivos e módulos com outros colaboradores antes de sobrepor alterações. Dashboard concentra muitas responsabilidades; combinações simultâneas nele exigem cuidado especial.

Um nome descritivo de branch pode incluir o ID da tarefa, mas não substituir as branches de colaboradores sem acordo. A F0 ocorre em `brain`; não há necessidade de alterar `main` para entregar os documentos.

## Atualização com a integração

As orientações abaixo se destinam a trabalhos futuros autorizados. Nenhuma atualização de branch foi executada na F0.

1. Salvar e identificar o trabalho local antes de integrar mudanças; não fazer stash automático de alterações de outra pessoa.
2. Quando o acesso remoto estiver autorizado, atualizar as referências com `git fetch origin`. Conferir a saída e comparar a branch de trabalho com `origin/main` usando `git log` e `git diff`.
3. Não usar a `main` local como base atualizada sem conferir sua relação com `origin/main`: no snapshot da F0 ela está atrasada.
4. Integrar `origin/main` na branch de trabalho pelo procedimento combinado pela equipe. Um merge preserva o histórico de uma branch compartilhada; rebase exige acordo quando reescrever commits que outros utilizam.
5. Executar as verificações pertinentes após a integração e registrar o novo commit de referência. Uma atualização pode invalidar evidências anteriores.

Evitar `git pull` sem compreender qual upstream e qual estratégia serão usados. Nenhuma estratégia de atualização autoriza sobrescrever trabalho local ou fazer push por conta própria.

## Resolução de conflitos

Interromper alterações no módulo em conflito e identificar os autores/contextos pelos diffs e histórico. Resolver cada trecho considerando os contratos e os critérios de aceite; não escolher `ours` ou `theirs` para o arquivo inteiro sem analisar o efeito. Se a intenção não puder ser deduzida, registrar a dúvida e coordenar com o colaborador responsável.

Após resolver, inspecionar o diff completo, procurar marcadores de conflito e executar as verificações afetadas. Se a integração precisar ser cancelada, fazê-lo conscientemente, preservando o estado anterior e o trabalho concorrente. Não declarar a tarefa concluída enquanto houver conflito ou validação pendente.

## Conteúdo de um PR futuro

Quando a criação estiver autorizada, descrever o problema, o comportamento resultante e o ID do roadmap. Informar arquivos/áreas afetados, evidências de validação, limitações e mudanças de decisão ou contrato. Relatar comandos que falharam e bloqueios; não apresentar somente a saída de sucesso de uma etapa parcial.

O responsável humano revisa a solução e sua evidência antes do merge. A aprovação não deve ser fabricada pelo agente. Deploy constitui uma ação separada e depende de autorização e dos gates de publicação.

## Encerramento e continuidade

Para encerrar uma tarefa relevante:

- Conferir o diff e confirmar que só o escopo autorizado foi alterado.
- Registrar comando, resultado e limitações das verificações no local adequado; aplicar [quality-gates.md](quality-gates.md).
- Atualizar [current-state.md](current-state.md) quando houver mudança de capacidade ou de baseline, distinguindo estado funcional de estado da tarefa.
- Atualizar o [roadmap](roadmap.md) com evidência de aceite. Usar `VALIDATED` quando os critérios estiverem comprovados e `DONE` apenas após validação e fechamento documental; usar `BLOCKED` com dependência identificada.
- Atualizar [risks.md](risks.md), mantendo a distinção entre problema confirmado e suspeita. Encerrar um risco exige evidência.
- Criar ou atualizar ADR em [decisions/](decisions/README.md) para decisões relevantes; registrar impactos antes de propor alteração ampla da arquitetura.
- Atualizar [handoff.md](handoff.md) com branch/commit, tarefa validada, alterações pendentes, bloqueios e próximo ID recomendado.
- Relatar ao usuário o que mudou, o que foi verificado e o que falta. Não executar commit, push, merge ou deploy implicitamente ao encerrar.

Evidência de um commit não valida automaticamente alterações posteriores ou arquivos locais ignorados. Manter o snapshot de auditoria como histórico e identificar explicitamente a referência usada pelas novas validações.
