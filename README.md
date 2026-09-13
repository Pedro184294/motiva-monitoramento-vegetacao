# 🌱 Motiva — Monitoramento de Vegetação

## 📌 Sobre o projeto

O **Motiva — Monitoramento de Vegetação** é uma solução desenvolvida como protótipo acadêmico para auxiliar no monitoramento da vegetação presente nas áreas próximas às rodovias monitoradas pela Motiva.

A proposta consiste em utilizar sensores instalados em pontos estratégicos das rodovias para medir a altura da vegetação e enviar essas informações para uma plataforma central de monitoramento.

A aplicação permite visualizar os pontos monitorados, acompanhar as medições, identificar situações que exigem atenção e gerar ocorrências de manutenção quando a vegetação ultrapassa o limite definido para intervenção.

---

## 🎯 Problema

O crescimento excessivo da vegetação nas proximidades das rodovias pode dificultar a manutenção e a operação das vias, além de gerar a necessidade de intervenções preventivas.

Quando o monitoramento depende apenas de verificações presenciais, pode haver maior necessidade de deslocamento de equipes e dificuldade para acompanhar continuamente todos os pontos.

Diante desse cenário, o projeto busca apresentar uma solução capaz de centralizar as informações dos pontos monitorados e facilitar a identificação das áreas que precisam de acompanhamento ou manutenção.

---

## 💡 Solução proposta

A solução é composta por sensores posicionados em pontos estratégicos das rodovias.

Esses sensores realizariam a medição da altura da vegetação. Os dados seriam enviados para uma plataforma de monitoramento, onde seriam classificados automaticamente de acordo com os limites definidos.

### Classificação utilizada

| Altura da vegetação | Situação | Ação |
|---|---|---|
| Abaixo de 10 cm | 🟢 Normal | Manter monitoramento |
| 10 cm até 19 cm | 🟡 Atenção | Acompanhar o crescimento |
| 20 cm ou mais | 🔴 Intervenção | Acionar manutenção |

No protótipo desenvolvido, os dados dos sensores são simulados diretamente pela aplicação web para demonstrar o funcionamento da solução.

---

# 🖥️ Aplicação

A aplicação foi desenvolvida como uma central de monitoramento web.

A tela principal apresenta uma visão geral dos pontos monitorados e permite acompanhar as medições e as ocorrências de manutenção.

## Principais funcionalidades

### 📊 Dashboard de monitoramento

A aplicação apresenta um resumo dos pontos monitorados, separando automaticamente:

- Quantidade total de pontos;
- Pontos em situação normal;
- Pontos em atenção;
- Pontos que necessitam de intervenção.

Os valores são atualizados de acordo com as medições simuladas.

---

### 📍 Monitoramento por ponto

O usuário pode selecionar um ponto específico para visualizar:

- Rodovia;
- Quilômetro;
- Altura atual da vegetação;
- Status do ponto;
- Limite de atenção;
- Limite de intervenção;
- Mensagem correspondente à situação atual.

---

### 📡 Simulação do sensor

Como o projeto ainda está em fase de protótipo, a comunicação com sensores físicos é simulada pela própria interface.

O operador pode alterar a altura da vegetação por meio de um controle deslizante ou utilizar os atalhos:

- **Normal** — 5 cm;
- **Atenção** — 12 cm;
- **Crítico** — 21 cm.

A aplicação atualiza automaticamente o status do ponto conforme o valor informado.

---

### 🚨 Geração automática de ocorrência

Quando a medição do sensor atinge **20 cm ou mais**, o sistema identifica uma situação crítica e pode gerar automaticamente uma ocorrência de manutenção.

A ocorrência recebe:

- Quilômetro;
- Rodovia;
- Altura da vegetação;
- Prioridade;
- Status;
- Origem da ocorrência.

O sistema também evita a criação de ocorrências pendentes duplicadas para o mesmo ponto.

---

### 📝 Registro manual de ocorrência

Além da geração automática, o operador também pode registrar manualmente uma ocorrência quando um ponto estiver em situação de intervenção.

Isso permite demonstrar diferentes formas de acionamento da manutenção.

---

### 🔧 Gerenciamento de manutenção

As ocorrências podem ser acompanhadas diretamente pela plataforma.

Uma ocorrência pendente pode ser marcada como resolvida após o atendimento da equipe de manutenção.

Ao resolver uma ocorrência, o sistema registra:

- Data do atendimento;
- Horário;
- Equipe responsável;
- Ação realizada.

No protótipo, a ação registrada é:

> Vegetação cortada e ponto normalizado.

---

### 📈 Histórico de medições

Cada ponto possui um histórico das medições realizadas durante a utilização da aplicação.

O histórico é apresentado visualmente por meio de um gráfico, permitindo acompanhar a evolução da altura da vegetação e identificar mudanças de situação.

---

### 🔎 Filtros e pesquisa

A plataforma possui filtros para facilitar a localização dos pontos:

- Todos;
- Normal;
- Atenção;
- Intervenção.

Também é possível pesquisar um ponto específico utilizando o número do KM.

---

### 💾 Persistência de ocorrências

As ocorrências criadas na aplicação são armazenadas utilizando o **localStorage** do navegador.

Dessa forma, as informações permanecem disponíveis mesmo após atualizar ou recarregar a página durante a utilização do protótipo.

---

### 🏗️ Arquitetura da solução

A solução proposta pode ser representada pelo seguinte fluxo:

```text
┌─────────────────────────┐
│ Sensores de vegetação   │
│ instalados nas rodovias │
└────────────┬────────────┘
             │
             │ Medição da altura
             ▼
┌─────────────────────────┐
│ Comunicação dos dados   │
│ dos sensores            │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ Plataforma de           │
│ Monitoramento           │
└────────────┬────────────┘
             │
             ├───────────────┐
             │               │
             ▼               ▼
      Classificação      Histórico
      dos pontos        de medições
             │
             ▼
     ┌─────────────────┐
     │ Normal          │
     │ Atenção         │
     │ Intervenção     │
     └────────┬────────┘
              │
              ▼
     ┌─────────────────┐
     │ Ocorrência de   │
     │ manutenção      │
     └────────┬────────┘
              │
              ▼
     ┌─────────────────┐
     │ Equipe de       │
     │ manutenção      │
     └────────┬────────┘
              │
              ▼
        Ocorrência
         resolvida
```

### Arquitetura do protótipo desenvolvido

Nesta etapa do projeto, a aplicação web funciona como uma simulação da central de monitoramento.

```text
React
  │
  ├── Dashboard
  │
  ├── Pontos monitorados
  │
  ├── Simulador de sensores
  │
  ├── Histórico
  │
  └── Ocorrências
          │
          └── localStorage
```

A arquitetura foi mantida simples para permitir a demonstração do fluxo principal da solução.

### 🛠️ Tecnologias utilizadas

- Front-end
- React
- Vite
- JavaScript
- HTML
- CSS

 Armazenamento:

- localStorage

Desenvolvimento:

- Visual Studio Code
- Node.js
- npm
- Git
- GitHub

### 🔌 Sensores e protótipo físico

A proposta original do projeto considera a utilização de sensores ultrassônicos para realizar a medição da vegetação.

O conceito do protótipo físico utiliza:

- 2 sensores ultrassônicos HC-SR04;
- Breadboard;
- Jumpers;
- Resistores;
- LEDs.

Os sensores seriam responsáveis por realizar as medições e permitir a identificação do crescimento da vegetação.

Nesta versão da aplicação, a comunicação com o hardware é simulada pela interface web para permitir a demonstração do fluxo completo do sistema.

### 📋 Requisitos funcionais

**RF01 — Monitorar pontos**

O sistema deve permitir visualizar os pontos monitorados nas rodovias.

**RF02 — Exibir altura da vegetação**

O sistema deve apresentar a altura atual da vegetação em cada ponto.

**RF03 — Classificar situação**

O sistema deve classificar automaticamente cada ponto como:

- Normal;
- Atenção;
- Intervenção.

**RF04 — Simular sensor**

O sistema deve permitir simular diferentes valores de altura da vegetação.

**RF05 — Gerar ocorrência**

O sistema deve permitir gerar uma ocorrência quando um ponto atingir o limite de intervenção.

**RF06 — Gerar ocorrência automaticamente**

O sistema deve criar automaticamente uma ocorrência quando a medição atingir ou ultrapassar 20 cm.

**RF07 — Registrar ocorrência manualmente**

O operador deve poder registrar manualmente uma ocorrência de manutenção.

**RF08 — Resolver ocorrência**

O sistema deve permitir marcar uma ocorrência como resolvida.

**RF09 — Registrar atendimento**

O sistema deve armazenar informações relacionadas à resolução da ocorrência.

**RF10 — Consultar histórico**

O sistema deve apresentar o histórico das medições realizadas.

**RF11 — Filtrar pontos**

O sistema deve permitir filtrar os pontos de acordo com sua situação.

**RF12 — Pesquisar pontos**

O sistema deve permitir pesquisar pontos pelo número do KM.

### ⚙️ Requisitos não funcionais

**RNF01 — Usabilidade**

A interface deve apresentar as informações de forma simples e objetiva para facilitar a utilização por operadores.

**RNF02 — Responsividade**

A aplicação deve se adaptar a diferentes tamanhos de tela.

**RNF03 — Desempenho**

A interface deve responder rapidamente às interações realizadas pelo usuário.

**RNF04 — Persistência**

As ocorrências devem permanecer armazenadas durante a utilização do protótipo mesmo após o recarregamento da página.

**RNF05 — Manutenibilidade**

O código deve possuir uma estrutura organizada para facilitar futuras evoluções da aplicação.

### 🗓️ Planejamento e desenvolvimento

O desenvolvimento do projeto foi realizado de forma incremental.

**Etapa 1 — Definição do problema**

Identificação da necessidade de acompanhar o crescimento da vegetação próxima às rodovias.

**Etapa 2 — Definição da solução**

Definição da utilização de sensores e de uma plataforma central de monitoramento.

**Etapa 3 — Desenvolvimento da interface**

Criação da central de monitoramento utilizando React e Vite.

**Etapa 4 — Implementação da simulação**

Implementação do simulador de sensores e da classificação automática dos pontos.

**Etapa 5 — Implementação das ocorrências**

Criação do fluxo de registro, acompanhamento e resolução das ocorrências de manutenção.

**Etapa 6 — Persistência**

Implementação do armazenamento das ocorrências utilizando localStorage.

**Etapa 7 — Testes**

Testes do fluxo completo:

```text
Medição
   ↓
Classificação
   ↓
Alerta
   ↓
Ocorrência
   ↓
Manutenção
   ↓
Resolução
```

### 🚀 Como executar o projeto

**Pré-requisitos**

É necessário ter instalado:

- Node.js
- npm
- Git

**Instalação**

Clone o repositório:

git clone URL_DO_REPOSITORIO

Entre na pasta do projeto:

cd motiva-monitoramento

Instale as dependências:

npm install

Execute a aplicação:

npm run dev

Depois acesse no navegador o endereço apresentado pelo Vite, normalmente:

http://localhost:5173/

### 📁 Estrutura do projeto

```text
motiva-monitoramento/
│
├── public/
│
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── ...
│
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

### 🎥 Vídeo de apresentação

Link do vídeo:

https://youtu.be/bg12YApeQoE

### 👥 Integrantes

Integrantes do grupo:

| Integrante                        |     RM | Turma |
| --------------------------------- | -----: | ----- |
| Pedro Luis Tofoli                 | 564441 | 2CCPG |
| Fabricio Cardoso de Oliveira      | 561827 | 2CCPG |
| Vinicius Barbosa Gomes            | 564854 | 2CCPG |
| Leonardo Luster Gomes             | 564448 | 2CCPG |
| Nelson Troccoli Santos Neto       | 562815 | 2CCPG |
| Raphael Talarico Nascimento Silva | 565219 | 2CCPG |


