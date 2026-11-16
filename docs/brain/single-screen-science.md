# Tela única — decisão de integração científica

## Referência e decisão

Inspeção em **15/11/2026**, contexto `America/Sao_Paulo`, branch **`feat/single-screen-observatory`**, base **`2c424b0474c7c96589d02d3db5e21a922aee258c`** da `brain`. Execução técnica: Codex; revisão humana: **UNASSIGNED**. A tarefa atual autoriza reunir globo, imagem NASA, leitura e controles na mesma experiência, preservando o motor e os contratos. Os registros históricos em [sonification-delivery](sonification-delivery.md) e [world-delivery](world-delivery.md) permanecem válidos para seus commits, sem provar o estado desta entrega.

**Adotar a estratégia B:** manter a varredura espacial dos PNGs NASA existentes dentro de um painel contextual da mesma tela do globo. Não associar seleções de latitude/longitude a notas ou regiões dos PNGs. A inspeção não encontrou evidência suficiente para validar a transformação exigida pela estratégia A.

Esta decisão preserva a prioridade de imagem científica real e Sweep da [ADR 0001](decisions/0001-mvp-scope.md). A composição muda; as fronteiras entre `PlaybackCoordinator`, `GlobeModel`, extração, mapeamento e áudio permanecem. Não há mudança de fonte, calibração, contrato ou algoritmo para obter o novo layout.

## Evidência das fontes oficiais

| Fonte consultada | Evidência observada | Limite da evidência |
|---|---|---|
| [SVS 5276](https://svs.gsfc.nasa.gov/5276/) | Descreve médias anuais de 2012–2023 em mapa plano e oferece o conjunto anual only-lights usado pelo projeto. | Não informa projeção, datum, extensão geográfica, pontos de controle ou transformação dos TIFFs selecionados. |
| [SVS 5313 — versão EIC](https://svs.gsfc.nasa.gov/5313/) | Identifica a SVS 5276 como versão original; sua própria composição usa proporção panorâmica para o EIC. | Não fornece georreferenciamento dos derivados locais da 5276. |
| [Índice anual only-lights](https://svs.gsfc.nasa.gov/vis/a000000/a005200/a005276/frames/7680x4320_16x9_3p/nightlights_flat_2012-2023_only_lights/) | Lista doze TIFFs, com anos de 2012 a 2023; os dois arquivos escolhidos continuam disponíveis. | O índice inspecionado não lista world file, arquivo de projeção ou outro sidecar geográfico. Isso não prova a inexistência de metadados fora das fontes consultadas. |
| [API de metadados da 5276](https://svs.gsfc.nasa.gov/api/5276/) | Fornece descrição e metadados de mídia. | A consulta não identificou uma transformação geográfica aplicável aos TIFFs usados. |
| [SVS 5475 — alternativa SOS](https://svs.gsfc.nasa.gov/5475/) | Declara explicitamente uma representação equiretangular para recursos próprios de 4096×2048 e 2048×1024. | São outros arquivos e outra composição. Essa declaração não valida a projeção dos PNGs atuais de 2048×1152 nem autoriza substituir o pipeline nesta tarefa. |
| [SVS Image Server — projeções](https://svs.gsfc.nasa.gov/documents/arch_6.html) | Documenta projeção equiretangular/WGS84 e bounding boxes para o serviço WMS. | O escopo é o Image Server/WMS; não foi estabelecido vínculo entre uma camada WMS e os TIFFs desta curadoria. Não generalizar a todos os arquivos SVS. |

O formato 16:9 e a aparência de mapa não comprovam projeção, extensão, recortes ou posição de meridianos. A conclusão de insuficiência de evidência é uma decisão de engenharia para estes recursos, não uma afirmação de que a NASA não possui georreferenciamento em outras fontes.

## Inspeção dos arquivos originais e locais

Ambiente: Windows/PowerShell, Node **24.22.2** existente, sem instalar dependências. Os originais foram obtidos por HTTPS somente em memória, com `fetch` e timeout, e analisados como TIFF clássico. SHA-256 calculado com `node:crypto`; dimensões locais lidas do cabeçalho IHDR dos PNGs. Nenhum recurso foi substituído ou regravado.

| Ano | Recurso | Dimensões | Bytes | SHA-256 verificado |
|---|---|---|---:|---|
| 2012 | [TIFF original](https://svs.gsfc.nasa.gov/vis/a000000/a005200/a005276/frames/7680x4320_16x9_3p/nightlights_flat_2012-2023_only_lights/nightlights_flat_series_stills_8k_only_lights.2012.tif) | 7680×4320 | 8.982.056 | `f03753c231cc24a0c45cc376304af4761e52a02d67c86c6e5dda6851d8111c6c` |
| 2023 | [TIFF original](https://svs.gsfc.nasa.gov/vis/a000000/a005200/a005276/frames/7680x4320_16x9_3p/nightlights_flat_2012-2023_only_lights/nightlights_flat_series_stills_8k_only_lights.2023.tif) | 7680×4320 | 10.896.690 | `2ce960101d4a8c2dbbdb78d9c0624f608c9fe920652764e5c1f6ad24076b2734` |
| 2012 | [PNG local](../../public/data/night-lights/night-lights-2012.png) | 2048×1152 | 372.471 | `c44f5063679801ef1be704d76258558dad8078a0b273f87118d3d923f6cd5701` |
| 2023 | [PNG local](../../public/data/night-lights/night-lights-2023.png) | 2048×1152 | 430.216 | `e189d5822db9515e1c4d6bc3c901fc45e2785f0243800b468342e0086aefc731` |

Os hashes e tamanhos coincidem com o [manifesto existente](../../public/data/night-lights/manifest.json). A escala espacial documentada da conversão é `4/15` nos dois eixos, sem recorte; isso preserva uma correspondência entre pixels do original e do derivado, mas não cria correspondência geográfica.

Os dois TIFFs retornaram HTTP 200, byte order `II`, magic `42`, um IFD e a mesma lista de 17 tags:

```text
256 257 258 259 262 266 273 274 277 278 279 284 297 317 318 319 338
```

Não estão presentes as tags `ModelPixelScale` (33550), `ModelTiepoint` (33922), `ModelTransformation` (34264), `GeoKeyDirectory` (34735), `GeoDoubleParams` (34736) ou `GeoAsciiParams` (34737), usadas para declarar referência/transformação em [GeoTIFF 1.1 — OGC](https://docs.ogc.org/is/19-008r4/19-008r4.html). Não existe `ImageDescription` (270) nesses IFDs. Portanto, os bytes inspecionados não fornecem um CRS e uma transformação raster→modelo utilizáveis para a estratégia A.

Observação de formato: ambos declaram `BitsPerSample=[16,16,16,16]`, `SamplesPerPixel=4` e `ExtraSamples=2`. O registro histórico “RGB 48 bits” descreve os três canais de cor, mas omite a quarta amostra. Os derivados existentes e sua política de alpha são a entrada efetiva do extrator; esta tarefa não modifica a transformação, o manifesto ou os resultados sonoros por essa observação.

Para repetir a verificação, obter os dois URLs originais acima e conferir SHA-256 antes de interpretar as tags: ler o offset do primeiro IFD nos bytes 4–7 em little-endian, o número de entradas de 16 bits nesse offset, cada entrada de 12 bytes e o ponteiro para o próximo IFD. Comparar a lista de tags com as seis tags geográficas acima. Para os PNGs locais, conferir SHA-256 e largura/altura nos offsets 16/20 do IHDR. Uma análise visual isolada não substitui esse procedimento nem valida pontos geográficos.

A primeira tentativa pelo shim `node` falhou porque não havia versão ativa no NVM. O runtime explícito funcionou; o primeiro `fetch` sob restrição de rede falhou, e a leitura externa autorizada fora do sandbox retornou os dois arquivos completos. Não houve alteração global do NVM, arquivos temporários de dados científicos ou instalação.

## Impactos e invariantes da interface integrada

1. O globo continua usando a geografia Natural Earth, rotação, zoom, destinos, teclado, fallback e descarte existentes. Seu marcador comunica somente seleção geográfica.
2. O painel NASA exibe a imagem do ano efetivamente aceito pelo `PlaybackCoordinator`, o estado de carregamento, a célula da feature atual e sua leitura. O marcador fica no domínio de pixels da imagem NASA.
3. O player envia comandos ao coordenador existente. Abrir ou recolher painéis não cria outro `AudioContext`, outro scheduler ou uma cópia do estado sonoro no módulo nativo do globo.
4. A interface pública deve manter uma explicação em inglês, por exemplo: “Globe selection does not control the sound. Listen to the highlighted region in the NASA image.”
5. Ano é seleção entre duas médias anuais. Seek indica posição espacial em uma imagem; não representa tempo de observação, trajetória geográfica ou mudança anual contínua.
6. O som descreve brilho relativo de RGB codificado. Não representa radiância calibrada, temperatura, população, concentração ou uma propriedade acústica da Terra.
7. Preservar a grade 24×8, a exclusão gráfica do ano `(870,680,150,80)`, a ROI completa, o tratamento de alpha e os IDs/versionamentos do extrator e mapper. Preto continua sem significado de zero físico; não existe máscara científica de ausência de dados.
8. Créditos, origem, manifesto, limitações e legenda musical continuam acessíveis. A representação científica real não pode ser removida para deixar apenas o globo.

Esta inspeção valida identidade dos arquivos e justifica a estratégia B; não valida projeção, calibração, escuta humana, acessibilidade integral ou o funcionamento final do novo layout. Build, SSR, transporte, sincronização e testes visuais desta entrega devem ser registrados separadamente em [quality-gates](quality-gates.md) e [handoff](handoff.md).

## Condição para reavaliar a estratégia A

Reabrir somente com evidência ligada aos mesmos recursos: CRS/projeção e parâmetros, extensão/recorte/orientação, transformação reproduzível pixel↔coordenada, pontos de controle distribuídos, tolerância mensurada, máscaras e atualização de proveniência. Uma nova curadoria georreferenciada exigiria análise própria de fonte, transformação e efeito nos eventos antes de substituir os PNGs atuais.
