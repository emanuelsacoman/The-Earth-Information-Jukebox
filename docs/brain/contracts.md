# Contratos de domínio propostos

[Índice](README.md) · [Arquitetura](architecture.md) · [Fontes](data-and-sources.md) · [Gates](quality-gates.md)

Estes contratos são conceituais e orientam F2–F4. Não são interfaces TypeScript implementadas nem descrevem dados já disponíveis. O `RecordItem` privado atual do Dashboard é demonstrativo e não satisfaz a proveniência necessária. Nome de campo é uma proposta; preservar as regras ao escolher a representação futura.

## Regras comuns

- Identificadores são estáveis, únicos no seu escopo e independentes do título exibido. Toda relação deve resolver um identificador existente.
- Manifestos/contratos possuem `schemaVersion`; estratégias de extração e mapeamento possuem identificador e versão próprios. Mudanças que alterem interpretação ou som exigem nova versão e evidência.
- Ausência de dado é explícita: valor ausente + motivo/estado. Zero válido não representa falha, fundo ou região mascarada. `NaN`, infinito e números fora dos limites são rejeitados.
- Não fabricar precisão temporal: manter “2012” como ano quando a fonte só informa ano; não preencher dia/mês. Guardar precisão, fuso quando aplicável e texto original da fonte.
- Distinguir **tempo de observação** científica, **posição de apresentação** na imagem/vídeo e **tempo de áudio**. Não converter um no outro sem regra documentada.
- Valores espaciais devem declarar seu sistema: pixel, coordenada normalizada da imagem ou coordenada geográfica. Não inferir lat/lon de qualquer posição em uma imagem sem projeção/transformação verificável.
- URLs devem ser observadas em fontes verificadas. Hash é registrado depois de calculado sobre o recurso obtido; não inventar um checksum para completar manifesto.

## ScientificRecord

Representa uma visualização identificável e sua interpretação, sem presumir que toda visualização seja uma série temporal.

| Campo conceitual | Conteúdo e validação |
|---|---|
| `id`, `schemaVersion` | Identificador único no catálogo e versão do contrato. |
| `title`, `description` | Título e explicação do que a visualização representa; sem prometer funcionalidades inexistentes. |
| `source` | Organização NASA, coleção/estúdio e identificador oficial quando fornecido. Créditos adicionais preservados. |
| `originUrl`, `references` | Página oficial de origem e referências verificadas que sustentam interpretação e recursos. |
| `period` | Intervalo/períodos científicos, precisão e referência que os comprova; pode ser ausente com justificativa. Comparação de dois anos deve manter os dois períodos. |
| `scientificQuantity`, `scientificUnit` | Grandeza/unidade da fonte quando verificadas, mesmo se a extração usar pixels; ausentes com motivo se não fornecidas ou não verificadas. Não transferir unidade física às features de pixel sem calibração. |
| `legend` | Descrição textual, classes/faixas, cores e escala quando documentadas; origem da legenda e eventual relação quantitativa. Distinguir legenda da fonte da legenda musical da aplicação. |
| `frames` | Lista ordenada de `ScientificFrame`, ou referências resolvíveis a um manifesto. Ao menos um frame válido; quantidade derivada da lista, sem `100` fictício. |
| `extractionStrategy` | Identificador/versão, domínio de entrada, seleção espacial, máscaras e parâmetros. Deve ser compatível com os frames. |
| `calibration` | Referência opcional à transformação verificada de representação para medida, seus limites e unidade. Sem comprovação, manter ausente e usar domínio visual. |
| `usage` | Créditos, condições de uso por recurso, URL da evidência e data de verificação. Não presumir que todo material de uma página tenha as mesmas condições. |
| `knownLimitations` | Limitações científicas, visuais, temporais, espaciais e técnicas conhecidas; registrar incerteza relevante. |

O candidato principal é Change in Night Lights (SVS 5313), sujeito à validação de recursos e manifesto em **F2-02**. A existência de frames anuais de 2012 a 2023 não foi comprovada. Não preencher esse contrato antecipadamente como se a seleção final estivesse concluída.

## ScientificFrame

Representa um recurso visual ou uma posição verificável de um recurso que pode ser apresentada e processada.

| Campo conceitual | Conteúdo e validação |
|---|---|
| `id`, `recordId`, `order` | Identificador do frame, relação ao registro e ordem de apresentação. Ordem não equivale a data científica. |
| `observationTime` | Data/instante/período científico e precisão quando conhecidos; ausência justificada para imagens compostas ou sem data individual. |
| `presentationTime` | Timecode/posição em vídeo, se aplicável, e duração de apresentação proposta. Não é o instante da medição da Terra. |
| `visualResource` | URL confirmada ou caminho local legítimo, tipo de mídia e, para vídeo, referência temporal. Alternativas remota/local devem identificar a versão correspondente. |
| `originReference` | Página oficial, identificador do asset e créditos que permitem rastrear a obtenção. |
| `dimensions` | Largura/altura verificadas e orientação; validar após decodificar. Distinguir tamanho original de tamanho processado. |
| `usefulCharacteristics` | Espaço de cor, recorte, canais, resolução de processamento e outras características necessárias à extração; declarar conversões aplicadas. |
| `interpretationMetadata` | Legenda aplicável, unidade/escala quando existentes, descrição textual, projeção/transformação espacial se verificadas e condições de composição. |
| `validityMask` | Áreas válidas/excluídas, códigos sem dados, motivo e método/versão da máscara; ausência de máscara deve ser uma limitação explícita. |
| `integrity` | Versão do recurso, tamanho/hash quando efetivamente obtidos, data de obtenção e resultados da verificação. |
| `limitations` | Lacunas de data, projeção, compressão, sobreposições ou outras restrições de interpretação. |

Falha HTTP, CORS, decodificação ou integridade impede promover o frame a `ready`. Não gerar features a partir de uma imagem anterior enquanto o estado anuncia a nova.

## ExtractedFeature

Representa um resultado rastreável de extração, antes de convertê-lo em som.

| Campo conceitual | Conteúdo e validação |
|---|---|
| `id`, `recordId`, `frameId` | Identidade e relações que permitem localizar o recurso original. |
| `kind` | Tipo explícito, como brilho relativo, categoria de cor ou medida calibrada. O tipo deve coincidir com o método usado. |
| `domain` | `visual-pixel` ou `scientific-measurement`. O segundo exige unidade, calibração/proveniência verificadas e limites de validade. |
| `rawValue`, `category`, `unit` | Valor bruto numérico ou categoria, com unidade do domínio. Declarar a escala de pixels/canais utilizada. Categoria não recebe uma ordem quantitativa por conveniência. |
| `normalizedValue` | Número finito em `[0,1]` quando houver normalização válida; ausente para dados inválidos ou categorias sem transformação definida. |
| `normalization` | Método/versão, limites de referência, clipping e tratamento de valores fora da faixa. Preferir referência estável entre frames; normalização por frame precisa explicitar perda de comparabilidade. |
| `position`, `extent` | Posição/área e sistema de coordenadas; pode ser ausente para característica agregada do frame inteiro. |
| `extractionMethod` | Identificador/versão, canais, resolução, amostragem, agregação e parâmetros que reproduzem o resultado. |
| `validity` | Válido/mascarado/ausente/erro, motivo e referência à máscara utilizada. Apenas válidos podem originar eventos sonoros de dados. |
| `calibrationReference`, `limitations` | Evidência da calibração se houver; incertezas e perdas de interpretação. |

**Invariante científica:** intensidade de pixel não é temperatura, CO₂ ou velocidade de corrente. Mesmo uma visualização de temperatura pode sofrer composição, compressão e colorização; a inversão da escala exige verificação específica. Sem essa verificação, a leitura textual e a legenda sonora descrevem a característica visual.

Para features agregadas, guardar os pixels/região e a operação utilizados. Repetir a mesma extração sobre o mesmo recurso e parâmetros deve gerar o mesmo resultado dentro de tolerância declarada.

## SonificationEvent

Representa uma instrução sonora derivada de uma feature válida, com identidade suficiente para explicar o som e conferir sincronização.

| Campo conceitual | Conteúdo e validação |
|---|---|
| `id`, `sessionRevision` | Identificador do evento e revisão de reprodução; eventos de sessão antiga são descartados. |
| `origin` | `recordId`, `frameId`, `featureId`, recurso/versão e versões de extração/mapeamento. |
| `featureSnapshot` | Tipo, domínio, valor relevante, validade e posição que produziram o evento; referência à unidade correta. |
| `mapping` | Identificador/versão, parâmetros musicais, regra de normalização/quantização e configuração efetiva. |
| `frequencyHz`, `note` | Frequência finita positiva dentro dos limites de áudio escolhidos; nota é opcional e deve corresponder à frequência/afinação declaradas. Frequência sonora é uma escolha de apresentação, não uma frequência científica medida. |
| `intensity` | Ganho linear normalizado em `[0,1]`, com envelope e regra de composição com volume/mute. Não confundir com intensidade física da fonte ou volume percebido uniforme. |
| `durationSeconds` | Duração sonora finita positiva, limitada pela política do motor; não representa duração da observação. |
| `timelineOffsetSeconds` | Posição lógica relativa à sequência de reprodução, independente de horário civil. |
| `scheduledAudioTimeSeconds` | Instante agendado no relógio do `AudioContext`; atribuído pelo motor para a sessão ativa, sem persistir como timestamp científico. |
| `spatialPosition` | Pan em `[-1,1]` ou modelo espacial explicitamente definido, quando aplicável; derivação a partir da posição visual documentada. |
| `textDescription` | Explicação acessível da feature e do parâmetro sonoro correspondente. |

A política do motor limita frequência, duração, ganho total e vozes simultâneas; os valores concretos são decisões de **F3-01/F3-02**, acompanhadas de validação. Envelope deve evitar cliques e transições abruptas. Ausência de feature válida gera silêncio ou mensagem de indisponibilidade documentada, nunca uma nota que pareça medir um zero.

Um evento planejado não prova que o som foi executado. O feedback de execução deve informar seu identificador e estado (agendado/executado/cancelado/falhou), permitindo que a leitura visual/textual acompanhe a sessão aceita.

## PlaybackState

Representa a fonte única de estado da experiência; os componentes exibem esse estado e enviam comandos ao Coordinator.

| Campo conceitual | Conteúdo e validação |
|---|---|
| `sessionRevision` | Revisão monotônica para invalidar carregamentos e eventos antigos. |
| `selectedRecordId`, `currentFrameId`, `frameIndex` | Seleção resolvível; índice dentro dos limites e coerente com o ID do frame. Pode estar sem seleção inicialmente. |
| `transport` | Estado explícito `idle`, `paused`, `playing` ou `ended`; `playing` exige recurso/feature prontos e motor ativo. Falha de áudio não conserva afirmação de reprodução. |
| `mode` | Sweep ou Explore, apenas quando suportado; opção indisponível deve ser identificada. |
| `position` | Posição lógica da varredura e/ou cursor, sistema de coordenadas e evento atual. Não confundir com a data do frame. |
| `speed` | Valor finito e unidade explícita. A UI atual usa bpm; definir sua relação com eventos/varredura antes da integração, sem tratá-lo como velocidade dos fenômenos científicos. |
| `volume`, `muted` | Valor normalizado em `[0,1]` e mute; adaptador converte a UI atual de 0–100. Mute não perde o volume escolhido. |
| `musicalSettings` | Escala, afinação, timbre e versão do mapeamento/configuração; aceitar apenas opções suportadas pelo motor real. |
| `loading` | Estado por recurso/etapa: `idle`, `loading`, `ready` ou `error`; progresso opcional só quando mensurável. |
| `audioStatus` | Estado real de disponibilidade/contexto do navegador, incluindo suspensão e necessidade de gesto. |
| `error`, `unavailability` | Código, etapa/recurso, explicação compreensível e ação de recuperação; não expor detalhes técnicos como única mensagem. |
| `currentReading` | Feature/evento aceito para alternativa textual, mais metadados/legenda suficientes para interpretá-lo. |

Configurações vindas de URL ou storage devem passar pelos mesmos validadores dos controles. Valores desconhecidos, inválidos ou fora da faixa usam fallback documentado e não se propagam ao motor. Preferências de acessibilidade podem ter contrato próprio; sua persistência não deve misturar nós/recursos do motor no estado serializável.

## Relacionamentos e invariantes de integração

1. `ScientificRecord` contém frames e sua proveniência. `ScientificFrame` herda a interpretação do registro, com metadados específicos quando necessários.
2. Um frame aceito, com máscara e estratégia versionada, produz zero ou mais `ExtractedFeature`. Zero features válidas é um resultado explícito, não um frame falso.
3. Uma feature válida e um mapeamento versionado produzem zero ou mais `SonificationEvent`. A cardinalidade/regra deve ser explicável na legenda musical.
4. `PlaybackState` seleciona o registro/frame e mantém a revisão. Somente eventos dessa revisão e desses recursos podem atualizar a leitura atual.
5. Em pause/seek/troca de registro, cancelar a fila anterior e invalidar callbacks antigos. Retomada agenda novos instantes de áudio a partir da posição lógica preservada.
6. Em carregamento/erro, não apresentar como atuais o som de um frame e a imagem de outro. A alternativa textual deve indicar indisponibilidade ou a seleção efetivamente aceita.
7. O mesmo recurso, extração, configuração e posição lógica devem produzir a mesma sequência planejada, com tolerâncias documentadas. Preferências estéticas não alteram a origem dos dados.

## Evidência para aceitar a implementação futura

**F2-02/F2-03:** manifesto com referências reais; resolução dos IDs; verificação de períodos, legendas e créditos; recurso remoto/local carregável; erro de CORS/ausência tratado sem dados inventados.

**F3-01:** valores de entrada conhecidos geram features e parâmetros esperados; normalização/máscara/calibração reproduzíveis; ausência permanece ausência; legenda distingue pixel e medida física.

**F3-02/F3-03:** execução sonora real, controle de ganho e recursos; Play/Pause/retomada e descarte de fila demonstrados; eventos têm origem e versão identificáveis.

**F4-01/F4-02:** seleção, frame exibido, leitura textual e evento executado pertencem à mesma revisão; trocas rápidas, pause e seek não deixam resultados antigos assumir o estado atual. Aplicar também [quality-gates.md](quality-gates.md).
