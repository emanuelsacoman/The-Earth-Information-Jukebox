# Roadmap operacional F0–F7

Atualização de **15/11/2026**, árvore `feat/f3-sonification` sobre `brain`/`64659fba`. A sessão atual autoriza F3-01/02/03, integração mínima F4-01/02 e dependências mínimas F2. Implementação, comandos e limites em [entrega de sonificação](sonification-delivery.md). Responsáveis humanos permanecem **UNASSIGNED**; execução técnica por Codex. Escuta humana, instalação isolada e validações assistivas continuam pendentes; não concluir fases inteiras pela fatia implementada.

O mundo originalmente entregue em `luiz`/`53b577e` já foi integrado à brain pelo PR #6 em `64659fb`, conforme [entrega do mundo](world-delivery.md). Isso não encerra automaticamente F1, F4-04 ou F6-02: faltam os aceites completos. As evidências e os textos iniciais abaixo preservam a auditoria F0; os estados atuais incorporam somente o trabalho conferido nesta sessão.

Estados de tarefa: `NOT_STARTED` (sem execução), `IN_PROGRESS` (execução em curso), `BLOCKED` (dependência/impedimento identificado), `VALIDATED` (aceite verificado, fechamento pendente), `DONE` (aceite e registros concluídos). A matriz IMPLEMENTED/PARTIAL/MOCK/TODO/BLOCKED/UNKNOWN pertence ao [estado funcional](current-state.md), não ao andamento deste roadmap.

Cada item abaixo define prioridade, **estado inicial → atual**, dependências, responsável, entrega/área, aceite e risco. Não marcar `DONE` com gate obrigatório pendente. Definições dos gates: [quality-gates](quality-gates.md); riscos: [risks](risks.md).

## Fechamento técnico atual — Observatório em inglês

Revisão sobre `brain`/`6581f24`, autorizada pelo usuário para concluir o trabalho possível e simplificar a interface. F1-01/02/03/04 estão concluídas para a aplicação ativa: instalação limpa isolada do lockfile com scripts desativados, Node 22.23.5/npm 10.9.9, configurações development e production compiladas sem ambientes privados, SSR direto/HTTP e 75 testes Angular mais 8 Node aprovados. O boot sem Firebase e o Dashboard desmontado são decisões herdadas da entrega do mundo, preservadas e verificadas; dependências legadas não foram removidas e seus alertas continuam pendentes.

F2-03 fecha carregamento dos dois recursos locais com integridade, decode, cancelamento e erro compreensível. F3-01 fecha extração/mapeamento determinístico após F1-04; nenhuma unidade física foi acrescentada. Evidência em [handoff](handoff.md) e [plano de release](release-plan.md). O código de áudio permanece sujeito à escuta humana em F3-03. A demo de 6 slides está preparada, com identidade da equipe pendente por instrução do usuário. Publicação em hosting, aceites humanos e envio oficial não foram executados.

## Execução da sonificação — histórico de 64659fba

F2-01/02 foram concluídas para os dois frames curados, com origem/uso/transformação/manifesto/bytes/hash/dimensões conferidos. F1-01 tem somente runtime e dependências locais verificados; instalação limpa não foi repetida. As correções de boot/SSR vieram do mundo; F1-03/04 tiveram checks atuais, sem fechar suas dependências formais. F2-03, F3-01/02/03 e F4-01/02 possuem código/testes na fatia, permanecendo IN_PROGRESS pelos gates/dependências ainda pendentes. G-MAP não encerra sozinho F3-01 enquanto F1-04 não fecha. F4-03 tem volume/velocidade fundamentais cobertos em F3-03, mas seu aceite amplo não foi executado. Nenhuma fase adicional foi autorizada automaticamente.

Próxima validação: **F3-03**, escuta e dez ciclos humanos; F4-02 para fechamento da sincronização e F1-01 para reprodução isolada. F5/G-A11Y e G-PERF integral seguem pendentes. O registro histórico de caminho crítico abaixo continua referência de dependências, sem atribuir um prazo vigente.

## Caminho crítico e ordem de execução

Na auditoria F0, a primeira tarefa recomendada era F1-01; a sessão atual autorizou a fatia acima sem dispensar seus gates pendentes. **F7-01** ainda exige confirmar requisitos e prazo vigentes com a equipe. A referência temporal da F0 é histórica e não comprova elegibilidade ou prazo atual.

```text
F0-01 → F0-02 → F0-03
                   ├→ F1-01 → F1-02 → F1-03 → F1-04 ──────────────────┐
                   └→ F2-01 → F2-02 → F2-03 ─────────────┐            │
                                  └→ F3-01 → F3-02 → F3-03           │
                                                        └→ F4-01 → F4-02 → F4-03
                                                              ├→ F5-01/02
                                                              └→ F6-01
F0-03 → F7-01 (em paralelo)                               → F7-02 → F7-03 → F7-04
```

As dependências exatas estão em cada tarefa (o desenho é resumo). A **primeira demonstração funcional** exige F2-03, F3-03, F4-02 e fundamentos F5-01/02 + F6-01, além da baseline F1. F4-03 completa os controles do MVP. Revisão de qualidade/publicação/submissão segue F7. F1-05, F2-04, F4-04, F5-03, F6-02/03 não devem impedir uma demonstração mínima; partes essenciais dos gates de acessibilidade/performance continuam obrigatórias nas tarefas P0.

## F0 — Cérebro de engenharia (execução histórica)

### F0-01 — Auditar código, Git e fontes oficiais

**P0 · NOT_STARTED → DONE · Dependências: nenhuma · Responsável: UNASSIGNED.**
Entrega/área: inventário com evidências em `current-state.md` e `data-and-sources.md`. Inicial: cérebro ausente; árvore limpa em aab5471. Aceite: branch/commit/diffs/componentes/configs/assets/histórico registrados; build/test tentados e resultados reais separados de hipóteses; seis URLs solicitadas consultadas, inclusive falhas de acesso. Evidência: auditoria e checks registrados nesses documentos. Riscos: R01–R13.

### F0-02 — Definir escopo, arquitetura, contratos e trabalho colaborativo

**P0 · NOT_STARTED → DONE · Dependências: F0-01 · Responsável: UNASSIGNED.**
Entrega/área: `AGENTS.md`, índice e documentos de `docs/brain`, ADR 0001 e link mínimo no README. Inicial: nenhum cérebro versionado. Aceite: todos os arquivos exigidos presentes, pt-BR, tarefas F0–F7 com campos operacionais, contratos/invariantes e fronteira pixel/medida, riscos e política de equipe; nenhuma implementação. Riscos: R03/R04/R12.

### F0-03 — Validar documentação e fechar handoff

**P0 · NOT_STARTED → DONE · Dependências: F0-02 · Responsável: UNASSIGNED.**
Entrega/área: G-DOC e `handoff.md` fiel à execução. Inicial: sem validação documental. Aceite: links locais resolvidos, IDs únicos/dependências existentes e sem ciclos, fontes/estados coerentes, `git diff --check` limpo, diff de código/config/lock vazio e somente documentação no status; próxima tarefa identificada e relatório com limites. Riscos: R12.

**Fechamento F0 (15/11/2026):** F0-01/02/03 validadas e concluídas. Auditoria e execução de checks em `current-state.md`; revisão cruzada e validação de 15 arquivos Markdown, 105 links locais e 29 tarefas sem IDs duplicados/dependências inexistentes/ciclos; diff de código/config/manifests/lock vazio. Resultado e limites preservados em `handoff.md`. F1–F7 não iniciadas.

## F1 — Estabilização (P0)

Gate de saída: projeto executável e validável de forma reproduzível — G-INSTALL/G-BUILD/G-TEST. Auditoria F0 não executou instalação limpa nem corrigiu erros.

### F1-01 — Estabelecer runtime e instalação limpa isolada

**P0 · NOT_STARTED → DONE · Dependências: F0-03 · Responsável: Codex (validação técnica).**
Aceite atual: instalação isolada `npm ci --ignore-scripts --no-audit --no-fund`, 1.158 pacotes, runtime e lockfile preservados; builds/testes aprovados. Registro no handoff.
Entrega/área: baseline Node/npm/SO e procedimento de instalação do lockfile; README técnico e configuração de versão se autorizada. Inicial: NVM sem versão ativa no PATH; Node 20.20.0 existente usado pontualmente; node_modules prévio. Aceite: `node --version`/`npm --version` e `npm ci` em checkout isolado registrados; package/lock sem mudança involuntária; confirmar faltas de configuração para F1-02, sem expor segredos ou sobrescrever arquivos humanos. Risco: R01.

### F1-02 — Tornar configuração de ambiente reproduzível e revisar Firebase

**P0 · NOT_STARTED → DONE · Dependências: F1-01 · Responsável: Codex (validação técnica).**
Aceite atual: nenhum environment privado é importado no boot ativo. Providers Firebase removidos do boot pela entrega anterior do mundo, com dependências legadas mantidas e limites documentados. Development e production aprovados na cópia isolada sem credenciais.
Entrega/área: estratégia de ambientes/documentação segura, decisão sobre necessidade de Firebase/Auth e duplicação; `app.config.ts`, `angular.json`, `.gitignore`, environments e manifests somente se autorizados. Inicial: arquivos locais ignorados, import development fixo, providers sem uso de produto, duas versões Firebase. Aceite: clone isolado obtém configuração sem credenciais privadas; development/production usam configuração pretendida; decisão justificada antes de remover integrações/alterar dependências; G-INSTALL completo. Riscos: R01/R08.

### F1-03 — Corrigir fronteira browser/SSR

**P0 · NOT_STARTED → DONE · Dependências: F1-02 · Responsável: Codex (validação técnica).**
Aceite atual: prerender e renderer SSR direto com BootstrapContext aprovados, navegador inicializa globo e painel. Canvas/áudio iniciam apenas no browser; Dashboard legado com APIs browser permanece desmontado. Não se afirma que o módulo legado pode ser remontado no SSR sem revisão.
Entrega/área: bootstrap/URL/storage/clipboard/foco seguros no servidor; Dashboard, configs server e bootstrap. Inicial: ReferenceError `window` comprovado no prerender. Aceite: `ng build` sem esse erro; SSR/prerender contém conteúdo correto e app inicia no browser; APIs de áudio/canvas futuras ficam restritas ao browser; decisão de manter ou simplificar SSR documentada antes de mudar configuração. Risco: R02.

### F1-04 — Recuperar testes e consolidar baseline

**P0 · NOT_STARTED → DONE · Dependências: F1-03 · Responsável: Codex (validação técnica).**
Aceite atual: 75/75 Angular e 8/8 Node; regressão do nome acessível observada falhando e depois passando. Build, SSR/HTTP e conferência real de interface aprovados; aceites humanos continuam explícitos.
Entrega/área: specs relevantes e registro reproduzível de start/build/test, revisão de integrações/dependências não usadas; `src/**/*.spec.ts`, docs. Inicial: 14/15 passam, teste raiz espera título scaffold. Aceite: corrigir expectativa conforme comportamento real sem só desabilitar teste; G-TEST e G-BUILD aprovados; smoke do app; lacunas do pipeline continuam explícitas. Riscos: R02/R08/R10.

### F1-05 — Propor automação de checks

**P1 · NOT_STARTED → NOT_STARTED · Dependências: F1-04 · Responsável: UNASSIGNED.**
Entrega/área: CI pequena de instalação/build/test e tratamento da regra que ignora `.github`, se autorizado. Inicial: workflows ausentes. Aceite: workflow versionável e reproduz procedimento validado; registrar execução real quando houver autorização de push; não declarar ruleset ou revisão tecnicamente obrigatórios sem verificar. Não bloqueia demo local. Risco: R12.

## F2 — Dados científicos NASA (P0)

Gate de saída: uma visualização EIC real, identificável e creditada disponível ao pipeline, G-DATA. Qualificação da fonte pode avançar em paralelo à F1.

### F2-01 — Qualificar fonte, interpretação e condições de uso

**P0 · NOT_STARTED → DONE · Dependências: F0-03 · Responsável: UNASSIGNED.**
Entrega/área: dossiê mínimo de fonte/candidato em `data-and-sources.md`. Inicial: Night Lights e Currents confirmados na galeria; direitos específicos/frames ainda não qualificados. Aceite: consultar item oficial e condições de mídia, registrar créditos/terceiros, significado da legenda, período e limitações; justificar candidato primário Night Lights ou recomendar alternativa sem fingir validação. Riscos: R04/R11.

### F2-02 — Selecionar recursos reais e manifesto científico

**P0 · NOT_STARTED → DONE · Dependências: F2-01 · Responsável: UNASSIGNED.**
Entrega/área: pequeno conjunto curado de assets reais e ScientificRecord/ScientificFrame conforme contratos; futuro catálogo e `public` quando apropriado. Inicial: zero assets NASA; índice Night Lights inacessível; totalFrames atual é mock. Aceite: origem/hash/transformação/créditos/dimensões por arquivo; verificar datas e distinguir observação de transição/zoom; priorizar frames anuais comprovados; se inviável, imagem única com ausência temporal explícita; não fabricar datas/unidades. Riscos: R03/R04/R09.

### F2-03 — Implementar carregamento e fallback legítimo

**P0 · NOT_STARTED → DONE · Dependências: F1-03, F2-02 · Responsável: Codex (validação técnica).**
Aceite atual: PNGs locais creditados carregados e verificados por SHA-256, dimensões e Canvas; testes de erro/abort/decode e descarte de revisão obsoleta aprovados. Falha mostra erro; não é usado fallback sintético nem alegado CORS remoto validado.
Entrega/área: Records Repository/Frame Loader e estados loading/error; futuros serviços e assets, Dashboard. Inicial: loadRecords/loadFrame vazios. Aceite: seleção carrega imagem/metadados reais; testar decode, CORS e leitura de pixels; falha remota usa cópia local creditada equivalente ou erro compreensível; cancelar resultado antigo ao trocar registro; G-DATA aprovado. Riscos: R01/R04/R09.

### F2-04 — Avaliar segunda visualização

**P2 · NOT_STARTED → NOT_STARTED · Dependências: F4-02 · Responsável: UNASSIGNED.**
Entrega/área: avaliação Currents com custos, datas e legenda, ou decisão de adiar. Inicial: pesquisa oficial existe, sem integração. Aceite: antes de adicionar, cumprir mesmos contratos/G-DATA e demonstrar que não altera sentido do primeiro mapper; segunda fonte não é requisito de saída MVP. Riscos: R04/R09.

## F3 — Motor de sonificação (P0)

Gate de saída: variação da característica produz mudança sonora previsível, explicável e rastreável — G-MAP/G-AUDIO. Usar Web Audio API como primeira opção; nenhuma música de fundo substitui o pipeline.

### F3-01 — Definir e verificar extração e mapeamento

**P0 · NOT_STARTED → DONE · Dependências: F1-04, F2-02 · Responsável: Codex (validação técnica).**
Aceite atual: F1-04 e F2-02 atendidas; 11 testes de extração/mapa e comparação sintática conferem o mapeamento existente. Máscara, origem, domínio RGB e limites preservados. G-MAP não implica escuta humana.
Entrega/área: extrator/mapper puros versionados, legenda e casos de referência; futuros módulos de domínio e testes. Inicial: somente legenda textual genérica. Aceite: ROI/máscara exclui anotações/sem dados, normalização e escala documentadas; mesma entrada/config gera mesmos eventos; mínimo/médio/máximo/missing testados; pixel não vira unidade física sem calibração; G-MAP. Riscos: R04/R05/R10.

### F3-02 — Sintetizar áudio real a partir dos eventos

**P0 · NOT_STARTED → IN_PROGRESS · Dependências: F1-03, F3-01 · Responsável: UNASSIGNED.**
Entrega/área: Audio Engine browser com timbre inicial simples e envelopes. Inicial: startAudio TODO. Aceite: ação do usuário cria/retoma contexto; evento rastreável gera som audível; variação de entrada produz diferença prevista; frequência/ganho/vozes limitados; caso sem dados explícito; teste de eventos e escuta real registrados. Riscos: R05/R09.

### F3-03 — Validar transporte, parâmetros e liberação de áudio

**P0 · NOT_STARTED → IN_PROGRESS · Dependências: F3-02 · Responsável: UNASSIGNED.**
Entrega/área: play/pause/resume, volume/mute/velocidade e teardown no motor. Inicial: pauseAudio/applySoundSettings vazios. Aceite: pausa cancela scheduling e preserva posição; mute/volume atuam no ganho; velocidade tem semântica definida; 10 ciclos/trocas sem sobreposição/clipping/fontes órfãs; G-AUDIO. Riscos: R05/R09.

## F4 — Integração de ponta a ponta (P0)

Gate de saída: usuário relaciona a mudança visual ao som real — G-SYNC, com imagem, leitura e controles no mesmo estado.

### F4-01 — Conectar seleção, carregamento e visualização 2D

**P0 · NOT_STARTED → IN_PROGRESS · Dependências: F2-03, F3-03 · Responsável: UNASSIGNED.**
Entrega/área: Playback Coordinator e Visualization Adapter incrementais; Dashboard/Index e serviços necessários. Inicial: estado concentrado, componentes irmãos sem comunicação. Aceite: único record/frame confirmado; loading/erro bloqueia play inválido; troca em carga descarta resposta antiga e áudio anterior; imagem e metadados vêm do mesmo manifesto; sem dependência de globo. Riscos: R03/R05/R09.

### F4-02 — Integrar Sweep, timeline e leitura atual

**P0 · NOT_STARTED → IN_PROGRESS · Dependências: F4-01, F3-01 · Responsável: UNASSIGNED.**
Entrega/área: percurso selecionar→play→pausa→seek, cursor visual, evento/feature/texto corrente. Inicial: booleano/índice e reading `?`, sem clock. Aceite: G-SYNC com pausa/retomada/seek/troca durante carga; timeline científica só se houver frames datados, varredura espacial rotulada separadamente; legenda explica som e fonte; execução básica repetível. Riscos: R04/R05/R10.

### F4-03 — Conectar configurações musicais reais

**P0 · NOT_STARTED → NOT_STARTED · Dependências: F4-02 · Responsável: UNASSIGNED.**
Entrega/área: controles de volume/velocidade/escala/timbre suportados entre Dashboard e engine. Inicial: UI altera somente propriedades. Aceite: cada controle exposto afeta som conforme legenda sem quebrar sincronização; opções não implementadas removidas/desabilitadas com motivo; presets extras não bloqueiam MVP; testar limites e mudança durante play. Riscos: R03/R05/R10.

### F4-04 — Exploração pontual quando viável

**P1 · NOT_STARTED → NOT_STARTED · Dependências: F4-02, F5-01 · Responsável: UNASSIGNED.**
Entrega/área: Explore por mouse/toque/teclado com a mesma feature/legenda, ou adiamento explícito. Inicial: cursor matemático sem dado/globo. Aceite: coordenadas da imagem bem definidas; só mostrar lat/lon quando georreferência comprovada; todos dispositivos selecionam ponto equivalente; não bloquear Sweep. Riscos: R04/R06.

## F5 — Acessibilidade (P1; fundamentos P0)

Gate de saída: informação científica não depende exclusivamente da visão ou audição — G-A11Y. Fundamentos acompanham a primeira integração.

### F5-01 — Garantir operação por teclado e foco

**P0 · NOT_STARTED → NOT_STARTED · Dependências: F4-01 · Responsável: UNASSIGNED.**
Entrega/área: modal, foco visível, navegação/atalhos e erros; Dashboard TS/HTML/CSS. Inicial: estrutura parcial, modal sem contenção/restauração, contenteditable desprotegido. Aceite: percurso sem mouse, foco contido/restaurado no modal, controles nomeados também no mobile, atalhos não interferem em edição/seleção/teclas nativas; registrar roteiro e versões. Riscos: R06/R13.

### F5-02 — Entregar alternativa textual e leitura assistiva

**P0 · NOT_STARTED → NOT_STARTED · Dependências: F3-01, F4-02 · Responsável: UNASSIGNED.**
Entrega/área: resumo de fonte/frame/feature/evento, legenda e anúncios controlados. Inicial: valores `?` e animação decorativa. Aceite: leitor anuncia seleção/loading/erro/play sem excesso de notas; pessoa sem áudio lê interpretação equivalente; sem imagem entende legenda e opera fluxo; barras só alegam acompanhar áudio se análise real; G-A11Y fundamental. Riscos: R03/R06.

### F5-03 — Auditar contraste, movimento e experiência assistiva

**P1 · NOT_STARTED → NOT_STARTED · Dependências: F5-01, F5-02, F6-01 · Responsável: UNASSIGNED.**
Entrega/área: relatório manual e correções observadas, CSS e alternativas. Inicial: controles de contraste/texto/movimento existem, sem validação. Aceite: medir contraste/reflow/zoom e reduced-motion; testar leitor em desktop e fluxo móvel; diferenças e limites registrados. Falhas fundamentais encontradas tornam-se P0 antes de G-DEMO. Riscos: R06/R13.

## F6 — Globo e refinamento visual (P2; usabilidade essencial P0)

Gate de saída: visualização ajuda a interpretar ciência sem comprometer desempenho. 3D nunca bloqueia MVP 2D.

### F6-01 — Verificar usabilidade 2D e responsividade essencial

**P0 · NOT_STARTED → NOT_STARTED · Dependências: F4-01 · Responsável: UNASSIGNED.**
Entrega/área: layout funcional de imagem/controles/texto em Dashboard/Index. Inicial: CSS mobile existe; camadas/alturas sem QA visual. Aceite: 320px, desktop, zoom 200%/texto grande sem controle essencial inacessível; imagem não encobre foco/legenda; erros/loading compreensíveis; medir amostra de performance do fluxo mínimo. Riscos: R06/R09/R13.

### F6-02 — Avaliar/integrar globo somente com justificativa

**P2 · NOT_STARTED → NOT_STARTED · Dependências: F7-02 · Responsável: UNASSIGNED.**
Atualização atual: o [Observatório Âmbar](world-delivery.md) já foi integrado à brain em 64659fb, antes desta sessão. A prioridade 2D/Sweep da ADR 0001 permanece e orienta o painel de áudio. A integração preexistente não aprova os critérios científicos, de fallback e desempenho desta tarefa.
Entrega/área: decisão custo/benefício e, se autorizada, evolução de PlanetEarth. Inicial: componente vazio e handlers TODO. Aceite: rotação/zoom reais e teclado alternativo; dado geográfico corresponde à textura/posição, nenhum lat/lon inventado; fallback 2D preservado; medições CPU/GPU. Pós-MVP por padrão. Riscos: R04/R09/R13.

### F6-03 — Refinar animação e desempenho medido

**P2 · NOT_STARTED → NOT_STARTED · Dependências: F4-02, F6-01 · Responsável: UNASSIGNED.**
Entrega/área: perfil e otimizações justificadas de cache/resolução/animação, sem reescrita preventiva. Inicial: animação decorativa CSS; custo do pipeline desconhecido. Aceite: comparar antes/depois no mesmo dispositivo e amostra, respeitar movimento reduzido e G-PERF; se surgir falha que bloqueia áudio/interação, tratá-la como P0 antes de publicar. Riscos: R09/R13.

## F7 — Validação, demonstração e submissão (P0)

Gate de saída: aplicação demonstrável e material com links/fontes/explicações verificáveis, conforme guia vigente. Autorização de deploy/submissão deve ser explícita.

### F7-01 — Confirmar prazo, fuso e requisitos oficiais imediatamente

**P0 · NOT_STARTED → NOT_STARTED · Dependências: F0-03 · Responsável: UNASSIGNED.**
Entrega/área: checklist datado do guia e conta/evento da equipe em `data-and-sources.md`/handoff. Inicial: páginas completas 502, resumo/prazo via índice oficial, fuso da equipe UNKNOWN. Aceite: equipe confirma fuso atribuído e deadline; registrar fonte/data/requisitos de campos, links, demo, IA e dados; se acesso continuar bloqueado, indicar responsável humano e lacuna sem inventar regra. Executar em paralelo à F1/F2 assim que autorizado. Risco: R11.

### F7-02 — Validar MVP integrado e remover alegações enganosas

**P0 · NOT_STARTED → NOT_STARTED · Dependências: F1-04, F4-03, F5-01, F5-02, F6-01 · Responsável: UNASSIGNED.**
Entrega/área: relatório de regressão/ciência/a11y/performance e UI sem placeholders enganosos. Inicial: mocks e falhas de baseline documentados. Aceite: G-INSTALL/BUILD/TEST/DATA/MAP/AUDIO/SYNC/A11Y/PERF aprovados para escopo mínimo; repetir fluxo e erro/fallback, conferir créditos e limites; não aprovar pelo estado booleano. Riscos: R01–R10/R13.

### F7-03 — Preparar e executar publicação autorizada

**P0 · NOT_STARTED → NOT_STARTED · Dependências: F7-01, F7-02 · Responsável: UNASSIGNED.**
Entrega/área: plano/configuração de hosting, README público, URL real, robots/sitemap e smoke. Inicial: configuração incompleta, domínio de exemplo, deploy não testado. Aceite: resultado revisável pronto antes de solicitar autorização final de publicação; depois da autorização, G-PUBLISH com HTTPS/assets/fallback/SSR conforme decisão; registrar URL e limitações; não criar merge/push/deploy sem autorização correspondente. Riscos: R02/R07/R11/R12.

### F7-04 — Preparar demonstração e pacote de submissão

**P0 · NOT_STARTED → NOT_STARTED · Dependências: F7-01, F7-02, F7-03 · Responsável: UNASSIGNED.**
Entrega/área: roteiro/demonstração, README final e texto em inglês com fontes/créditos/IA/limitações. Inicial: nenhum material específico versionado. Aceite: outro colaborador executa G-DEMO; links públicos abrem em sessão limpa; guia vigente conferido; pacote pronto para revisão humana e submissão somente se autorizada; confirmar recibo/status oficial se envio for autorizado. Riscos: R04/R07/R11.

## Atualização de tarefas

Antes de começar, reinspecionar Git/código e registrar responsável explícito, data e estado. Dependência pendente impede validar a tarefa; se a execução não puder avançar, registrar `BLOCKED`, motivo e ação de desbloqueio. Ao concluir, adicionar comando/roteiro/resultado/commit, atualizar riscos e handoff e só então `DONE`. Não apagar a evidência inicial nem renumerar IDs. Reordenar tarefas exige atualizar dependências/caminho crítico; mudança de escopo relevante exige ADR.
