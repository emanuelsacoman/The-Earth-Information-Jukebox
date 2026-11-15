# Dados e fontes

[Índice](README.md) · [Contratos](contracts.md) · [Roadmap](roadmap.md) · [Riscos](risks.md)

Consulta realizada em **15/11/2026**. Este é o catálogo de evidências externas da F0; nenhum recurso científico foi incorporado ao repositório. Uma página acessível não comprova download completo, CORS, decodificação no navegador, calibração ou adequação ao pipeline.

## Status de validação

- **VERIFIED_METADATA**: conteúdo e metadados da página oficial lidos.
- **PARTIAL_INDEXED**: informação recuperada do índice de busca oficial; leitura direta incompleta.
- **INACCESSIBLE**: tentativa de acesso falhou; motivo registrado.
- **CANDIDATE**: candidato de produto, ainda sem aprovação para o pipeline.

Esses rótulos descrevem fontes, não os estados de tarefas ou funcionalidades definidos no [estado atual](current-state.md).

## Desafio e submissão

| Fonte / organização | Conteúdo e formato | Relevância / status | Limitações e próxima ação |
|---|---|---|---|
| [The Earth Information Jukebox — NASA Space Apps 2026](https://www.spaceappschallenge.org/2026/challenges/the-earth-information-jukebox/) / NASA Space Apps | Página HTML. Resumo indexado propõe combinar frames do EIC e sonificações dinâmicas em tempo real para ampliar o acesso multissensorial à ciência da Terra. | **PARTIAL_INDEXED**; referência oficial do desafio. | Abertura direta retornou **502** repetidamente. A aba de recursos também não ficou acessível. Contexto completo, objetivos detalhados, considerações e lista integral de recursos **não verificados**. A proposta web desta equipe consta na [missão](mission.md), sem atribuí-la integralmente à NASA. |
| [Project Submission Guide](https://www.spaceappschallenge.org/resources/project-submission-guide) / NASA Space Apps | Guia oficial solicitado; formato e conteúdo atuais não recuperados. | **INACCESSIBLE**; bloqueia validação formal da submissão. | **502**. Campos obrigatórios, limites de demonstração e regras atuais sobre IA continuam pendentes. Não substituir por guias de outros anos. Reabrir e registrar requisitos em **F7-01**. |
| [Evento NASA Space Apps 2026](https://www.spaceappschallenge.org/2026/) / NASA Space Apps | Conteúdo oficial indexado informa submissão de 14/11/2026, 09h00, até **15/11/2026, 23h59, horário local**. | **PARTIAL_INDEXED**; confirma o prazo geral informado na tarefa. | Abertura direta retornou **502**. Fuso/evento atribuído à equipe: **UNKNOWN**. Conferir na conta oficial em **F7-01**, imediatamente e independentemente do desenvolvimento. O fuso do computador não comprova o fuso da submissão. |

Essas páginas são referências documentais, não recursos para fallback científico local. Não foi verificada licença específica de reprodução de seus textos.

## Catálogos oficiais

| Fonte / organização | Conteúdo / formato | Relevância | Uso e limitações | Status |
|---|---|---|---|---|
| [Earth Information Center (EIC)](https://svs.gsfc.nasa.gov/gallery/earth-information-center/) / NASA SVS | Galeria HTML de conteúdo usado no hyperwall do EIC, com links para vídeos, imagens e frames. Inclui os itens **5313** e **3912** abaixo. | Confirma vínculo dos dois candidatos ao EIC. | Selecionar recursos nas páginas individuais; a galeria não é uma API de dados. Uso local e créditos dependem do item. | **VERIFIED_METADATA** |
| [Scientific Visualization Studio](https://svs.gsfc.nasa.gov/) / NASA Goddard | Portal HTML de visualizações, animações e imagens produzidas com participação científica e dados. | Descoberta e rastreamento de proveniência. | Algumas listagens dinâmicas mostraram erro no extrator; páginas individuais estavam acessíveis. Não inferir endpoints de API. Uso local depende de cada recurso. | **VERIFIED_METADATA**, com listagens parciais |

## Candidato inicial: Night Lights

[Change in Night Lights between 2012 and 2023 — EIC Version, ID 5313](https://svs.gsfc.nasa.gov/5313/) / NASA SVS. **VERIFIED_METADATA + CANDIDATE**; publicado em 14/06/2024. Mapa plano com médias anuais de 2012–2023, seguido de comparação: mais luz em roxo, menos em laranja. A composição contém transições e zooms. A fonte identifica Black Marble, Suomi NPP e VIIRS. Crédito solicitado: **NASA's Scientific Visualization Studio**. [Fonte oficial](https://svs.gsfc.nasa.gov/5313/).

| Recurso oficial | Formato / tamanho informado | Verificação e possibilidade local |
|---|---|---|
| [Vídeo EIC](https://svs.gsfc.nasa.gov/vis/a000000/a005300/a005313/nightlights_flat_series_and_change_wZooms_13_EIC_2160p30_h265.mp4) | MP4 HEVC, 7680×2160, 32,7 MB; página também oferece MOV ProRes ~4 GB. | Link confirmado; ferramenta não reproduz MP4. Download e compatibilidade pendentes. |
| [Imagem de divulgação](https://svs.gsfc.nasa.gov/vis/a000000/a005300/a005313/nightlights_flat_series_and_change_wZooms_13_EIC.02599_print.jpg) | JPG, 1024×288. | Imagem abriu; candidata a fallback estático com crédito. |
| [Índice de frames](https://svs.gsfc.nasa.gov/vis/a000000/a005300/a005313/frames/7680x2160_32x9_30p/nightlights_2012-2023_change_flat_eic/) | Conjunto listado na página. | **403**; sequência não inspecionada. Contagens divergentes entre página e galeria; total não confirmado. |

**Decisão pendente — F2-01/F2-02:** identificar frames anuais reais e sua associação temporal. Índice de animação não comprova data científica. Sem calibração, brilho é característica de pixel, não radiância física. Uso local condicionado às diretrizes e créditos abaixo.

## Alternativa opcional: correntes oceânicas

[Global Sea Surface Currents and Temperature, ID 3912](https://svs.gsfc.nasa.gov/3912/) / NASA SVS. **VERIFIED_METADATA + CANDIDATE**; publicado em 16/03/2012. Correntes superficiais do modelo ECCO2 MIT/JPL, coloridas por temperatura; combina informações de satélite e in situ. Período declarado: **25/03/2007 12:00Z–03/03/2008 12:00Z**. Oferece vídeos MP4/WebM/M4V, imagens e frames. Crédito solicitado: **NASA/Goddard Space Flight Center Scientific Visualization Studio**. É segunda visualização opcional, sem condicionar o primeiro MVP. [Fonte oficial](https://svs.gsfc.nasa.gov/3912/).

| Recurso oficial | Formato | Verificação e possibilidade local |
|---|---|---|
| [Frames com legenda](https://svs.gsfc.nasa.gov/vis/a000000/a003900/a003912/frames/2048x1024_1x1_30p/with_colorbar/) | Índice HTML; TIFF 2048×1024, ~3 MB/frame. | Índice acessível; download integral não realizado. Planejar subconjunto convertido e documentado. |
| [Datas dos frames](https://svs.gsfc.nasa.gov/vis/a000000/a003900/a003912/flat_ecco2_dates.txt) | TXT. | Acessível; exemplo: `23000 → 2007-03-25T12:00Z`. Conferir correspondência com o conjunto selecionado. |
| [Barra de cores](https://svs.gsfc.nasa.gov/vis/a000000/a003900/a003912/sst_ecco2_cbar.png) / [imagem](https://svs.gsfc.nasa.gov/vis/a000000/a003900/a003912/flat_global_ecco2_2028x1024.25000.jpg) | PNG / JPG. | Imagens abriram; candidatas a uso local com crédito. |

**Limitações:** tamanho/formato exigem preparação; escala e composição precisam de validação antes de atribuir °C a pixels. Não inferir velocidade física das curvas desenhadas. Uso local condicionado às diretrizes e créditos abaixo.

## Condições de uso e atribuição

[NASA Images and Media Usage Guidelines](https://www.nasa.gov/nasa-brand-center/images-and-media/) é o destino oficial do link de reprodução das páginas SVS e foi lido (**VERIFIED_METADATA**). As diretrizes permitem, em geral, uso educacional/informativo de conteúdo NASA sob suas condições, pedem reconhecimento da fonte e vedam sugerir endosso. Materiais de terceiros podem exigir autorização própria; marcas e logotipos têm regras separadas. Não foi identificada uma licença CC0 específica para os candidatos. [Diretrizes oficiais](https://www.nasa.gov/nasa-brand-center/images-and-media/).

**F2-01** deve registrar a análise do recurso efetivamente escolhido, seus créditos completos e eventuais elementos de terceiros antes de incorporá-lo. A existência de um botão de download não elimina essa conferência. Fallback local legítimo deve preservar URL original, data de obtenção, crédito, condições de uso e transformações efetuadas.

## Estratégia proposta para dados e extração

Estas são recomendações de engenharia, ainda sem implementação ou validação científica:

1. **F2-01:** qualificar Night Lights como primeira opção e registrar autorização de uso/atribuição verificáveis. Manter correntes como alternativa opcional.
2. **F2-02:** construir manifesto pequeno de frames reais com origem, período, legenda, dimensões e significado. Distinguir tempo científico de posição na mídia. Recortes devem excluir textos, barras e transições da região de extração, preservando a legenda na interface.
3. **F2-03:** validar carregamento, CORS e decodificação; preparar cópia local legítima se apropriado. Arquivo remoto acessível não comprova leitura por canvas. Não contornar indisponibilidade inventando imagens ou medições.
4. Priorizar múltiplos frames científicos reais quando identificáveis. Se só uma imagem puder ser qualificada, uma varredura espacial pode explorar essa imagem; a timeline deve representar exploração, sem simular evolução temporal. Essa contingência requer decisão registrada e explicação ao usuário.
5. Registrar método, região, normalização e limitações em [contracts.md](contracts.md). Uma categoria de cor ou luminância normalizada não recebe unidade física sem calibração e proveniência verificáveis.

## Pendências que exigem evidência

| Pendência | Tarefa | Evidência para encerrar |
|---|---|---|
| Desafio integral e guia 2026 não lidos | F7-01 | Acesso ao conteúdo atualizado e checklist dos requisitos aplicáveis, com URL/data. |
| Fuso/evento real da equipe desconhecido | F7-01 | Confirmação na conta oficial, com prazo registrado no fuso atribuído. |
| Frames/datas Night Lights não qualificados | F2-02 | Manifesto rastreável, amostra inspecionada e associação temporal comprovada. |
| Uso local e atribuição do recurso escolhido | F2-01 | Registro das condições e créditos, incluindo terceiros quando presentes. |
| CORS, formatos e orçamento de transferência desconhecidos | F2-03 | Teste no navegador-alvo, tamanhos reais e fallback exercitado. |

Ao atualizar este catálogo, registrar o que foi acessado, o que falhou e a evidência nova. Não promover **CANDIDATE** a fonte integrada apenas porque seus metadados foram lidos.
