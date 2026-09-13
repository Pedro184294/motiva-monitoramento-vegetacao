import { useEffect, useState } from "react";
import "./App.css";

const pontosIniciais = [
  {
    id: 1,
    km: "031",
    rodovia: "SP-XXX",
    altura: 6,
  },
  {
    id: 2,
    km: "087",
    rodovia: "SP-XXX",
    altura: 13,
  },
  {
    id: 3,
    km: "142",
    rodovia: "SP-XXX",
    altura: 21,
  },
  {
    id: 4,
    km: "203",
    rodovia: "SP-XXX",
    altura: 8,
  },
];

const historicosIniciais = {
  1: [3, 3.5, 4, 4.5, 5, 5.5, 6],
  2: [6, 7, 8, 9, 10, 11, 13],
  3: [8, 10, 12, 15, 17, 19, 21],
  4: [4, 4.5, 5, 6, 6.5, 7, 8],
};

function obterStatus(altura) {
  if (altura >= 20) {
    return {
      nome: "Intervenção necessária",
      classe: "critico",
      mensagem:
        "A vegetação atingiu o limite permitido. É necessário acionar uma equipe de manutenção.",
    };
  }

  if (altura >= 10) {
    return {
      nome: "Atenção",
      classe: "atencao",
      mensagem:
        "A vegetação está próxima do limite. O ponto deve permanecer em monitoramento.",
    };
  }

  return {
    nome: "Normal",
    classe: "normal",
    mensagem:
      "A vegetação está dentro do nível considerado normal.",
  };
}

function App() {
  const [pontos, setPontos] = useState(pontosIniciais);

  const [pontoSelecionado, setPontoSelecionado] =
    useState(2);

  const [filtro, setFiltro] = useState("todos");

  const [busca, setBusca] = useState("");

  const [historicos, setHistoricos] =
    useState(historicosIniciais);

  const [mensagemOcorrencia, setMensagemOcorrencia] =
    useState("");

  const [ocorrencias, setOcorrencias] = useState(() => {
    const ocorrenciasSalvas =
      localStorage.getItem("motiva_ocorrencias");

    if (ocorrenciasSalvas) {
      try {
        return JSON.parse(ocorrenciasSalvas);
      } catch {
        return [
          {
            id: 1,
            km: "142",
            rodovia: "SP-XXX",
            altura: 21,
            prioridade: "Alta",
            status: "Pendente",
          },
        ];
      }
    }

    return [
      {
        id: 1,
        km: "142",
        rodovia: "SP-XXX",
        altura: 21,
        prioridade: "Alta",
        status: "Pendente",
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem(
      "motiva_ocorrencias",
      JSON.stringify(ocorrencias)
    );
  }, [ocorrencias]);

  const pontoAtual = pontos.find(
    (ponto) => ponto.id === pontoSelecionado
  );

  const statusAtual = obterStatus(
    pontoAtual.altura
  );

  const quantidadeNormais = pontos.filter(
    (ponto) => ponto.altura < 10
  ).length;

  const quantidadeAtencao = pontos.filter(
    (ponto) =>
      ponto.altura >= 10 &&
      ponto.altura < 20
  ).length;

  const quantidadeCriticos = pontos.filter(
    (ponto) => ponto.altura >= 20
  ).length;

  const ocorrenciasPendentes =
    ocorrencias.filter(
      (ocorrencia) =>
        ocorrencia.status === "Pendente"
    ).length;

  const ocorrenciaPendenteAtual =
    ocorrencias.some(
      (ocorrencia) =>
        ocorrencia.km === pontoAtual.km &&
        ocorrencia.status === "Pendente"
    );

  const pontosFiltrados = pontos.filter(
    (ponto) => {
      const status = obterStatus(
        ponto.altura
      );

      const correspondeFiltro =
        filtro === "todos" ||
        (filtro === "normal" &&
          status.classe === "normal") ||
        (filtro === "atencao" &&
          status.classe === "atencao") ||
        (filtro === "critico" &&
          status.classe === "critico");

      const correspondeBusca =
        ponto.km
          .toLowerCase()
          .includes(
            busca.toLowerCase()
          );

      return (
        correspondeFiltro &&
        correspondeBusca
      );
    }
  );

  /*
   * Cria uma ocorrência automaticamente
   * quando o sensor atingir 20 cm ou mais.
   */
  const criarOcorrenciaAutomatica = (
    novaAltura
  ) => {
    if (novaAltura < 20) {
      return;
    }

    const ponto = pontos.find(
      (item) =>
        item.id === pontoSelecionado
    );

    if (!ponto) {
      return;
    }

    const ocorrenciaPendente =
      ocorrencias.some(
        (ocorrencia) =>
          ocorrencia.km === ponto.km &&
          ocorrencia.status === "Pendente"
      );

    if (ocorrenciaPendente) {
      return;
    }

    const novaOcorrencia = {
      id: Date.now(),
      km: ponto.km,
      rodovia: ponto.rodovia,
      altura: novaAltura,
      prioridade: "Alta",
      status: "Pendente",
      origem: "Automática",
    };

    setOcorrencias(
      (ocorrenciasAtuais) => [
        novaOcorrencia,
        ...ocorrenciasAtuais,
      ]
    );

    setMensagemOcorrencia(
      `Alerta crítico: ocorrência criada automaticamente para o KM ${ponto.km}.`
    );
  };

  const alterarAltura = (
    novaAltura
  ) => {
    setPontos(
      (pontosAtuais) =>
        pontosAtuais.map(
          (ponto) =>
            ponto.id ===
            pontoSelecionado
              ? {
                  ...ponto,
                  altura: novaAltura,
                }
              : ponto
        )
    );

    setHistoricos(
      (historicosAtuais) => {
        const historicoAtual =
          historicosAtuais[
            pontoSelecionado
          ] || [];

        const novoHistorico = [
          ...historicoAtual,
          novaAltura,
        ].slice(-8);

        return {
          ...historicosAtuais,
          [pontoSelecionado]:
            novoHistorico,
        };
      }
    );

    setMensagemOcorrencia("");

    /*
     * Se o sensor atingir 20 cm ou mais,
     * uma ocorrência é criada automaticamente.
     */
    if (novaAltura >= 20) {
      criarOcorrenciaAutomatica(
        novaAltura
      );
    }
  };

  const registrarOcorrencia = () => {
    if (pontoAtual.altura < 20) {
      return;
    }

    const ocorrenciaExistente =
      ocorrencias.find(
        (ocorrencia) =>
          ocorrencia.km ===
            pontoAtual.km &&
          ocorrencia.status ===
            "Pendente"
      );

    if (ocorrenciaExistente) {
      setMensagemOcorrencia(
        "Esta ocorrência já está registrada e aguarda manutenção."
      );

      return;
    }

    const novaOcorrencia = {
      id: Date.now(),
      km: pontoAtual.km,
      rodovia: pontoAtual.rodovia,
      altura: pontoAtual.altura,
      prioridade: "Alta",
      status: "Pendente",
      origem: "Manual",
    };

    setOcorrencias(
      (ocorrenciasAtuais) => [
        novaOcorrencia,
        ...ocorrenciasAtuais,
      ]
    );

    setMensagemOcorrencia(
      `Ocorrência registrada com sucesso para o KM ${pontoAtual.km}.`
    );
  };

  const resolverOcorrencia = (id) => {
    const agora = new Date();

    const dataResolucao =
      agora.toLocaleDateString("pt-BR");

    const horaResolucao =
      agora.toLocaleTimeString(
        "pt-BR",
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      );

    setOcorrencias(
      (ocorrenciasAtuais) =>
        ocorrenciasAtuais.map(
          (ocorrencia) =>
            ocorrencia.id === id
              ? {
                  ...ocorrencia,
                  status: "Resolvida",
                  dataResolucao,
                  horaResolucao,
                  equipe:
                    "Equipe de manutenção",
                  acao:
                    "Vegetação cortada e ponto normalizado",
                }
              : ocorrencia
        )
    );
  };

  const historicoAtual =
    historicos[pontoSelecionado] || [];

  const maiorValorHistorico =
    Math.max(
      ...historicoAtual,
      30
    );

  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <div className="brand-icon">
            M
          </div>

          <div>
            <h1>MOTIVA</h1>

            <span>
              Monitoramento de Vegetação
            </span>
          </div>
        </div>

        <div className="connection">
          <span className="connection-dot"></span>
          Sistema operacional
        </div>
      </header>

      <main className="main">
        <div className="page-title">
          <div>
            <h2>
              Central de Monitoramento
            </h2>

            <p>
              Acompanhe os pontos de
              vegetação monitorados nas
              rodovias.
            </p>
          </div>

          <div className="last-update">
            Última atualização
            <strong>Agora</strong>
          </div>
        </div>

        <section className="summary-grid">
          <div className="summary-card">
            <span className="card-label">
              Pontos monitorados
            </span>

            <strong>
              {pontos.length}
            </strong>

            <small>
              Todos os pontos cadastrados
            </small>
          </div>

          <div className="summary-card normal-card">
            <span className="card-label">
              Normais
            </span>

            <strong>
              {quantidadeNormais}
            </strong>

            <small>
              Dentro do nível esperado
            </small>
          </div>

          <div className="summary-card attention-card">
            <span className="card-label">
              Em atenção
            </span>

            <strong>
              {quantidadeAtencao}
            </strong>

            <small>
              Necessitam de acompanhamento
            </small>
          </div>

          <div className="summary-card critical-card">
            <span className="card-label">
              Intervenção
            </span>

            <strong>
              {quantidadeCriticos}
            </strong>

            <small>
              Necessitam de manutenção
            </small>
          </div>
        </section>

        <section className="content-grid">
          <div className="panel">
            <div className="panel-header">
              <div>
                <h3>
                  Ponto de monitoramento
                </h3>

                <p>
                  Rodovia{" "}
                  {pontoAtual.rodovia}
                  {" • "}
                  KM{" "}
                  {pontoAtual.km}
                </p>
              </div>

              <span
                className={`status-badge ${statusAtual.classe}`}
              >
                {statusAtual.nome}
              </span>
            </div>

            <div className="measurement">
              <span>
                Altura da vegetação
              </span>

              <div
                className={`measurement-value ${statusAtual.classe}`}
              >
                {pontoAtual.altura}

                <small>
                  cm
                </small>
              </div>

              <div className="limits">
                <div>
                  <span>
                    Limite de atenção
                  </span>

                  <strong>
                    10 cm
                  </strong>
                </div>

                <div>
                  <span>
                    Limite de intervenção
                  </span>

                  <strong>
                    20 cm
                  </strong>
                </div>
              </div>
            </div>

            <div
              className={`alert-message ${statusAtual.classe}`}
            >
              <strong>
                {statusAtual.nome}
              </strong>

              <p>
                {statusAtual.mensagem}
              </p>
            </div>

            {pontoAtual.altura >= 20 && (
              <div className="occurrence-action">
                <button
                  className={`register-button ${
                    ocorrenciaPendenteAtual
                      ? "registered"
                      : ""
                  }`}
                  onClick={
                    registrarOcorrencia
                  }
                  disabled={
                    ocorrenciaPendenteAtual
                  }
                >
                  {ocorrenciaPendenteAtual
                    ? "Ocorrência registrada"
                    : "Registrar ocorrência"}
                </button>

                <span>
                  {ocorrenciaPendenteAtual
                    ? "Esta ocorrência está aguardando atendimento da equipe de manutenção."
                    : "Crie uma solicitação de manutenção para este ponto."}
                </span>
              </div>
            )}

            {mensagemOcorrencia && (
              <div className="occurrence-success">
                <strong>
                  ✓ Ocorrência registrada
                  com sucesso
                </strong>

                <span>
                  {mensagemOcorrencia}
                </span>
              </div>
            )}
          </div>

          <div className="panel simulator">
            <div className="panel-header">
              <div>
                <h3>
                  Simulação do sensor
                </h3>

                <p>
                  Simule o crescimento da
                  vegetação no KM{" "}
                  {pontoAtual.km}.
                </p>
              </div>
            </div>

            <div className="slider-container">
              <label>
                <span>
                  Altura simulada
                </span>

                <strong>
                  {pontoAtual.altura} cm
                </strong>
              </label>

              <input
                type="range"
                min="0"
                max="30"
                value={pontoAtual.altura}
                onChange={(event) =>
                  alterarAltura(
                    Number(
                      event.target.value
                    )
                  )
                }
              />

              <div className="slider-labels">
                <span>0 cm</span>
                <span>10 cm</span>
                <span>20 cm</span>
                <span>30 cm</span>
              </div>
            </div>

            <div className="simulation-buttons">
              <button
                onClick={() =>
                  alterarAltura(5)
                }
              >
                Normal
              </button>

              <button
                onClick={() =>
                  alterarAltura(12)
                }
              >
                Atenção
              </button>

              <button
                onClick={() =>
                  alterarAltura(21)
                }
              >
                Crítico
              </button>
            </div>

            <div className="sensor-info">
              <span className="sensor-icon">
                ◉
              </span>

              <div>
                <strong>
                  Sensor ativo
                </strong>

                <p>
                  Dados recebidos normalmente
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="panel history-panel">
          <div className="panel-header">
            <div>
              <h3>
                Histórico de medições
              </h3>

              <p>
                Evolução da altura da
                vegetação no KM{" "}
                {pontoAtual.km}.
              </p>
            </div>

            <span className="history-current">
              Atual:{" "}
              {pontoAtual.altura} cm
            </span>
          </div>

          <div className="history-chart">
            <div className="chart-y-axis">
              <span>30</span>
              <span>20</span>
              <span>10</span>
              <span>0</span>
            </div>

            <div className="chart-area">
              <div className="chart-grid-line"></div>
              <div className="chart-grid-line"></div>
              <div className="chart-grid-line"></div>
              <div className="chart-grid-line"></div>

              <div className="chart-bars">
                {historicoAtual.map(
                  (
                    valor,
                    index
                  ) => {
                    const alturaBarra =
                      (valor /
                        maiorValorHistorico) *
                      100;

                    const status =
                      obterStatus(
                        valor
                      );

                    return (
                      <div
                        className="chart-column"
                        key={index}
                      >
                        <div
                          className={`chart-bar ${status.classe}`}
                          style={{
                            height: `${alturaBarra}%`,
                          }}
                          title={`${valor} cm`}
                        >
                          <span>
                            {valor}
                          </span>
                        </div>

                        <small>
                          {index + 1}
                        </small>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </div>

          <div className="history-legend">
            <span>
              <i className="legend-normal"></i>
              Normal
            </span>

            <span>
              <i className="legend-attention"></i>
              Atenção
            </span>

            <span>
              <i className="legend-critical"></i>
              Intervenção
            </span>
          </div>
        </section>

        <section className="panel occurrences-panel">
          <div className="panel-header">
            <div>
              <h3>
                Ocorrências de manutenção
              </h3>

              <p>
                Acompanhe os pontos que
                precisam de intervenção.
              </p>
            </div>

            <span className="occurrence-counter">
              {ocorrenciasPendentes}{" "}
              pendente
              {ocorrenciasPendentes !==
              1
                ? "s"
                : ""}
            </span>
          </div>

          <div className="occurrence-list">
            {ocorrencias.length > 0 ? (
              ocorrencias.map(
                (ocorrencia) => (
                  <div
                    className={`occurrence-row ${
                      ocorrencia.status ===
                      "Resolvida"
                        ? "resolved"
                        : ""
                    }`}
                    key={
                      ocorrencia.id
                    }
                  >
                    <div className="occurrence-indicator"></div>

                    <div className="occurrence-location">
                      <strong>
                        Rodovia{" "}
                        {
                          ocorrencia.rodovia
                        }
                        {" • "}
                        KM{" "}
                        {
                          ocorrencia.km
                        }
                      </strong>

                      <span>
                        Vegetação:
                        {" "}
                        {
                          ocorrencia.altura
                        }{" "}
                        cm
                      </span>

                      {ocorrencia.origem && (
                        <span>
                          Origem:{" "}
                          {
                            ocorrencia.origem
                          }
                        </span>
                      )}

                      {ocorrencia.status ===
                        "Resolvida" && (
                        <span className="resolution-info">
                          Atendimento:{" "}
                          {
                            ocorrencia.dataResolucao
                          }{" "}
                          às{" "}
                          {
                            ocorrencia.horaResolucao
                          }{" "}
                          •{" "}
                          {
                            ocorrencia.equipe
                          }
                        </span>
                      )}
                    </div>

                    <span className="priority-badge">
                      {
                        ocorrencia.prioridade
                      }
                    </span>

                    {ocorrencia.status ===
                      "Resolvida" && (
                      <span className="resolution-action">
                        {
                          ocorrencia.acao
                        }
                      </span>
                    )}

                    <span
                      className={`occurrence-status ${
                        ocorrencia.status ===
                        "Resolvida"
                          ? "resolved-status"
                          : ""
                      }`}
                    >
                      {
                        ocorrencia.status
                      }
                    </span>

                    {ocorrencia.status ===
                      "Pendente" && (
                      <button
                        className="resolve-button"
                        onClick={() =>
                          resolverOcorrencia(
                            ocorrencia.id
                          )
                        }
                      >
                        Marcar como resolvida
                      </button>
                    )}
                  </div>
                )
              )
            ) : (
              <div className="empty-occurrences">
                Nenhuma ocorrência
                registrada.
              </div>
            )}
          </div>
        </section>

        <section className="panel alerts-panel">
          <div className="panel-header">
            <div>
              <h3>
                Pontos monitorados
              </h3>

              <p>
                Selecione um ponto para
                visualizar seus dados.
              </p>
            </div>
          </div>

          <div className="filters">
            <div className="filter-buttons">
              <button
                className={
                  filtro === "todos"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setFiltro("todos")
                }
              >
                Todos
              </button>

              <button
                className={
                  filtro === "normal"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setFiltro("normal")
                }
              >
                🟢 Normal
              </button>

              <button
                className={
                  filtro === "atencao"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setFiltro("atencao")
                }
              >
                🟡 Atenção
              </button>

              <button
                className={
                  filtro === "critico"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setFiltro("critico")
                }
              >
                🔴 Intervenção
              </button>
            </div>

            <input
              type="text"
              placeholder="Pesquisar KM..."
              value={busca}
              onChange={(event) =>
                setBusca(
                  event.target.value
                )
              }
            />
          </div>

          <div className="alert-list">
            {pontosFiltrados.length >
            0 ? (
              pontosFiltrados.map(
                (ponto) => {
                  const status =
                    obterStatus(
                      ponto.altura
                    );

                  return (
                    <div
                      key={ponto.id}
                      className={`alert-row ${status.classe}`}
                      onClick={() =>
                        setPontoSelecionado(
                          ponto.id
                        )
                      }
                      style={{
                        cursor:
                          "pointer",
                      }}
                    >
                      <div className="alert-indicator"></div>

                      <div className="alert-location">
                        <strong>
                          Rodovia{" "}
                          {
                            ponto.rodovia
                          }
                          {" • "}
                          KM{" "}
                          {ponto.km}
                        </strong>

                        <span>
                          {
                            status.nome
                          }
                        </span>
                      </div>

                      <strong className="alert-height">
                        {ponto.altura}{" "}
                        cm
                      </strong>

                      <span className="alert-time">
                        Monitoramento
                      </span>
                    </div>
                  );
                }
              )
            ) : (
              <div className="no-results">
                Nenhum ponto
                encontrado.
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="footer">
        <span>
          Motiva • Plataforma de
          Monitoramento de Vegetação
        </span>

        <span>
          Protótipo acadêmico
        </span>
      </footer>
    </div>
  );
}

export default App;