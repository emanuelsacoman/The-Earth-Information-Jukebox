# Handoff operacional

- **Atualizado em:** 15/11/2026, contexto `America/Sao_Paulo`.
- **Branch/commit de referência:** `brain` / `aab547114375c7232807d31dbaa726c6fec0b1a2`.
- **Última fase documentada:** F0; planejamento F1–F7 registrado, sem implementação.
- **Fase atual:** F0 concluída e validada; aguardando instrução para a próxima execução. F1 não iniciada/autorizada nesta execução.
- **Última tarefa validada:** F0-03 — revisão cruzada, G-DOC e fechamento deste handoff; F0-01/02/03 estão DONE. Auditoria/checks em [estado atual](current-state.md) e [dados/fontes](data-and-sources.md).
- **Próxima tarefa recomendada:** **F1-01 — estabelecer runtime e instalação limpa isolada**, após nova autorização. **F7-01** deve ser tratado em paralelo com urgência para confirmar guia, prazo e fuso da equipe.
- **Responsáveis futuros:** UNASSIGNED; nomes de branches não atribuem ownership.

## O que foi executado de fato

Auditoria de código/configuração/testes/assets e Git local, pesquisa oficial com limitações registradas, documentação do cérebro e ADR 0001. Node/npm padrão falham no shim NVM; Node 20.20.0 já instalado foi usado com PATH temporário para executar CLI local. Nenhuma instalação ou alteração global de runtime.

Build production gerou bundles/exit 0, mas registrou `ReferenceError: window is not defined` no prerender; **G-BUILD não aprovado**. Testes ChromeHeadless: **15 executados, 14 passaram, 1 falhou**, expectativa antiga de título em `src/app/app.component.spec.ts:27`; **G-TEST não aprovado**. Não houve correções, smoke manual em navegador, auditoria assistiva ou instalação limpa. Detalhes e comandos ficam em [estado atual](current-state.md).

## Bloqueios e decisões em aberto

- Runtime/configuração não reproduzíveis a partir do Git: environments locais ignorados e import fixo development; resolver F1-01/02.
- SSR incompatível com acesso a window; resolver F1-03. Teste raiz obsoleto e cobertura funcional insuficiente; F1-04/F3/F4.
- Catálogo/frames/áudio/globo ainda não conectados. Seleção final de fonte, datas, calibração e mapper não decididas; F2/F3.
- Necessidade do Firebase e estratégia SSR/hosting precisam de decisão fundamentada. Não remover integrações ou desligar SSR por iniciativa em F0.
- Desafio/guia completos retornaram 502; índice de frames Night Lights retornou 403. Prazo indexado é 15/11/2026 às 23h59 local, mas **fuso atribuído à equipe UNKNOWN**; o fuso do computador não resolve isso. F7-01 é urgente; ver [fontes](data-and-sources.md).
- Proteção GitHub não verificada, deploy não preparado nem testado. Nenhum envio/publicação autorizado nesta tarefa.

## Alterações pendentes e validação documental

Foram criados `AGENTS.md` e 13 documentos em `docs/brain/**`, ausentes antes da tarefa. O README raiz preexistente recebeu apenas a seção com links para o cérebro. São 15 arquivos de entrega locais, sem commit. `dist` e cache `.angular` são saídas ignoradas dos checks existentes. Árvore rastreada inicialmente limpa; ambientes locais e trabalho preexistente preservados.

**Validação final G-DOC — APROVADA em 15/11/2026:** revisão semântica cruzada e inspeção automatizada de **15 arquivos Markdown, 105 links locais e 29 tarefas**; nenhum link quebrado, ID duplicado, dependência inexistente ou ciclo; todos os campos operacionais presentes. UTF-8/newline final conferidos, sem marcadores de conflito ou whitespace inválido; `git diff --check` limpo. Diff de `src`, `public`, server, configurações Angular/Firebase/TS, manifests/lock, `.gitignore`, `.editorconfig` e `.vscode` vazio. Branch/HEAD permanecem `brain`/`aab5471`, `main` permanece `8c391cc`; nenhuma operação remota ou alteração de aplicação.

Limites que continuam pendentes: G-INSTALL e verificações manuais; G-BUILD/G-TEST reprovados pelos resultados acima; demais gates de produto não atendidos. A aprovação documental não aprova o MVP, o build, a publicação ou a submissão.

## Como retomar

```powershell
Get-Content -Encoding UTF8 AGENTS.md
Get-Content -Encoding UTF8 docs/brain/roadmap.md, docs/brain/risks.md, docs/brain/contracts.md, docs/brain/handoff.md
git status --short --branch
git rev-parse HEAD
git diff --stat
git diff --cached --stat
```

Conferir mudanças desde o snapshot, ler os arquivos da tarefa e confirmar seu escopo na instrução atual. Quando F1 for autorizada, começar **F1-01**, preservando o ambiente humano; validar instalação do lockfile em checkout isolado antes de concluir reprodução. Ao terminar cada tarefa relevante, registrar evidências e atualizar este handoff, roadmap e riscos.
