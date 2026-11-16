# Registro de riscos

## Atualização da demo — 15/11/2026

R03/R04 mitigados no material atualizado: captura e texto distinguem a camada geográfica NASA 2012 dos recursos de áudio 2012/2023; a seleção do globo não gera notas e radiância continua sem calibração. R10/R13: seis slides renderizados pelo PowerPoint e inspecionados, texto/objetos dentro das áreas e relações do PPTX válidas. R06/R11 permanecem abertos para validação humana, identificação e submissão; nenhuma certificação assistiva ou envio oficial é alegado. Ambiente sem Artifact Tool: não se repete a alegação antiga de importação por esse runtime para o PPTX atualizado. Evidência e limites em [handoff](handoff.md).

## Camada NASA/legibilidade — 15/11/2026

Branch local `feat/single-screen-observatory`, base `2c424b0`; responsáveis humanos UNASSIGNED. [Evidências e limites](night-lights-globe-delivery.md).

- **R03/R04:** MITIGADOS para a nova camada visual 2012 com GeoTIFF EPSG:4326/PixelIsArea, hash e transformação conferidos. A limitação de georreferenciamento/calibração dos recursos de áudio permanece; seleção geográfica não gera notas. Sem camada visual 2023 ou interpolação de anos. Brilho/âmbar continuam apresentação, não radiância física.
- **R05/R10:** áudio sem diff, 79 Angular/11 Node/smokes aprovados e zero vozes após Pause; escuta/conforto humanos ainda pendentes. Corrida de foco corrigida por callback após render Angular, com regressão.
- **R06/R13:** fontes maiores/mais fortes, contraste secundário elevado e cinco larguras/reflow emulado conferidos. Leitor de tela, zoom nativo e aparelho físico continuam pendentes; sem certificação WCAG.
- **R09:** raster cinza persistente limitado a 1,62 MB, bitmap/canvas temporários liberados, fetch/decode únicos; p95 da superfície 20,0 ms em ~30 fps desktop, crescimento retido de 14.392 bytes após 40 alternâncias. Perfil não mede memória total ou desempenho móvel universal. Falha de camada mantém base/seleção/zoom e permite retry, comprovada no smoke.

Nenhum risco global foi encerrado integralmente. Favicon, pipeline de áudio, manifests de build/Firebase e trabalho anterior permanecem preservados; sem publicação.

## Tela única — situação atual em 15/11/2026

Referência **`feat/single-screen-observatory`**, base **`2c424b0474c7c96589d02d3db5e21a922aee258c`**. Responsável técnico: Codex; responsáveis humanos: **UNASSIGNED**. Esta seção atualiza o subconjunto afetado por F4-05 e preserva os registros históricos seguintes. Evidências científicas em [single-screen-science](single-screen-science.md); validação final em [single-screen-delivery](single-screen-delivery.md).

| Risco | Situação, mitigação e limite atuais |
|---|---|
| R02 | MITIGADO no fluxo ativo: fronteiras browser/SSR preservadas. Novo matchMedia é restrito ao browser e remove listener no teardown; foco adiado é cancelado. Build/prerender e smoke final de SSR direto/HTTP/recursos aprovados após os últimos ajustes. |
| R03/R04 | Estratégia B evita inferência de latitude/longitude→pixel. TIFFs originais e PNGs foram revalidados por hashes/dimensões; os originais não oferecem tags GeoTIFF de transformação/CRS. Imagem, célula, leitura e explicação da independência geográfica continuam na mesma tela. Ausência científica, calibração e georreferência seguem não resolvidas. |
| R05 | Mesmo coordenador, engine, relógio e regras de cancelamento. Recolher painel não desmonta a reprodução; abrir ciência não inicia som. Smoke final de 60,199 s comprovou sinal digital, transporte, trocas e sincronização máxima de 25,67 ms, um contexto e zero vozes após Pause. Escuta/conforto humanos continuam pendentes, sem aprovação integral de G-AUDIO. |
| R06/R13 | Layout responsivo, rolagem interna, player acessível e reflow em alturas pequenas; Close/Escape restauram foco ao CTA e globo fica inert sob o drawer compacto. Cinco larguras, Shift+Tab com inert e reflow emulado 640×450 passaram na rodada final. Leitor de tela, zoom nativo de 200% e aparelho físico continuam pendentes. |
| R09 | Nenhum asset, cache, algoritmo ou renderer novo. Os recursos locais/hash e limites existentes são preservados. Smoke final: até duas vozes alocadas/uma simultânea, TaskDuration de 1,906093 s na amostra e heap final 4.658.424 bytes; não representam memória total nem performance móvel real, ainda pendente. |
| R10 | Suíte final passou com 78 Angular e 8 Node; smokes de produção e navegador aprovados após foco/inert/CSS. Foi encontrada incompatibilidade preexistente entre spec inglês e API pt-BR do Dashboard legado em HEAD; somente o spec foi alinhado, preservando dez testes/19 expectativas. Nenhum teste desabilitado. |
| R07/R12 | Firebase/configuração/caminhos estáticos preservados, sem deploy. Remotos main/brain conferidos no mesmo commit-base; main local divergente não foi alterada. Branch de tarefa isolada; favicon humano concorrente preservado fora do escopo. Revisão humana permanece necessária, sem alegar proteção GitHub ou autorização de push/merge. |

Nenhum risco foi encerrado integralmente por esta mudança visual. A decisão segura B mitiga a apresentação enganosa; não resolve a falta de georreferenciamento nem substitui os gates humanos. R01/R08/R11 e pendências de publicação/submissão não foram reavaliados fora do necessário à tarefa.

## Mitigações verificadas na fatia de sonificação — 15/11/2026

Referência `feat/f3-sonification`, árvore local sobre `64659fba`; responsáveis humanos UNASSIGNED. A tabela F0 abaixo é preservada como histórico. Evidências atuais em [entrega de sonificação](sonification-delivery.md).

| Risco | Situação atual / limite |
|---|---|
| R01 | Boot presente já dispensa environments locais; runtime explícito funciona. Instalação limpa nesta árvore não repetida: ABERTO |
| R02 | MITIGADO no fluxo montado: correção preexistente integrada pelo mundo, build e SSR atuais sem erro. Dashboard legado não montado continua com APIs browser; não generalizar para ele |
| R03/R04 | MITIGADOS no painel novo para dois PNGs reais com SHA-256, máscara, proveniência e domínio visual explícito. Catálogo legado desmontado continua mock; ausência científica e georreferência não resolvidas |
| R05 | Motor/coordenador presentes, testes de cancelamento e revisão aprovados. ABERTO até escuta humana e fechamento dos gates de áudio/sincronização |
| R06/R13 | Controles semânticos/foco/texto/sem autoplay no painel. Validação assistiva, contraste medido, zoom e aparelho real pendentes: ABERTOS |
| R08 | Providers ausentes do boot por mudança anterior; dependências duplicadas preservadas. Nenhuma auditoria de dependências nesta sessão |
| R09 | Recursos locais evitam CORS remoto; loader real verifica bytes/hash/decode/Canvas. Amostra pequena e nós limitados; G-PERF móvel e perfil integral pendentes |
| R10 | MITIGADO para comportamento automatizado da fatia: 74 testes Angular, incluindo mocks de áudio e PNG real. Mocks não comprovam audição/conforto; roteiro humano continua necessário |

R07/R11/R12 continuam abertos, sem deploy, confirmação de submissão ou inspeção de proteção remota. A densidade baixa de luz na imagem pode concentrar notas graves; isso é limitação do mapa visual, sem expandir artificialmente os dados. Não declarar riscos encerrados fora deste subconjunto.

## Snapshot F0 — histórico

Snapshot: **15/11/2026**, evidências completas em [estado atual](current-state.md) e [fontes](data-and-sources.md). Responsável de todos os riscos: **UNASSIGNED** até atribuição explícita. Severidade considera impacto no MVP; probabilidade considera recorrência/exposição. `CONFIRMADO` indica condição observada; `SUSPEITA` exige investigação. Nenhum risco foi resolvido apenas por documentá-lo.

| ID | Condição / natureza | Severidade / probabilidade | Evidência | Impacto | Mitigação / tarefa | Estado |
|---|---|---|---|---|---|---|
| R01 | Reprodução depende de runtime e ambientes locais; CONFIRMADO | Alta / alta | Shim NVM sem Node ativo; environments ignorados por `.gitignore:36`; import em `src/app/app.config.ts:7` | Outro colaborador não reproduz build/serve a partir do Git | F1-01 fixa baseline de runtime e instalação; F1-02 define configuração segura e exemplo sem segredos | ABERTO |
| R02 | API browser no SSR; CONFIRMADO | Alta / alta | `dashboard.component.ts:566` acessa window no ngOnInit; build registra ReferenceError mesmo com exit 0 | Prerender/SSR incompleto e falsa aprovação por código de saída | F1-03 isola APIs browser e testa renderização real; G-BUILD exige logs limpos e conteúdo correto | ABERTO |
| R03 | UI simulada pode parecer ciência funcional; CONFIRMADO | Alta / alta | Catálogo em `dashboard.component.ts:117–155`, datas e 100 frames de exemplo; barras CSS descritas como som real no HTML `:188` | Demonstração enganosa e perda de rastreabilidade | F2-02 substitui exemplos por manifesto real; F7-02 remove afirmações/placeholders enganosos | ABERTO |
| R04 | Frames, datas e interpretação ainda não qualificados; CONFIRMADO | Alta / alta | Índice Night Lights 403; contagens inconsistentes; nenhum asset NASA versionado; [fontes](data-and-sources.md) | Imagem decorativa ou transição tratada como observação; unidade física inventada | F2-01/02 verificam sequência, legenda, direitos e proveniência; permitir imagem real única com exploração espacial explícita | ABERTO |
| R05 | Motor/coordenação ausentes; CONFIRMADO | Alta / alta | Hooks áudio `dashboard.component.ts:623–638` vazios; `loadFrame(:611)` vazio | Não há sonificação nem sincronização demonstráveis | F3-01/02/03 e F4-01/02; eventos determinísticos, limite de vozes, pausa e descarte de cargas antigas | ABERTO |
| R06 | Acessibilidade incompleta; CONFIRMADO com impacto manual pendente | Alta / alta | Modal HTML `:371` sem trap/inert/restauração; alternativa científica ausente; teclado TS `:486–519` sem contenteditable | Fluxo inacessível por teclado/leitor; experiência depende dos sentidos | F5-01/02 fundamentais P0, F5-03 teste assistivo/contraste/reflow; limitar anúncios | ABERTO |
| R07 | Deploy não especificado/reproduzível; CONFIRMADO como lacuna | Alta / alta | `firebase.json` só rewrites no topo; `.firebaserc` ausente; sitemap/robots com website.com.br | URL pública indisponível ou configuração errada | F7-03 prepara plano e valida em ambiente autorizado; não fazer deploy em F0 | ABERTO |
| R08 | Firebase duplicado e sem uso de produto identificado; CONFIRMADO; incompatibilidade SUSPEITA | Média / média | Lockfile: Firebase direto 13.3.0, aninhado 10.14.1; providers App/Auth em app.config sem consumidor; aviso undici no build | Peso/configuração desnecessários; eventual incompatibilidade ou efeito SSR | F1-02 justifica manter/remover em tarefa autorizada; não remover por suposição | ABERTO |
| R09 | CORS, formatos e custo de processamento; SUSPEITA de runtime | Alta / média | Assets externos de grande resolução/HEVC/TIFF no [catálogo](data-and-sources.md); acesso a pixel e decodificação não testados | Canvas inacessível, falha de carregamento ou áudio interrompido | F2-03 testa origem/canvas/decode e fallback local creditado; F6-03 mede memória/CPU; cache limitado | A INVESTIGAR |
| R10 | Testes não protegem o fluxo real; CONFIRMADO | Alta / alta | 1/15 falha (`app.component.spec.ts:27`); specs do Dashboard só estado; E2E ausente | Regressão passa com booleanos corretos e silêncio/frames errados | F1-04 corrige baseline; F3/F4 adicionam verificações comportamentais; F7-02 executa roteiro real | ABERTO |
| R11 | Submissão hoje com guia indisponível/fuso da equipe desconhecido; CONFIRMADO como lacuna | Crítica / alta | Guia/desafio 502; prazo local indexado no evento oficial; fuso não consultado na conta | Perda do prazo ou material incompatível com regras vigentes | F7-01 imediatamente: conferir conta/evento/guia com equipe e registrar evidência; não inferir fuso do computador | ABERTO |
| R12 | Coordenação/automação sem proteção comprovada; CONFIRMADO como lacuna | Alta / média | `.github` ausente e ignorada por `.gitignore:40`; rulesets UNKNOWN; refs locais com branches defasadas | Sobrescrita, integração sem checks ou uso de referência antiga | [Fluxo de equipe](team-workflow.md); F1-05 propõe CI; revisão humana; nunca presumir ruleset aplicado | ABERTO |
| R13 | Reflow, contraste e camadas podem prejudicar uso; SUSPEITA | Média / média | Dashboard CSS `:35–42` height/min-height/overflow; Index CSS `:6–21` absolute/z-index; breakpoint `:924` existe | Controles cobertos/cortados em viewport/zoom específicos | F6-01 valida 320px/zoom/texto; F5-03 mede contraste e foco antes de concluir defeito | A INVESTIGAR |

## Como atualizar

Na revisão documental de 15/11/2026, nenhum risco de produto foi encerrado. A entrega externa do [mundo](world-delivery.md) não corrige o código desta branch. R11 preserva a lacuna e a referência temporal da F0; confirmar prazo e regras atuais em F7-01, sem tratar a palavra “hoje” da auditoria como informação vigente. As validações do mundo também não eliminam alertas de dependências preexistentes.

Acrescente resultado/data/commit ao risco, tarefa mitigadora e evidência verificável. Use `MITIGADO` somente quando a condição estiver tratada e validada; `ACEITO` requer decisão humana explícita e justificativa, sem encobrir gates obrigatórios. Diferencie teste que falhou de teste que não pôde executar. Novos riscos recebem IDs estáveis; não renumerar os existentes.
