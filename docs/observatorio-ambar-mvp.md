# Observatório Âmbar — MVP do mundo

Entrega de 15/11/2026 na branch `luiz`. Escopo: exploração livre, planeta em grafite/âmbar, seleção de coordenadas, destinos, rotação, zoom e teclado. Áudio e camadas científicas EIC não estão implementados nesta entrega. Os arquivos do dashboard da equipe foram preservados; a tela inicial do MVP monta somente o observatório, sem controles de áudio simulados.

## Arquitetura

- `globe-core.mjs`: projeção/inversão ortográfica, estado, limites e regras de seleção.
- `globe-renderer.mjs`: superfície esférica Canvas2D, mapa geográfico, gestos e lifecycle. Não usa WebGL nem biblioteca externa.
- `observatory.mjs`: interface e controles nativos do navegador. Strings estáticas e coordenadas inseridas via textContent; sem HTML remoto ou eval.
- `observatory.css`: tema isolado sob `.amber-app`.
- `planet-earth.component.ts`: wrapper Angular standalone; import tardio no navegador, execução fora do NgZone e saída `pointSelected`.
- `observatory.d.mts`: contrato de tipos da API nativa.

A mesma implementação nativa é empacotada na prévia offline; não é uma imagem nem uma maquete separada. A interface usa dados Natural Earth incorporados localmente, sem chamadas de rede em runtime. Créditos estão ao lado do renderer em `CREDITS.md`.

O boot do MVP não inicializa Firebase/Auth nem depende de arquivos environments ausentes. Dependências existentes não foram removidas/atualizadas. O bootstrap do servidor repassa `BootstrapContext` a `bootstrapApplication`, conforme a API efetivamente instalada. A configuração development não referencia mais arquivos de ambiente inexistentes. O servidor usa loopback por padrão; `HOST` permite configuração explícita em outro ambiente. A raiz é renderizada pelo CommonEngine, sem receber o cache de um ano dos arquivos estáticos.

## Validação realizada

- `node --test tests/amber-earth.test.mjs`: 8/8 testes, antes observados falhando e depois passando.
- Instalação limpa do lockfile com `npm ci --ignore-scripts --no-audit --no-fund`, sem executar lifecycle scripts. Node portátil oficial 22.23.5, npm 10.9.9. Cópia isolada em E: devido à falta de espaço em C:; nenhum runtime global foi alterado.
- Build Angular de produção: exit 0, uma rota prerenderizada, 231,33 kB iniciais / 64,14 kB estimados de transferência e chunk do observatório de 101,07 kB / 30,12 kB. Um worker foi suficiente para evitar o limite de memória do ambiente.
- Suíte Angular/Karma no ChromeHeadless 157: **17/17 testes**, incluindo emissão real de coordenadas pela saída Angular e liberação do canvas ao destruir a view.
- `node tests/production-smoke.mjs`: prerender, SSR em runtime, HTTP 200 e scripts de produção disponíveis — PASS. O teste foi observado falhando quando a raiz ainda recebia cache estático de um ano; passou após corrigir o middleware. Caminhos são convertidos com `fileURLToPath`.
- `tests/observatory-browser.html`: teste real de destinos, teclado, zoom, reset, movimento reduzido, pixels desenhados, desmontagem e remontagem — PASS.
- Prévia offline: seleção por mouse, arraste preservando seleção, seta mudando longitude em 5 graus, zoom preservando o ponto, destino/reset; conferência visual desktop e viewport de 390x844, sem overflow horizontal.
- Aplicação Angular compilada, servida em loopback: componente montado, Amazônia em 3°S/60°O, zoom 115%, reset e mobile 390x844 com exatamente um canvas e sem overflow horizontal. Console sem erros observados.
- Console da prévia sem erros observados. CSP da versão offline permite somente o script e o CSS incorporados por hashes, sem conexões de rede.
- `node --check` dos módulos e do bundle; `git diff --check`.
- Revisão estática independente: nenhum bug importante demonstrável encontrado.

## Limites

O usuário pediu concluir também build e integração Angular após a primeira prévia. Essa etapa foi executada em cópia isolada, com scripts de instalação bloqueados e servidores apenas em loopback. A instalação apresenta avisos de engines/depreciação em dependências Firebase preexistentes, não utilizadas no boot deste MVP; os alertas da auditoria anterior não foram eliminados por esta validação. Não há promessa de risco zero nem autorização implícita de publicar o servidor na internet. Gestos multitoque em aparelho real e leitor de tela ainda precisam de validação assistiva específica; não se declara conformidade integral de acessibilidade.

A prévia offline pode ser aberta diretamente no navegador; não precisa de npm, servidor ou credenciais. Código de trabalho na branch `luiz`, sobre `aab547114375c7232807d31dbaa726c6fec0b1a2`. Sem merge em main nem deploy. A publicação da branch, quando concluída, é informada na entrega com o commit remoto confirmado.
