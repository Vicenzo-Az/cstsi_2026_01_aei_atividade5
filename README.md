# Atividade 5 - Animacao SVG com Tailwind (React + Vite)

Projeto da disciplina com foco em animacao e interface frontend usando React, TypeScript, Vite e Tailwind utilitario.

## Objetivo da Atividade

Recriar uma animacao no projeto frontend aplicando classes utilitarias do Tailwind e criar pelo menos uma classe customizada.

Tambem foi solicitado criar/editar uma animacao SVG no SVGator e importar o SVG exportado no projeto React utilizando a tag `object`, preferencialmente no formato CSSOnly.

## Requisitos Atendidos

- Animacao SVG adicionada e editada em `public/finance-orbit.svg`.
- Importacao do SVG animado via tag `object` no React.
- Alternancia automatica de cenarios do grafico (sem botoes).
- Transicoes suaves entre cenarios com interpolacao por `requestAnimationFrame`.
- Uso de classes utilitarias Tailwind no layout do dashboard.
- Classe customizada criada em `src/index.css` (`.svgator-panel`).

## Estrutura Principal da Solucao

- `public/finance-orbit.svg`
  - SVG animado base (estilo CSSOnly), preparado para atualizacao dinamica das barras.
- `src/components/dashboard/InteractiveSvgChart.tsx`
  - Componente React que carrega o SVG com `<object>`.
  - Atualiza barras do SVG de forma automatica e suave.
- `src/pages/Dashboard.tsx`
  - Integracao do grafico interativo no estado vazio de transacoes.
- `src/index.css`
  - Classe custom e estilo visual do painel do SVG.

## Como Executar

1. Instalar dependencias:

```bash
npm install
```

1. Rodar em desenvolvimento:

```bash
npm run dev
```

1. Gerar build de producao:

```bash
npm run build
```

## Observacoes

- O SVG foi carregado com `object` para manter compatibilidade com exportacao CSSOnly do SVGator.
- Os textos visiveis do grafico SVG foram removidos, mantendo apenas o comportamento visual/animado.
