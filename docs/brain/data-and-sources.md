# Dados e fontes

## Nova fonte visual geográfica — 15/11/2026

Para a camada do globo foi qualificado um recurso **independente**: GeoTIFF grayscale global 2012 da [NASA Earth at Night — Flat Maps](https://science.nasa.gov/earth/earth-observatory/earth-at-night/maps/). EPSG:4326/PixelIsArea, tiepoint `[0,0,0,-180,90,0]` e escala 0,1° comprovados nos metadados; derivado PNG 1800×900 a 0,2° por média exata 2×2. [Manifesto visual separado](../../public/data/globe-night-lights/manifest.json), [investigação, URLs/hashes/créditos/transformação e limites](night-lights-globe-delivery.md). Camada fixa em 2012, sem calibração física, sem vínculo sonoro com coordenadas e sem textura 2023 qualificada. Os recursos 2012/2023 do pipeline de áudio abaixo permanecem integralmente.

[Índice](README.md) · [Contratos](contracts.md) · [Roadmap](roadmap.md) · [Riscos](risks.md)

## Fonte incorporada — 15/11/2026

Snapshot da branch local **`feat/f3-sonification`**, base **`64659fba8e45fd6f635df909e69923588db92d44`**, contexto `America/Sao_Paulo`. A implementação incorpora duas imagens anuais reais; o [relatório de sonificação](sonification-delivery.md) registra arquitetura, validação e limites da entrega. O catálogo F0 abaixo permanece como histórico.

O [item SVS 5313, versão EIC](https://svs.gsfc.nasa.gov/5313/) aponta para a [visualização original SVS 5276](https://svs.gsfc.nasa.gov/5276/). A amostra local usa os TIFFs de **2012 e 2023** do [índice anual only-lights da 5276](https://svs.gsfc.nasa.gov/vis/a000000/a005200/a005276/frames/7680x4320_16x9_3p/nightlights_flat_2012-2023_only_lights/), acessado nesta execução: contém doze arquivos anuais identificáveis. A associação das médias anuais é sustentada pela página e pelo índice, com precisão de ano. A varredura sonora percorre um único ano selecionado; seu progresso é espacial.

O [manifesto de proveniência](../../public/data/night-lights/manifest.json) contém URLs exatas, hashes e bytes dos originais, créditos completos, condições de uso, transformação e máscara versionadas. O [catálogo Angular](../../src/app/sonification/scientific-catalog.ts) usa os mesmos IDs e hashes dos derivados:

| Frame / período | Recurso local | Bytes | SHA-256 do PNG |
|---|---|---:|---|
| `night-lights-2012` / média anual 2012 | [PNG 2012](../../public/data/night-lights/night-lights-2012.png) | 372.471 | `c44f5063679801ef1be704d76258558dad8078a0b273f87118d3d923f6cd5701` |
| `night-lights-2023` / média anual 2023 | [PNG 2023](../../public/data/night-lights/night-lights-2023.png) | 430.216 | `e189d5822db9515e1c4d6bc3c901fc45e2785f0243800b468342e0086aefc731` |

**Total dos dois PNGs: 802.687 bytes.** Ambos têm 2048×1152 pixels, derivados de TIFFs 7680×4320 em RGB de 16 bits por canal. A conversão comum `windows-gdi-bicubic-2048-v1` usa System.Drawing/GDI+ existente, interpolação bicúbica e PNG RGBA de 8 bits por canal. Os originais obtidos por HTTPS têm 8.982.056 e 10.896.690 bytes; seus hashes estão no manifesto. Dimensões, bytes e SHA-256 dos dois derivados foram conferidos localmente; ambos foram inspecionados visualmente.

A ROI é `(x=0, y=0, width=2048, height=1152)`. A máscara `year-label-2048-v1` exclui `(870, 680, 150, 80)`, retângulo que contém o ano impresso nos dois arquivos. A máscara representa uma exclusão gráfica; não existe máscara científica de ausência de dados. Preto pode combinar fundo, pouca luz e ausência de informação. A redução por GDI+ gera alpha parcial na borda externa; Canvas2D lê essa representação, com alpha maior que zero aceito sem ponderação de cobertura e alpha zero excluído. O domínio é brilho relativo de pixels, sem unidade física ou calibração de radiância.

Crédito do item: **NASA's Scientific Visualization Studio**. O manifesto preserva a autoria da visualização, Kel Elkins (USRA), os cientistas identificados e os créditos Black Marble/NASA Earth Observatory, Joshua Stevens e Suomi NPP VIIRS/Miguel Román. As [diretrizes NASA de mídia](https://www.nasa.gov/nasa-brand-center/images-and-media/) foram consultadas para uso educacional/informativo com atribuição e sem endosso. Não foi identificado aviso específico de copyright de terceiros para os TIFFs escolhidos na página e no índice; não se atribui licença CC0 aos arquivos.

**Evidência do carregamento:** [frame-loader.spec.ts](../../src/app/sonification/frame-loader.spec.ts), executado em 15/11/2026 sobre a base acima mais alterações locais, com Node 20.20.0, Karma 6.4.4 e Chrome Headless 157 no Windows. Comando: `ng test --watch=false --browsers=ChromeHeadless --include=src/app/sonification/frame-loader.spec.ts`; **11/11 aprovados, exit 0**. O caminho completo do PNG 2023 usa fetch, SHA-256, decode e leitura de pixels reais, sem mocks. Casos adicionais verificam 404 real, erro de rede, hash e dimensões divergentes, cancelamento, falha de decode/canvas/pixels e fechamento de bitmap. A primeira execução revelou uma expectativa incorreta de alpha opaco no canto; a expectativa foi ajustada à representação real e a execução final passou. A restrição local de `lstat` exigiu executar o runtime existente fora do sandbox; não houve instalação ou alteração de dependências.

| Pendência registrada na F0 | Situação nesta execução |
|---|---|
| Frames/datas Night Lights | Amostra anual 2012/2023 qualificada e incorporada; demais anos não incorporados. |
| Uso local e atribuição | Condições e créditos dos recursos escolhidos registrados no manifesto e na interface. |
| CORS, formatos e transferência | PNGs da mesma origem com decode/pixels reais verificados no navegador de testes; volume local medido. CORS remoto e fallback automático de rede permanecem sem validação. |
| Projeção e correspondência com o globo | A página informa mapa plano, sem transformação geográfica validada; não há adaptador latitude/longitude → pixel. |
| Áudio, sincronização e validação humana | Evidências e pendências no relatório de entrega; esta qualificação da fonte não comprova escuta humana nem aprova G-SYNC. |
| Guia de submissão e fuso da equipe | Pendências F7-01 preservadas; não foram reavaliadas nesta tarefa. |

## Catálogo F0 — histórico preservado

Consulta realizada em **15/11/2026**. Este é o catálogo de evidências externas da F0; nenhum recurso científico foi incorporado ao repositório. Uma página acessível não comprova download completo, CORS, decodificação no navegador, calibração ou adequação ao pipeline.

### Status de validação

- **VERIFIED_METADATA**: conteúdo e metadados da página oficial lidos.
- **PARTIAL_INDEXED**: informação recuperada do índice de busca oficial; leitura direta incompleta.
- **INACCESSIBLE**: tentativa de acesso falhou; motivo registrado.
- **CANDIDATE**: candidato de produto, ainda sem aprovação para o pipeline.

Esses rótulos descrevem fontes, não os estados de tarefas ou funcionalidades definidos no [estado atual](current-state.md).

### Desafio e submissão

| Fonte / organização | Conteúdo e formato | Relevância / status | Limitações e próxima ação |
|---|---|---|---|
| [The Earth Information Jukebox — NASA Space Apps 2026](https://www.spaceappschallenge.org/2026/challenges/the-earth-information-jukebox/) / NASA Space Apps | Página HTML. Resumo indexado propõe combinar frames do EIC e sonificações dinâmicas em tempo real para ampliar o acesso multissensorial à ciência da Terra. | **PARTIAL_INDEXED**; referência oficial do desafio. | Abertura direta retornou **502** repetidamente. A aba de recursos também não ficou acessível. Contexto completo, objetivos detalhados, considerações e lista integral de recursos **não verificados**. A proposta web desta equipe consta na [missão](mission.md), sem atribuí-la integralmente à NASA. |
| [Project Submission Guide](https://www.spaceappschallenge.org/resources/project-submission-guide) / NASA Space Apps | Guia oficial solicitado; formato e conteúdo atuais não recuperados. | **INACCESSIBLE**; bloqueia validação formal da submissão. | **502**. Campos obrigatórios, limites de demonstração e regras atuais sobre IA continuam pendentes. Não substituir por guias de outros anos. Reabrir e registrar requisitos em **F7-01**. |
| [Evento NASA Space Apps 2026](https://www.spaceappschallenge.org/2026/) / NASA Space Apps | Conteúdo oficial indexado informa submissão de 14/11/2026, 09h00, até **15/11/2026, 23h59, horário local**. | **PARTIAL_INDEXED**; confirma o prazo geral informado na tarefa. | Abertura direta retornou **502**. Fuso/evento atribuído à equipe: **UNKNOWN**. Conferir na conta oficial em **F7-01**, imediatamente e independentemente do desenvolvimento. O fuso do computador não comprova o fuso da submissão. |

Essas páginas são referências documentais, não recursos para fallback científico local. Não foi verificada licença específica de reprodução de seus textos.

### Catálogos oficiais

| Fonte / organização | Conteúdo / formato | Relevância | Uso e limitações | Status |
|---|---|---|---|---|
| [Earth Information Center (EIC)](https://svs.gsfc.nasa.gov/gallery/earth-information-center/) / NASA SVS | Galeria HTML de conteúdo usado no hyperwall do EIC, com links para vídeos, imagens e frames. Inclui os itens **5313** e **3912** abaixo. | Confirma vínculo dos dois candidatos ao EIC. | Selecionar recursos nas páginas individuais; a galeria não é uma API de dados. Uso local e créditos dependem do item. | **VERIFIED_METADATA** |
| [Scientific Visualization Studio](https://svs.gsfc.nasa.gov/) / NASA Goddard | Portal HTML de visualizações, animações e imagens produzidas com participação científica e dados. | Descoberta e rastreamento de proveniência. | Algumas listagens dinâmicas mostraram erro no extrator; páginas individuais estavam acessíveis. Não inferir endpoints de API. Uso local depende de cada recurso. | **VERIFIED_METADATA**, com listagens parciais |

### Candidato inicial: Night Lights

[Change in Night Lights between 2012 and 2023 — EIC Version, ID 5313](https://svs.gsfc.nasa.gov/5313/) / NASA SVS. **VERIFIED_METADATA + CANDIDATE**; publicado em 14/06/2024. Mapa plano com médias anuais de 2012–2023, seguido de comparação: mais luz em roxo, menos em laranja. A composição contém transições e zooms. A fonte identifica Black Marble, Suomi NPP e VIIRS. Crédito solicitado: **NASA's Scientific Visualization Studio**. [Fonte oficial](https://svs.gsfc.nasa.gov/5313/).

| Recurso oficial | Formato / tamanho informado | Verificação e possibilidade local |
|---|---|---|
| [Vídeo EIC](https://svs.gsfc.nasa.gov/vis/a000000/a005300/a005313/nightlights_flat_series_and_change_wZooms_13_EIC_2160p30_h265.mp4) | MP4 HEVC, 7680×2160, 32,7 MB; página também oferece MOV ProRes ~4 GB. | Link confirmado; ferramenta não reproduz MP4. Download e compatibilidade pendentes. |
| [Imagem de divulgação](https://svs.gsfc.nasa.gov/vis/a000000/a005300/a005313/nightlights_flat_series_and_change_wZooms_13_EIC.02599_print.jpg) | JPG, 1024×288. | Imagem abriu; candidata a fallback estático com crédito. |
| [Índice de frames](https://svs.gsfc.nasa.gov/vis/a000000/a005300/a005313/frames/7680x2160_32x9_30p/nightlights_2012-2023_change_flat_eic/) | Conjunto listado na página. | **403**; sequência não inspecionada. Contagens divergentes entre página e galeria; total não confirmado. |

**Decisão pendente — F2-01/F2-02:** identificar frames anuais reais e sua associação temporal. Índice de animação não comprova data científica. Sem calibração, brilho é característica de pixel, não radiância física. Uso local condicionado às diretrizes e créditos abaixo.

### Alternativa opcional: correntes oceânicas

[Global Sea Surface Currents and Temperature, ID 3912](https://svs.gsfc.nasa.gov/3912/) / NASA SVS. **VERIFIED_METADATA + CANDIDATE**; publicado em 16/03/2012. Correntes superficiais do modelo ECCO2 MIT/JPL, coloridas por temperatura; combina informações de satélite e in situ. Período declarado: **25/03/2007 12:00Z–03/03/2008 12:00Z**. Oferece vídeos MP4/WebM/M4V, imagens e frames. Crédito solicitado: **NASA/Goddard Space Flight Center Scientific Visualization Studio**. É segunda visualização opcional, sem condicionar o primeiro MVP. [Fonte oficial](https://svs.gsfc.nasa.gov/3912/).

| Recurso oficial | Formato | Verificação e possibilidade local |
|---|---|---|
| [Frames com legenda](https://svs.gsfc.nasa.gov/vis/a000000/a003900/a003912/frames/2048x1024_1x1_30p/with_colorbar/) | Índice HTML; TIFF 2048×1024, ~3 MB/frame. | Índice acessível; download integral não realizado. Planejar subconjunto convertido e documentado. |
| [Datas dos frames](https://svs.gsfc.nasa.gov/vis/a000000/a003900/a003912/flat_ecco2_dates.txt) | TXT. | Acessível; exemplo: `23000 → 2007-03-25T12:00Z`. Conferir correspondência com o conjunto selecionado. |
| [Barra de cores](https://svs.gsfc.nasa.gov/vis/a000000/a003900/a003912/sst_ecco2_cbar.png) / [imagem](https://svs.gsfc.nasa.gov/vis/a000000/a003900/a003912/flat_global_ecco2_2028x1024.25000.jpg) | PNG / JPG. | Imagens abriram; candidatas a uso local com crédito. |

**Limitações:** tamanho/formato exigem preparação; escala e composição precisam de validação antes de atribuir °C a pixels. Não inferir velocidade física das curvas desenhadas. Uso local condicionado às diretrizes e créditos abaixo.

### Condições de uso e atribuição

[NASA Images and Media Usage Guidelines](https://www.nasa.gov/nasa-brand-center/images-and-media/) é o destino oficial do link de reprodução das páginas SVS e foi lido (**VERIFIED_METADATA**). As diretrizes permitem, em geral, uso educacional/informativo de conteúdo NASA sob suas condições, pedem reconhecimento da fonte e vedam sugerir endosso. Materiais de terceiros podem exigir autorização própria; marcas e logotipos têm regras separadas. Não foi identificada uma licença CC0 específica para os candidatos. [Diretrizes oficiais](https://www.nasa.gov/nasa-brand-center/images-and-media/).

**F2-01** deve registrar a análise do recurso efetivamente escolhido, seus créditos completos e eventuais elementos de terceiros antes de incorporá-lo. A existência de um botão de download não elimina essa conferência. Fallback local legítimo deve preservar URL original, data de obtenção, crédito, condições de uso e transformações efetuadas.

### Estratégia proposta para dados e extração

Estas são recomendações de engenharia, ainda sem implementação ou validação científica:

1. **F2-01:** qualificar Night Lights como primeira opção e registrar autorização de uso/atribuição verificáveis. Manter correntes como alternativa opcional.
2. **F2-02:** construir manifesto pequeno de frames reais com origem, período, legenda, dimensões e significado. Distinguir tempo científico de posição na mídia. Recortes devem excluir textos, barras e transições da região de extração, preservando a legenda na interface.
3. **F2-03:** validar carregamento, CORS e decodificação; preparar cópia local legítima se apropriado. Arquivo remoto acessível não comprova leitura por canvas. Não contornar indisponibilidade inventando imagens ou medições.
4. Priorizar múltiplos frames científicos reais quando identificáveis. Se só uma imagem puder ser qualificada, uma varredura espacial pode explorar essa imagem; a timeline deve representar exploração, sem simular evolução temporal. Essa contingência requer decisão registrada e explicação ao usuário.
5. Registrar método, região, normalização e limitações em [contracts.md](contracts.md). Uma categoria de cor ou luminância normalizada não recebe unidade física sem calibração e proveniência verificáveis.

### Pendências que exigem evidência — snapshot F0

| Pendência | Tarefa | Evidência para encerrar |
|---|---|---|
| Desafio integral e guia 2026 não lidos | F7-01 | Acesso ao conteúdo atualizado e checklist dos requisitos aplicáveis, com URL/data. |
| Fuso/evento real da equipe desconhecido | F7-01 | Confirmação na conta oficial, com prazo registrado no fuso atribuído. |
| Frames/datas Night Lights não qualificados | F2-02 | Manifesto rastreável, amostra inspecionada e associação temporal comprovada. |
| Uso local e atribuição do recurso escolhido | F2-01 | Registro das condições e créditos, incluindo terceiros quando presentes. |
| CORS, formatos e orçamento de transferência desconhecidos | F2-03 | Teste no navegador-alvo, tamanhos reais e fallback exercitado. |

Ao atualizar este catálogo, registrar o que foi acessado, o que falhou e a evidência nova. Não promover **CANDIDATE** a fonte integrada apenas porque seus metadados foram lidos.
