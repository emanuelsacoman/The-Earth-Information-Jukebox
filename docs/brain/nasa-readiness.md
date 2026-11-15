# Fechamento mínimo frente ao desafio NASA

Conferência em **15/11/2026**, contexto `America/Sao_Paulo`. Código analisado: `brain` / `3b5793a6939505664f32f489b6f8eadb92525645`, mais a correção de ordem das seções descrita abaixo. Este documento compara o produto com o desafio; não registra submissão ou aceite da NASA.

## O que o desafio pede

A página oficial propõe associar visualizações do Earth Information Center a sonificações dinâmicas. Os objetivos aceitam uma ferramenta interativa ou uma coleção de áudios originais gerados, acompanhados das imagens e da explicação do processo. A tradução pode usar brilho, cor, forma ou densidade; a técnica é livre. Acessibilidade e equilíbrio entre interpretação dos dados e musicalidade são temas centrais. Os itens em “Potential Considerations” são sugestões explicitamente opcionais.

Fontes lidas no navegador, incluindo o conteúdo carregado após a abertura: [desafio completo](https://www.spaceappschallenge.org/2026/challenges/the-earth-information-jukebox/) e [aba de recursos](https://www.spaceappschallenge.org/2026/challenges/the-earth-information-jukebox/?tab=resources). O extrator HTTP retornou 502; isso não impediu a leitura no navegador. A aba de recursos inclui Night Lights/SVS 5313. A [página 5313](https://svs.gsfc.nasa.gov/5313/) confirma que a [5276](https://svs.gsfc.nasa.gov/5276/), usada pelos recursos locais, é a versão original da visualização.

Não há exigência nessa página de globo 3D, IA, backend, autenticação, todas as visualizações ou som produzido ao clicar em latitude/longitude. Esses itens não precisam ser acrescentados para fechar a abordagem interativa escolhida.

## Situação do produto

| Parte | Evidência disponível | O que falta para fechar |
|---|---|---|
| Imagens NASA associadas ao EIC | Dois PNGs anuais, 2012/2023, catálogo e [manifesto](../../public/data/night-lights/manifest.json) com origem, créditos e hashes | Conferir presença e carregamento no pacote final; não apresentar dois anos como sequência temporal contínua |
| Som derivado da imagem | Extração RGB por regiões e mapeamento determinístico para notas/ganho/panorama, com síntese Web Audio | Escuta humana para confirmar audibilidade, conforto e relação perceptível entre leitura e som |
| Experiência interativa | Seleção de ano, Play/Pause, posição espacial, velocidade, volume e mute | Aceite humano do percurso completo e das trocas/pausas; registrar navegador e dispositivo |
| Explicação da transformação | Legenda com fórmulas, fonte, máscara e distinção entre brilho visual e radiância | Manter essas explicações e créditos na demonstração; não alegar grandezas físicas calibradas |
| Acesso sem depender apenas da visão ou do áudio | Controles semânticos, leitura textual e anúncios de estado existentes | Validar teclado, leitor de tela, foco, zoom 200% e celular real; corrigir falhas observadas |
| Apresentação do mundo | Planeta volta a ser a primeira seção; painel sonoro fica abaixo, com links de ida/volta | Conferir layout compilado desktop e móvel nesta revisão |

As evidências anteriores de 74 testes Angular, 8 Node e sinal digital real estão no [relatório de sonificação](sonification-delivery.md). São resultados anteriores da outra execução, não prova de escuta humana. As verificações da presente correção devem ser registradas separadamente no [handoff](handoff.md).

## Ordem para terminar sem ampliar o escopo

O [guia oficial de submissão](https://www.spaceappschallenge.org/resources/project-submission-guide/), publicado em 13/11/2026 e lido no navegador em 15/11/2026, especifica materiais em inglês, demo em vídeo de até 30 s ou apresentação de até 7 slides, links públicos sem login e declaração do uso de IA/SI no texto e metadados. Vídeo falado em outro idioma precisa de legendas em inglês. A interface atual está em português; sua versão em inglês ainda precisa ser preparada/revisada. Ver [plano de fechamento](finalization-plan.md), [rascunho em inglês](submission-draft-en.md) e [declaração de IA](../../AI_USAGE.md).

1. **Fechar a versão local:** build de produção, SSR e testes pertinentes, conferência do layout e do percurso selecionar ano → reproduzir → pausar → explicar a leitura. Uma reinstalação limpa com o lockfile é necessária para confirmar reprodução nesta árvore.
2. **Fechar o aceite humano:** ouvir com saída de som real e fazer dez ciclos/trocas; confirmar silêncio em pausa/mute e ausência de áudio antigo. Testar teclado e leitor de tela; uma medição de AnalyserNode não substitui esse aceite.
3. **Preparar a demonstração:** mostrar imagem NASA e áudio correspondente, explicar uma escolha musical e uma limitação científica, informar os créditos e como executar. Respeitar inglês e o limite de 30 s ou 7 slides, incluindo a capa; revisar a declaração de IA e a origem da ideia com a equipe.
4. **Entregar em destino confirmado:** definir URL ou pacote executável, conferir links em sessão limpa e revisar o material. Publicação e submissão são ações separadas; a instrução atual não autoriza envio em nome da equipe. Confirmar prazo/fuso e campos na conta/evento da equipe; este documento não os presume.

O núcleo técnico já existe. As pendências principais são validação humana/acessibilidade e a entrega demonstrável. Não é necessário implementar mais temas ou georreferenciar o globo para concluir a sonificação 2D. Se a equipe quiser que o globo controle o som, isso é uma evolução separada que exige transformação espacial validada.
