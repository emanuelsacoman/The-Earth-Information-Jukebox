# ADR 0001 — Escopo do primeiro MVP

- **Data:** 15/11/2026.
- **Estado:** ACEITA como decisão de produto explicitamente fornecida pela equipe na TASK 0; não implica aprovação de implementação ou publicação.
- **Referência de código:** branch `brain`, commit `aab547114375c7232807d31dbaa726c6fec0b1a2`.

## Contexto

O projeto já possui interface Angular standalone, mas carregadores científicos, áudio e globo são TODO ([auditoria](../current-state.md)). A equipe quer demonstrar a relação entre visualização real da Terra e som, com interação acessível e prazo de hackathon. A pesquisa do desafio é parcial por indisponibilidade da página; requisitos oficiais não verificados permanecem em [fontes](../data-and-sources.md).

## Decisão

Construir primeiro uma aplicação Angular que sonifica **uma visualização real do NASA EIC em tempo real**, mantendo a base existente e evoluindo responsabilidades de forma incremental. Iniciar com visualização 2D e modo Sweep; Web Audio API é a primeira opção técnica a validar. Night Lights é o primeiro candidato científico a qualificar, sem tratar seleção de frames ou calibração como decididas.

## Justificativas

A proposta atende à intenção multissensorial descrita no desafio e à escolha da equipe. Uma única fonte reduz complexidade e facilita explicar/demonstrar transformação, créditos e limites. A integração incremental permite investir no fluxo funcional e na acessibilidade durante o hackathon, preservando evolução posterior.

## Alternativas consideradas

| Alternativa | Avaliação |
|---|---|
| Coleção de áudios gerados previamente | Formato mencionado no briefing da equipe como admissível; não realiza a interação em tempo real escolhida. Admissibilidade formal ainda depende do guia/desafio integral. |
| Globo 3D antes do pipeline | Aumenta custo de integração/desempenho sem resolver dados ou som; adiado. |
| Muitas visualizações/instrumentos no lançamento | Amplia validação científica e sonora; adiado até uma fonte passar nos gates. |
| Backend/autenticação como pré-requisito | Necessidade não demonstrada; catálogo e fallback local podem ser suficientes. Avaliar integrações existentes em F1. |
| Reescrita do frontend | Sem evidência de necessidade; preservar componentes e extrair responsabilidades gradualmente. |

## Consequências

O MVP exige proveniência até os eventos sonoros, mapeamento reproduzível, Play/Pause reais, estado sincronizado e alternativa textual/teclado. Beleza visual e globo não substituem esses gates. Se não houver sequência temporal identificável, usar imagem real com exploração espacial explícita, sem fabricar evolução. Correntes oceânicas e Explore completo ficam opcionais/pós-MVP.

## Em aberto

Fonte/frame final, uso local e créditos específicos; significado e calibração das cores; algoritmo de extração, normalização e limites musicais; manutenção do Firebase; estratégia SSR/hosting; requisitos formais/fuso da equipe. Resolver nas tarefas F1-02/03, F2-01/02, F3-01 e F7-01/03 do [roadmap](../roadmap.md). Apenas F0 foi executada nesta tarefa.
