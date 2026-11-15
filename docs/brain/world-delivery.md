# Entrega do mundo — Observatório Âmbar

## Estado atual — 15/11/2026

O globo **já foi integrado à `brain`** pelo commit **`64659fba8e45fd6f635df909e69923588db92d44`**, merge do PR #6 da `luiz`, conforme histórico Git inspecionado nesta execução. Essa é a base da branch local **`feat/f3-sonification`**. O registro abaixo descreve a entrega anterior à integração e permanece preservado como histórico.

Nesta entrega de sonificação, o wrapper Angular e os módulos de renderização do globo permanecem sem alterações contra a base. Rotação, zoom, teclado, Canvas2D e recursos Natural Earth existentes foram preservados. O [Index](../../src/app/view/index/index.component.html) monta o novo painel de áudio e encaminha `pointSelected` ao Playback Coordinator pelo evento Angular existente; não houve reescrita do observatório.

A seleção geográfica é recebida e validada pelo coordenador, mas não produz evento sonoro científico: os PNGs NASA selecionados não possuem uma transformação geográfica validada para pixels. O globo continua como exploração visual independente, enquanto o áudio usa Sweep 2D na imagem anual aceita. Natural Earth continua sendo a base geográfica do observatório; a proveniência das imagens NASA está no [manifesto](../../public/data/night-lights/manifest.json) e no [registro de fontes](data-and-sources.md).

O [relatório de sonificação](sonification-delivery.md) registra as novas evidências e os gates pendentes. A integração do evento, os testes automatizados e a preservação dos arquivos do globo não comprovam escuta humana, conformidade assistiva ou aprovação de G-SYNC. Responsáveis humanos pelas próximas validações permanecem **UNASSIGNED**. Não houve push, merge ou deploy nesta execução.

## Registro histórico anterior à integração

Registro documental de **15/11/2026**. Código de referência: `luiz` / **`53b577ef51789a0f7532610623af07ededee7dc1`**. A presente atualização altera somente documentos da `brain`; não copia, modifica ou integra o código da `luiz`.

### Entrega disponível

Exploração livre da Terra em grafite e âmbar, com rotação, zoom, seleção de coordenadas, destinos e controles de teclado. O globo usa projeção ortográfica em Canvas2D e polígonos Natural Earth incorporados localmente; não depende de WebGL ou de rede em runtime. O wrapper Angular publica `pointSelected` e restringe a inicialização do canvas ao navegador.

Fontes inspecionadas no commit fixo:

- [Relatório técnico e validação da entrega](https://github.com/emanuelsacoman/The-Earth-Information-Jukebox/blob/53b577ef51789a0f7532610623af07ededee7dc1/docs/observatorio-ambar-mvp.md).
- [Componente Angular](https://github.com/emanuelsacoman/The-Earth-Information-Jukebox/blob/53b577ef51789a0f7532610623af07ededee7dc1/src/app/view/screen-components/planet-earth/planet-earth.component.ts).
- [Créditos geográficos](https://github.com/emanuelsacoman/The-Earth-Information-Jukebox/blob/53b577ef51789a0f7532610623af07ededee7dc1/src/app/view/screen-components/planet-earth/CREDITS.md).
- [Teste de produção e SSR](https://github.com/emanuelsacoman/The-Earth-Information-Jukebox/blob/53b577ef51789a0f7532610623af07ededee7dc1/tests/production-smoke.mjs).

### Evidências e limites

O relatório daquela entrega registra instalação isolada do lockfile com lifecycle scripts desativados, Node 22.23.5/npm 10.9.9, build de produção com uma rota prerenderizada, 17 testes Angular e 8 testes Node aprovados, smoke de SSR/HTTP e verificação da aplicação compilada em navegador e viewport móvel 390×844. São resultados da entrega do mundo, não uma nova execução nesta revisão documental e não uma validação do pipeline científico.

Áudio e camadas científicas EIC não fazem parte dessa implementação. Natural Earth serve como base geográfica, não como fonte de dados científicos NASA. O relatório mantém pendentes a validação assistiva específica e os gestos multitoque em aparelho real; também registra alertas preexistentes de dependências. Não há certificação de segurança, acessibilidade integral ou deploy público.

### Relação com o plano da equipe

A [ADR 0001](decisions/0001-mvp-scope.md) continua priorizando uma visualização EIC real em 2D com Sweep e sonificação. O mundo entregue é um candidato separado para evolução da exploração livre. Nenhuma mudança dessa prioridade está sendo aprovada aqui.

| Frente | Situação nesta revisão | Responsável pela próxima implementação |
|---|---|---|
| Mundo visual | Entrega existente em `53b577e`, fora da `brain` | UNASSIGNED para integração |
| Dados NASA e manifesto | Não implementados na `brain`; F2 | UNASSIGNED |
| Extração e áudio | Não implementados na `brain`; F3 | UNASSIGNED |
| Coordenação e controles | Não implementados de ponta a ponta; F4 | UNASSIGNED |
| Acessibilidade e validação integrada | Pendentes; F5/F6/F7 | UNASSIGNED |

Os responsáveis humanos não foram confirmados nesta instrução. O agente desta atualização mantém apenas a documentação; não assume a execução dessas frentes.

Para aproveitar o mundo em uma implementação futura autorizada, revisar o diff completo: a entrega também altera boot, SSR e tela inicial para montar somente o observatório. Não importar essas decisões automaticamente para o MVP integrado. O evento `pointSelected` precisa de um adaptador para os [contratos](contracts.md): coordenada geográfica não equivale a pixel científico sem projeção e georreferência verificadas. O coordenador deve preservar IDs de registro/frame e `sessionRevision`, sem criar um segundo estado de reprodução.

O [roadmap](roadmap.md) mantém F4-04 e F6-02 não iniciadas na `brain`: faltam integração, dado científico correspondente, fallback e as validações de aceite. As evidências de F1 obtidas no outro commit são insumos para revisão, sem aprovação automática desta baseline.
