# Instruções para agentes — Earth Information Jukebox

Missão: evoluir o Angular existente para uma experiência acessível que transforma uma visualização científica real do NASA EIC em áudio sintetizado em tempo real, com explicação e proveniência. O [cérebro de engenharia](docs/brain/README.md) é a fonte operacional de contexto; fatos devem ser conferidos no código e nas fontes citadas.

## Antes de qualquer alteração

**Leia AGENTS.md, o [roadmap](docs/brain/roadmap.md), os [riscos](docs/brain/risks.md), os [contratos](docs/brain/contracts.md) e o [handoff](docs/brain/handoff.md).** Depois leia [estado atual](docs/brain/current-state.md), [missão](docs/brain/mission.md), [arquitetura](docs/brain/architecture.md), [gates](docs/brain/quality-gates.md) e [fluxo de equipe](docs/brain/team-workflow.md); para dados científicos, leia [fontes](docs/brain/data-and-sources.md).

1. Confira `git status --short --branch`, `git rev-parse HEAD`, diffs staged/unstaged, arquivos locais/ignorados relevantes e alterações concorrentes. O snapshot documental não prova o estado presente.
2. Identifique a tarefa estável no roadmap, dependências, riscos, aceite e autorização da sessão. Registre responsável somente quando conhecido; use `UNASSIGNED` caso contrário.
3. Trabalhe apenas no escopo autorizado. A presença de uma tarefa no roadmap não autoriza executá-la. A TASK 0 autorizou **somente F0**, documentação e inspeção; não avançar automaticamente para F1.
4. Preserve alterações humanas e concorrentes. Não sobrescreva, reverta, limpe ou mova trabalho alheio para facilitar a execução. Coordene mudanças simultâneas no mesmo módulo.

## Convenções e política de alterações

- Angular standalone e TypeScript estrito existentes são a base; nomes de contratos/IDs/arquivos técnicos em inglês, documentação em pt-BR Markdown com links relativos. Seguir `.editorconfig`: UTF-8, dois espaços, newline final; TypeScript com aspas simples.
- Prefira mudanças pequenas, modulares e verificáveis, sem reescrever a aplicação. Responsabilidades da arquitetura são limites lógicos, não obrigação de criar um serviço por item.
- Não mude arquitetura ou contratos sem justificativa de impacto. Consulte [ADRs](docs/brain/decisions/README.md); registre recomendação e consequências antes de propor alterações amplas. Não trate escolha científica pendente como decidida.
- Não adicione biblioteca, backend, autenticação ou integração sem necessidade demonstrada e escopo autorizado. Não remova dependência existente apenas por suspeita.
- Separe medida física, categoria da legenda e característica de pixel. Não crie dados/datas/endpoints fictícios, nem apresente brilho de pixel como temperatura, CO₂ ou outra unidade sem calibração verificável. Exemplos/test fixtures devem ser identificados como tais.
- Não declare interface simulada, comentário TODO, teste de booleano ou provider configurado como capacidade funcional. Use a classificação e nível de evidência do [estado atual](docs/brain/current-state.md).
- APIs browser, áudio e leitura de pixels precisam de fronteira explícita com SSR, ciclo de vida e tratamento de falhas. Globo 3D e segunda visualização não bloqueiam o primeiro MVP.
- Não versionar segredos, credenciais privadas ou conteúdo de ambientes locais. Documentar configuração necessária sem divulgar valores. Falha de acesso externo deve ser registrada sem inventar conclusão.

## Validação e fechamento

Teste o comportamento alterado com os comandos existentes e os [gates](docs/brain/quality-gates.md) aplicáveis. Na F0, código não é corrigido: falhas de build/test são evidência para tarefas futuras. Não instalar dependências nem alterar manifests/configurações durante F0.

Registre data, branch/commit, ambiente, comando/roteiro, resultado e limitações. Código de saída não basta se os logs mostram erro; `playing=true` não comprova áudio. Se um check não executou, diga por quê e mantenha o gate pendente. Não declare conformidade de acessibilidade sem validação assistiva.

Ao finalizar uma tarefa relevante:

1. Confira o diff e o aceite; preserve os arquivos fora do escopo.
2. Atualize [estado atual](docs/brain/current-state.md) se o comportamento mudou, [roadmap](docs/brain/roadmap.md), [riscos](docs/brain/risks.md) e [handoff](docs/brain/handoff.md). Vincule ADR/fontes quando necessário.
3. Use `VALIDATED` após verificar o aceite e `DONE` somente quando evidências e registros estiverem concluídos. Não esconda bloqueios ou testes falhos.
4. Relate o que mudou, por quê, como foi validado, limites, pendências e próxima tarefa exata. Não apresente planejamento como implementação.

## Git e colaboração

Seguir o [fluxo de equipe](docs/brain/team-workflow.md): `main` é integração; trabalhar em branch apropriada, conferir alterações de colaboradores e preparar mudanças pequenas para revisão humana do responsável do projeto. Verifique as refs atuais antes de declarar branch atualizada. Não presumir ruleset/proteção de GitHub aplicada sem inspeção.

**Proibido:** alterar `main` diretamente; force push sem autorização explícita; sobrescrever trabalho alheio; aprovar as próprias mudanças em nome de outra pessoa; publicar, fazer push ou merge sem autorização. Preparar artefatos revisáveis antes de eventual aprovação final. Na TASK 0 também são proibidos commit de implementação, criação/merge de PR, deploy, alteração de código TS/HTML/CSS, Angular/Firebase/package/lock e regras GitHub; somente novos documentos e link mínimo no README são entrega autorizada.
