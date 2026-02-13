# Especificacao Funcional — Consulta de Orders via Chat (Lumi)

**Versao:** 1.0
**Data:** 13 de fevereiro de 2026
**Autor:** Karem Carvalho
**Audiencia:** Engenharia, Produto, QA

---

## 1. Objetivo

Permitir que o usuario consulte informacoes sobre pedidos (orders) diretamente pelo chat da Lumi e visualize os resultados em formato de **card com preview de tabela**.

O usuario podera:

- Visualizar dados resumidos no card
- Aplicar filtros na tela de Vendas (quando aplicavel)
- Expandir o card para visualizar todos os resultados em uma modal
- Exportar a lista de pedidos

---

## 2. Ator e Contexto

| Item              | Descricao                                   |
|-------------------|---------------------------------------------|
| **Ator**          | Usuario autenticado no painel               |
| **Contexto**      | Tela de Vendas (Orders)                     |
| **Gatilho**       | Pergunta relacionada a pedidos no chat Lumi |

### 2.1. Exemplos de perguntas que acionam a funcionalidade

- "Quais pedidos eu tenho para embalar?"
- "Quantos pedidos estao pendentes?"
- "Me mostra pedidos pagos"
- "Quero incluir telefone nessa lista"

---

## 3. Fluxo Geral

```
Pergunta do usuario
       |
       v
  [Estado 1] Loading / Streaming
       |
       v
  [Estado 2] Card Preview (5 linhas, sem scroll vertical)
       |
       +---> "Aplicar" ---> [Estado 4] Filtro na tela de Vendas
       |
       +---> "Ver mais" / Expandir ---> [Estado 3] Modal com tabela completa
       |
       +---> "Exportar" ---> [Estado 5] Exportacao em background
```

---

## 4. Estados da Interface

### Estado 1 — Loading (Streaming)

Ao identificar intencao relacionada a orders, a Lumi exibe mensagens progressivas de processamento com efeito de streaming.

| Regra | Descricao |
|-------|-----------|
| **Mensagens sequenciais** | Exibir frases progressivas: "Pensando...", "Analisando pedidos...", "Buscando dados...", "Criando tabela..." |
| **Objetivo** | Reduzir sensacao de latencia e comunicar processamento em tempo real |
| **Comportamento visual** | Texto aparece caractere a caractere (streaming) |

---

### Estado 2 — Card Preview (Estado Padrao)

Apos retorno dos dados, exibir um card com preview da tabela.

| Regra | Descricao |
|-------|-----------|
| **Linhas exibidas** | Exatamente **5 linhas** de dados |
| **Scroll vertical** | **NAO EXISTE** — nenhuma rolagem vertical dentro do card |
| **Scroll horizontal** | **PERMITIDO** — para navegacao entre colunas que nao cabem na tela |
| **Linhas fixas** | As 5 linhas sao fixas, sem possibilidade de rolar para ver mais |
| **Acao "Ver mais"** | Abre a **modal** (Estado 3) para exibir todos os resultados |

#### 4.2.1. Colunas Default da Tabela (Orders)

Quando a pergunta for padrao sobre pedidos, a tabela exibe as seguintes colunas:

| # | Coluna       |
|---|--------------|
| 1 | Vendas       |
| 2 | Clientes     |
| 3 | Total        |
| 4 | Produtos     |
| 5 | Pagamentos   |
| 6 | Envio        |

> **IMPORTANTE:** A coluna **Data** NAO aparece por padrao. So deve ser exibida se o usuario solicitar explicitamente (ex: "inclui a data").

#### 4.2.2. Botoes do Card

| Botao         | Visibilidade | Acao |
|---------------|-------------|------|
| **Aplicar**   | Condicional (ver regra abaixo) | Aplica filtro na tela de Vendas |
| **Ver mais**  | Sempre visivel | Abre a modal com tabela completa |
| **Exportar**  | Sempre visivel | Inicia exportacao em background |
| **Expandir**  | Sempre visivel, com tooltip explicativo | Abre a modal com tabela completa |

---

### Estado 3 — Modal (Expandido)

Ao clicar em **"Ver mais"** ou no botao de **expandir**, abre-se uma modal.

| Regra | Descricao |
|-------|-----------|
| **Conteudo** | Tabela completa com todos os resultados da consulta |
| **Scroll vertical** | **SCROLL INFINITO** ativado |
| **Paginacao** | Dados carregados sob demanda conforme o usuario rola |
| **Skeleton loader** | **OBRIGATORIO** durante carregamento de novas linhas |
| **Colunas** | Mesmas colunas do card preview (respeitando personalizacoes do usuario) |

---

### Estado 4 — Filtro Aplicado na Tela de Vendas

| Regra | Descricao |
|-------|-----------|
| **Ao clicar "Aplicar"** | O filtro da consulta e refletido na tela de Vendas |
| **Mudanca de botao** | "Aplicar" muda para **"Desfazer"** |
| **Ao clicar "Desfazer"** | Remove o filtro aplicado e restaura o estado anterior da tela |

---

### Estado 5 — Exportacao

| Regra | Descricao |
|-------|-----------|
| **Ao clicar "Exportar"** | O card e fechado automaticamente |
| **Loading** | Exibir indicador de carregamento da exportacao |
| **Chat** | Permanece **disponivel** — o usuario pode continuar interagindo |
| **Conclusao** | Lumi envia nova mensagem no chat informando que a exportacao foi concluida |
| **Download** | Arquivo fica disponivel para download na mensagem |
| **Notificacao sonora** | Emitir um **som** ao finalizar a exportacao para alertar o usuario |
| **Filtros** | A exportacao deve respeitar os mesmos filtros aplicados na consulta exibida |

---

## 5. Regras de Negocio

### 5.1. Regra do Botao "Aplicar"

O botao "Aplicar" so deve aparecer quando **TODAS** as condicoes abaixo forem verdadeiras:

1. A consulta esta dentro do escopo default de orders
2. A estrutura da tabela e compativel com os filtros da tela de Vendas
3. Nenhuma coluna adicional personalizada foi solicitada pelo usuario

### 5.2. Quando NAO Exibir o Botao "Aplicar"

Se o usuario solicitar dados fora do escopo default, o botao "Aplicar" **NAO deve aparecer**.

**Exemplos de solicitacoes que removem o botao:**

- "Inclui telefone"
- "Inclui CPF"
- "Inclui campo personalizado"
- Qualquer coluna que nao faca parte do modelo padrao (secao 4.2.1)

Nesse caso:

- Exibir apenas o card com os dados solicitados
- **Nao** permitir aplicar como filtro na tela de Vendas

### 5.3. Colunas Personalizadas

Quando o usuario solicita colunas adicionais (ex: "inclui telefone nessa lista"):

- A coluna solicitada e adicionada a tabela
- O botao "Aplicar" e removido do card
- Os demais comportamentos (expandir, exportar) permanecem inalterados

---

## 6. Regras Tecnicas

| # | Regra |
|---|-------|
| RT-01 | A query deve respeitar o contexto da **loja ativa** do usuario |
| RT-02 | A exportacao deve respeitar os **filtros aplicados** na consulta exibida |
| RT-03 | Scroll infinito na modal deve ser **paginado** (carregar dados sob demanda) |
| RT-04 | **Skeleton loader obrigatorio** em todos os carregamentos adicionais (modal e exportacao) |
| RT-05 | A renderizacao do card depende da **intencao reconhecida** pela Lumi |
| RT-06 | O card preview **nunca** deve ter scroll vertical — apenas horizontal |
| RT-07 | O card sempre inicia em **modo resumido** (5 linhas) |
| RT-08 | "Ver mais" abre a **modal** — nao expande o card in-place |
| RT-09 | Exportacao **nao bloqueia** o uso do chat |
| RT-10 | Emitir **notificacao sonora** ao concluir a exportacao |
| RT-11 | O botao de expandir deve conter **tooltip** explicativo |
| RT-12 | Colunas default nao incluem "Data" — so aparece sob demanda explicita do usuario |

---

## 7. Resumo de Comportamento por Componente

| Componente | Scroll Vertical | Scroll Horizontal | Linhas | Acao Principal |
|------------|:-:|:-:|:-:|----------------|
| **Card Preview** | Nao | Sim | 5 fixas | "Ver mais" abre modal |
| **Modal** | Sim (infinito) | Sim | Todas (paginadas) | Scroll infinito + skeleton |

---

## 8. Checklist de Implementacao

- [ ] Streaming de mensagens de loading com efeito caractere a caractere
- [ ] Card preview com 5 linhas fixas, sem scroll vertical
- [ ] Scroll horizontal no card preview
- [ ] Colunas default: Vendas, Clientes, Total, Produtos, Pagamentos, Envio
- [ ] Coluna "Data" oculta por padrao, visivel apenas sob demanda
- [ ] Botao "Aplicar" condicional (somente consultas dentro do escopo default)
- [ ] Comportamento Aplicar/Desfazer na tela de Vendas
- [ ] Botao "Ver mais" abrindo modal
- [ ] Modal com scroll infinito vertical e skeleton loader
- [ ] Botao "Exportar" fecha o card e roda em background
- [ ] Mensagem no chat ao concluir exportacao
- [ ] Notificacao sonora ao concluir exportacao
- [ ] Tooltip no botao de expandir
- [ ] Exportacao respeita filtros da consulta
- [ ] Query respeita contexto da loja ativa

---

## 9. Historico de Versoes

| Versao | Data       | Descricao                              |
|--------|------------|----------------------------------------|
| 1.0    | 13/02/2026 | Versao inicial consolidada da especificacao |
