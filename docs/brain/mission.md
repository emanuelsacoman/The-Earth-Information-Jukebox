# Missão e escopo

Transformar visualizações científicas reais da Terra em uma experiência web que permita **ver, ouvir e ler a mesma informação**, com transformação sonora explicável. Beneficiar pessoas cegas ou com baixa visão, pessoas surdas ou com deficiência auditiva por meio de alternativas textuais/visuais, estudantes, educadores e público interessado em ciência da Terra.

O objetivo da equipe no hackathon é demonstrar um percurso completo: selecionar uma visualização NASA EIC, carregar material real, extrair características adequadas, mapeá-las em parâmetros musicais e sintetizar som durante a interação. Essa é a decisão de produto da equipe, registrada na [ADR 0001](decisions/0001-mvp-scope.md). O acesso parcial ao desafio oficial impede afirmar que todos os detalhes da proposta sejam exigências da NASA; consulte [fontes](data-and-sources.md).

## Definição mínima de MVP

| Condição obrigatória | Evidência de sucesso |
|---|---|
| Uma visualização real do NASA EIC | Origem oficial, recurso identificável, créditos e limites documentados |
| Extração ou transformação verificável | Método/versionamento e amostra de entrada com saída reproduzível |
| Áudio sintetizado a partir da informação visual | Eventos rastreáveis ao frame/característica; mudança previsível ao variar a entrada |
| Iniciar e pausar de verdade | Som e cursor param/retomam juntos sem áudio residual |
| Correspondência entre visual e som | Frame, posição de varredura e leitura textual consistentes |
| Legenda do mapeamento | Explica característica, normalização, altura/intensidade/ritmo usados e limitações |
| Navegação básica acessível | Fluxo principal por teclado, foco visível e leitura assistiva verificadas |
| Fontes e créditos | Proveniência e condições de uso por recurso |
| Execução e demonstração reproduzíveis | Baseline técnica e roteiro executável por outro colaborador |
| Material de submissão | Links, explicação em inglês, limitações, fontes e uso de IA conferidos no guia vigente |

Priorizar múltiplos frames reais quando houver sequência temporal comprovada. Uma imagem científica real explorada espacialmente é uma redução de escopo legítima; seu cursor não representa evolução temporal. Não inventar datas ou variação dos dados para produzir animação.

## Princípios de produto e ciência

- A origem deve acompanhar o dado até o evento sonoro. Separar medida física, categoria da legenda e característica de pixel.
- Brilho de pixel é brilho da representação. Só usar temperatura, radiância ou outra unidade com calibração e proveniência verificáveis.
- Explicar incerteza, regiões sem dados, composição gráfica e possíveis efeitos da renderização. Sons expressam uma escolha de mapeamento, não uma propriedade acústica natural da Terra.
- Controles fundamentais e alternativa textual entram no caminho crítico. A experiência básica deve funcionar sem depender exclusivamente da visão ou da audição.
- Fidelidade científica, funcionamento e acessibilidade orientam a identidade visual. Evoluir os componentes standalone existentes por etapas pequenas.

## Fora do primeiro MVP

Globo 3D, segunda visualização, Explore por coordenadas, rotação/zoom avançados, playlists automáticas, vibração, muitos instrumentos/presets, exportação de áudio e compartilhamento avançado são pós-MVP ou opcionais. Backend, autenticação e persistência remota não são requisitos de produto confirmados. Firebase existente será avaliado antes de qualquer remoção.

F0 autoriza somente investigação e documentação. O planejamento das próximas fases não autoriza sua execução, publicação ou submissão. Prazo e requisitos formais devem ser conferidos imediatamente em **F7-01**, conforme as limitações registradas em [dados e fontes](data-and-sources.md).
