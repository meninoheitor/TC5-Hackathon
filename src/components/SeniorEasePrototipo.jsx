import React, { useState } from "react";
import {
  Type,
  Eye,
  AlignJustify,
  Layers,
  BellRing,
  ShieldCheck,
  CheckCircle2,
  Circle,
  ListChecks,
  UserCircle2,
  Settings2,
  ArrowRight,
  ArrowLeft,
  Check,
  X,
  ChevronRight,
  RotateCcw,
} from "lucide-react";

// ---------------------------------------------------------------------------
// SeniorEase — protótipo funcional (Web)
// ---------------------------------------------------------------------------
// Este componente é ao mesmo tempo a DEMONSTRAÇÃO e o PRODUTO: os controles
// do "Painel de Personalização" alteram, em tempo real, o tamanho de fonte,
// contraste, espaçamento e modo de toda a aplicação — incluindo o Organizador
// de Atividades e o Perfil. É a forma mais honesta de provar que a
// acessibilidade é real, e não só uma promessa no briefing.
//
// O que é REAL neste protótipo:
// - Toda a lógica de escala de fonte, contraste, espaçamento e modo.
// - O fluxo guiado de tarefas, com confirmação extra opcional.
// - O feedback visual reforçado (mensagens maiores e mais demoradas).
//
// O que é SIMULADO (fica documentado em SeniorEase-Arquitetura.md):
// - Persistência: aqui vive em estado do React; no produto real seria salva
//   no Perfil do usuário via backend (ver documento de arquitetura).
// - Autenticação e dados reais de matrícula/atividades.
// ---------------------------------------------------------------------------

const TOKENS = {
  padrao: {
    bg: "#FAF7F1",
    surface: "#FFFFFF",
    surfaceAlt: "#F1ECE0",
    text: "#1C2B2F",
    textMuted: "#556066",
    primary: "#0F6E4F",
    primaryDark: "#0B4F39",
    alert: "#A6432E",
    info: "#1D4E86",
    border: "#DCD5C4",
  },
  alto: {
    bg: "#FFFFFF",
    surface: "#FFFFFF",
    surfaceAlt: "#F0F0F0",
    text: "#000000",
    textMuted: "#1A1A1A",
    primary: "#065A3D",
    primaryDark: "#04402C",
    alert: "#7A1F10",
    info: "#0E2F57",
    border: "#000000",
  },
};

const FONT_STEPS = [
  { valor: 1, rotulo: "Normal" },
  { valor: 1.25, rotulo: "Grande" },
  { valor: 1.5, rotulo: "Extra grande" },
];

const SPACING_STEPS = [
  { valor: 0.8, rotulo: "Compacto" },
  { valor: 1, rotulo: "Confortável" },
  { valor: 1.35, rotulo: "Amplo" },
];

const TAREFAS_INICIAIS = [
  {
    id: "t1",
    titulo: "Emitir declaração de matrícula",
    etapaAtual: 0,
    concluida: false,
    critica: false,
    etapas: [
      "Acessar o Portal do Aluno",
      "Selecionar a opção \"Documentos\"",
      "Clicar em \"Emitir declaração de matrícula\"",
      "Conferir seus dados e confirmar",
    ],
  },
  {
    id: "t2",
    titulo: "Enviar atividade de Matemática",
    etapaAtual: 1,
    concluida: false,
    critica: true,
    etapas: [
      "Abrir a disciplina \"Matemática\"",
      "Anexar o arquivo da atividade",
      "Revisar antes de enviar",
      "Enviar definitivamente (não dá para desfazer)",
    ],
  },
  {
    id: "t3",
    titulo: "Atualizar telefone de contato",
    etapaAtual: 0,
    concluida: true,
    critica: false,
    etapas: ["Abrir \"Meu Perfil\"", "Editar telefone", "Salvar alteração"],
  },
];

export default function SeniorEasePrototipo() {
  const [aba, setAba] = useState("painel");
  const [fonte, setFonte] = useState(1);
  const [contraste, setContraste] = useState("padrao");
  const [espacamento, setEspacamento] = useState(1);
  const [modo, setModo] = useState("simplificado");
  const [feedbackReforcado, setFeedbackReforcado] = useState(true);
  const [confirmarCritico, setConfirmarCritico] = useState(true);
  const [tarefas, setTarefas] = useState(TAREFAS_INICIAIS);
  const [toast, setToast] = useState(null);
  const [modalConfirm, setModalConfirm] = useState(null);

  const t = TOKENS[contraste];
  const f = (base) => `${(base * fonte).toFixed(2)}rem`;
  const s = (base) => `${(base * espacamento).toFixed(2)}rem`;

  function mostrarToast(mensagem, tipo = "sucesso") {
    setToast({ mensagem, tipo });
    window.clearTimeout(mostrarToast._timer);
    mostrarToast._timer = window.setTimeout(
      () => setToast(null),
      feedbackReforcado ? 4200 : 2200
    );
  }

  function avancarEtapa(id) {
    setTarefas((atual) =>
      atual.map((tarefa) => {
        if (tarefa.id !== id) return tarefa;
        const ultimaEtapa = tarefa.etapaAtual >= tarefa.etapas.length - 1;
        if (!ultimaEtapa) {
          return { ...tarefa, etapaAtual: tarefa.etapaAtual + 1 };
        }
        return tarefa;
      })
    );
  }

  function pedirConclusao(tarefa) {
    if (confirmarCritico && tarefa.critica) {
      setModalConfirm(tarefa.id);
      return;
    }
    concluirTarefa(tarefa.id);
  }

  function concluirTarefa(id) {
    setTarefas((atual) =>
      atual.map((tarefa) =>
        tarefa.id === id ? { ...tarefa, concluida: true } : tarefa
      )
    );
    setModalConfirm(null);
    mostrarToast("Concluído! Muito bem, a tarefa foi salva.", "sucesso");
  }

  return (
    <div
      style={{
        background: t.bg,
        color: t.text,
        fontFamily: "'Atkinson Hyperlegible', system-ui, sans-serif",
        minHeight: "100%",
        padding: s(1.5),
        lineHeight: 1.6,
        transition: "background 0.2s ease, color 0.2s ease",
      }}
    >
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&family=Fraunces:opsz,wght@9..144,500;9..144,700&display=swap"
      />

      {/* ---------- SEÇÃO 1: A TESE, EM UMA COMPARAÇÃO DIRETA ---------- */}
      <div style={{ maxWidth: "1040px", margin: "0 auto", marginBottom: s(2.5) }}>
        <p
          style={{
            fontFamily: "'Fraunces', serif",
            fontWeight: 500,
            fontSize: f(1),
            color: t.primary,
            margin: 0,
            letterSpacing: "0.02em",
          }}
        >
          SeniorEase
        </p>
        <h1
          style={{
            fontFamily: "'Fraunces', serif",
            fontWeight: 500,
            fontSize: f(2.1),
            margin: `${s(0.3)} 0 ${s(1)}`,
            maxWidth: "22ch",
          }}
        >
          A mesma tela. Só que dá para ler, entender e confiar.
        </h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: s(1.25),
          }}
        >
          {/* Interface comum */}
          <div
            style={{
              background: "#F4F4F2",
              border: "1px solid #D8D8D3",
              borderRadius: "10px",
              padding: "14px",
              opacity: 0.9,
            }}
          >
            <p style={{ fontSize: "11px", color: "#8A8A85", margin: "0 0 8px", fontFamily: "system-ui" }}>
              Interface comum
            </p>
            <div style={{ fontSize: "11px", fontFamily: "system-ui", color: "#4A4A47" }}>
              <div style={{ display: "flex", gap: "6px", marginBottom: "6px", flexWrap: "wrap" }}>
                {["Início", "Cursos", "Notas", "Financeiro", "Mensagens", "Config"].map((item) => (
                  <span
                    key={item}
                    style={{
                      padding: "3px 6px",
                      border: "1px solid #DDD",
                      borderRadius: "4px",
                      color: "#8A8A85",
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
              <p style={{ margin: "8px 0 4px", color: "#9A9A95" }}>
                Atividade pendente • Matemática • entrega em 2 dias • enviar arquivo .pdf
                ou .docx pelo formulário abaixo, respeitando o limite de 10MB por anexo
              </p>
              <div style={{ display: "flex", gap: "4px" }}>
                <button style={{ fontSize: "10px", padding: "2px 6px", border: "1px solid #CCC", background: "#EEE", color: "#888" }}>
                  cancelar
                </button>
                <button style={{ fontSize: "10px", padding: "2px 6px", border: "1px solid #CCC", background: "#EEE", color: "#888" }}>
                  salvar rascunho
                </button>
                <button style={{ fontSize: "10px", padding: "2px 6px", border: "1px solid #CCC", background: "#EEE", color: "#888" }}>
                  enviar
                </button>
              </div>
            </div>
          </div>

          {/* Interface SeniorEase */}
          <div
            style={{
              background: t.surface,
              border: `2px solid ${t.primary}`,
              borderRadius: "10px",
              padding: "16px",
            }}
          >
            <p style={{ fontSize: "12px", color: t.primary, margin: "0 0 10px", fontWeight: 700 }}>
              Interface SeniorEase
            </p>
            <p style={{ fontSize: "15px", margin: "0 0 12px", color: t.text }}>
              Você tem <strong>1 atividade</strong> para entregar: Matemática.
            </p>
            <button
              style={{
                display: "block",
                width: "100%",
                padding: "10px 14px",
                fontSize: "15px",
                fontWeight: 700,
                background: t.primary,
                color: "#FFFFFF",
                border: "none",
                borderRadius: "8px",
              }}
            >
              Enviar atividade agora
            </button>
          </div>
        </div>
      </div>

      {/* ---------- SEÇÃO 2: O APP DE VERDADE ---------- */}
      <div
        style={{
          maxWidth: "1040px",
          margin: "0 auto",
          background: t.surface,
          border: `1px solid ${t.border}`,
          borderRadius: "16px",
          overflow: "hidden",
        }}
      >
        {/* Barra superior do app */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: `${s(0.9)} ${s(1.25)}`,
            borderBottom: `1px solid ${t.border}`,
            background: t.surfaceAlt,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "50%",
                background: t.primary,
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: f(0.85),
              }}
            >
              D
            </div>
            <p style={{ margin: 0, fontSize: f(0.95), fontWeight: 700 }}>Olá, Dona Marta</p>
          </div>
          <span style={{ fontSize: f(0.75), color: t.textMuted }}>
            Modo: {modo === "simplificado" ? "Simplificado" : "Avançado"}
          </span>
        </div>

        {/* Navegação por abas — grandes, com rótulo + ícone */}
        <div
          style={{
            display: "flex",
            borderBottom: `1px solid ${t.border}`,
          }}
          role="tablist"
          aria-label="Seções do SeniorEase"
        >
          {[
            { id: "painel", rotulo: "Painel de personalização", Icone: Settings2 },
            { id: "tarefas", rotulo: "Minhas atividades", Icone: ListChecks },
            { id: "perfil", rotulo: "Meu perfil", Icone: UserCircle2 },
          ].map(({ id, rotulo, Icone }) => (
            <button
              key={id}
              role="tab"
              aria-selected={aba === id}
              onClick={() => setAba(id)}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: modo === "simplificado" ? "column" : "row",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: `${s(0.9)} ${s(0.5)}`,
                fontSize: f(0.85),
                fontWeight: aba === id ? 700 : 400,
                fontFamily: "inherit",
                color: aba === id ? t.primary : t.text,
                background: aba === id ? t.bg : "transparent",
                border: "none",
                borderBottom: aba === id ? `3px solid ${t.primary}` : "3px solid transparent",
                cursor: "pointer",
              }}
            >
              <Icone size={22} aria-hidden="true" />
              {rotulo}
            </button>
          ))}
        </div>

        {/* Conteúdo da aba ativa */}
        <div style={{ padding: s(1.5) }}>
          {aba === "painel" && (
            <PainelPersonalizacao
              t={t}
              f={f}
              s={s}
              fonte={fonte}
              setFonte={setFonte}
              contraste={contraste}
              setContraste={setContraste}
              espacamento={espacamento}
              setEspacamento={setEspacamento}
              modo={modo}
              setModo={setModo}
              feedbackReforcado={feedbackReforcado}
              setFeedbackReforcado={setFeedbackReforcado}
              confirmarCritico={confirmarCritico}
              setConfirmarCritico={setConfirmarCritico}
            />
          )}

          {aba === "tarefas" && (
            <OrganizadorAtividades
              t={t}
              f={f}
              s={s}
              modo={modo}
              tarefas={tarefas}
              avancarEtapa={avancarEtapa}
              pedirConclusao={pedirConclusao}
            />
          )}

          {aba === "perfil" && (
            <Perfil
              t={t}
              f={f}
              s={s}
              fonte={fonte}
              contraste={contraste}
              espacamento={espacamento}
              modo={modo}
              feedbackReforcado={feedbackReforcado}
              confirmarCritico={confirmarCritico}
              irParaPainel={() => setAba("painel")}
            />
          )}
        </div>
      </div>

      {/* ---------- MODAL DE CONFIRMAÇÃO EXTRA ---------- */}
      {modalConfirm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(28,43,47,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
            zIndex: 50,
          }}
          role="dialog"
          aria-modal="true"
        >
          <div
            style={{
              background: t.surface,
              borderRadius: "14px",
              padding: s(1.5),
              maxWidth: "420px",
              width: "100%",
              border: `2px solid ${t.alert}`,
            }}
          >
            <p style={{ fontSize: f(1.05), fontWeight: 700, margin: "0 0 8px" }}>
              Tem certeza?
            </p>
            <p style={{ fontSize: f(0.9), color: t.textMuted, margin: "0 0 20px" }}>
              Depois de enviada, essa atividade não pode ser alterada. Confira se
              está tudo certo antes de continuar.
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => setModalConfirm(null)}
                style={{
                  flex: 1,
                  padding: "12px",
                  fontSize: f(0.9),
                  fontWeight: 700,
                  borderRadius: "8px",
                  border: `1px solid ${t.border}`,
                  background: t.surface,
                  color: t.text,
                }}
              >
                Voltar e revisar
              </button>
              <button
                onClick={() => concluirTarefa(modalConfirm)}
                style={{
                  flex: 1,
                  padding: "12px",
                  fontSize: f(0.9),
                  fontWeight: 700,
                  borderRadius: "8px",
                  border: "none",
                  background: t.alert,
                  color: "#fff",
                }}
              >
                Sim, enviar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------- FEEDBACK (toast) ---------- */}
      {toast && (
        <div
          role="status"
          style={{
            position: "fixed",
            bottom: "24px",
            left: "50%",
            transform: "translateX(-50%)",
            background: t.primary,
            color: "#fff",
            padding: feedbackReforcado ? "16px 24px" : "10px 16px",
            borderRadius: "10px",
            fontSize: feedbackReforcado ? f(1) : f(0.85),
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: "10px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
            zIndex: 60,
          }}
        >
          <CheckCircle2 size={feedbackReforcado ? 26 : 18} aria-hidden="true" />
          {toast.mensagem}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Aba 1 — Painel de Personalização
// ---------------------------------------------------------------------------
function PainelPersonalizacao(props) {
  const {
    t, f, s, fonte, setFonte, contraste, setContraste, espacamento, setEspacamento,
    modo, setModo, feedbackReforcado, setFeedbackReforcado, confirmarCritico, setConfirmarCritico,
  } = props;

  return (
    <div>
      <h2 style={{ fontSize: f(1.3), margin: `0 0 ${s(0.3)}`, fontWeight: 700 }}>
        Ajuste a tela do seu jeito
      </h2>
      <p style={{ fontSize: f(0.9), color: t.textMuted, margin: `0 0 ${s(1.3)}` }}>
        Toda mudança aqui é aplicada na hora, em todo o SeniorEase.
      </p>

      <div style={{ display: "grid", gap: s(1.1) }}>
        <ConfigLinha
          icone={Type}
          t={t}
          f={f}
          titulo="Tamanho da fonte"
          descricao="Deixe as letras do tamanho que for confortável para você."
        >
          <SegmentedControl
            t={t}
            f={f}
            opcoes={FONT_STEPS.map((o) => ({ valor: o.valor, rotulo: o.rotulo }))}
            valor={fonte}
            aoMudar={setFonte}
          />
        </ConfigLinha>

        <ConfigLinha
          icone={Eye}
          t={t}
          f={f}
          titulo="Contraste"
          descricao="Contraste alto usa preto e branco puros, mais fácil de enxergar."
        >
          <SegmentedControl
            t={t}
            f={f}
            opcoes={[
              { valor: "padrao", rotulo: "Padrão" },
              { valor: "alto", rotulo: "Alto contraste" },
            ]}
            valor={contraste}
            aoMudar={setContraste}
          />
        </ConfigLinha>

        <ConfigLinha
          icone={AlignJustify}
          t={t}
          f={f}
          titulo="Espaçamento entre elementos"
          descricao="Mais espaço entre botões e textos ajuda a evitar cliques errados."
        >
          <SegmentedControl
            t={t}
            f={f}
            opcoes={SPACING_STEPS.map((o) => ({ valor: o.valor, rotulo: o.rotulo }))}
            valor={espacamento}
            aoMudar={setEspacamento}
          />
        </ConfigLinha>

        <ConfigLinha
          icone={Layers}
          t={t}
          f={f}
          titulo="Modo de navegação"
          descricao='"Simplificado" mostra só o essencial. "Avançado" mostra mais opções na tela.'
        >
          <SegmentedControl
            t={t}
            f={f}
            opcoes={[
              { valor: "simplificado", rotulo: "Simplificado" },
              { valor: "avancado", rotulo: "Avançado" },
            ]}
            valor={modo}
            aoMudar={setModo}
          />
        </ConfigLinha>

        <ConfigLinha
          icone={BellRing}
          t={t}
          f={f}
          titulo="Feedback visual reforçado"
          descricao="Mensagens de confirmação maiores e que ficam mais tempo na tela."
        >
          <Interruptor t={t} ligado={feedbackReforcado} aoMudar={setFeedbackReforcado} />
        </ConfigLinha>

        <ConfigLinha
          icone={ShieldCheck}
          t={t}
          f={f}
          titulo="Confirmação extra antes de ações críticas"
          descricao="Pede para você confirmar de novo antes de ações que não podem ser desfeitas."
        >
          <Interruptor t={t} ligado={confirmarCritico} aoMudar={setConfirmarCritico} />
        </ConfigLinha>
      </div>

      <button
        onClick={() => {
          setFonte(1);
          setContraste("padrao");
          setEspacamento(1);
          setModo("simplificado");
          setFeedbackReforcado(true);
          setConfirmarCritico(true);
        }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginTop: s(1.4),
          padding: `${s(0.6)} ${s(1)}`,
          fontSize: f(0.85),
          fontFamily: "inherit",
          color: t.textMuted,
          background: "transparent",
          border: `1px solid ${t.border}`,
          borderRadius: "8px",
        }}
      >
        <RotateCcw size={18} aria-hidden="true" />
        Restaurar padrão recomendado
      </button>
    </div>
  );
}

function ConfigLinha({ icone: Icone, t, f, titulo, descricao, children }) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "16px",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px",
        background: t.surfaceAlt,
        borderRadius: "12px",
        border: `1px solid ${t.border}`,
      }}
    >
      <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", flex: "1 1 240px" }}>
        <Icone size={24} style={{ color: t.primary, flexShrink: 0, marginTop: "2px" }} aria-hidden="true" />
        <div>
          <p style={{ margin: 0, fontSize: f(0.95), fontWeight: 700 }}>{titulo}</p>
          <p style={{ margin: "4px 0 0", fontSize: f(0.8), color: t.textMuted, maxWidth: "42ch" }}>
            {descricao}
          </p>
        </div>
      </div>
      {children}
    </div>
  );
}

function SegmentedControl({ t, f, opcoes, valor, aoMudar }) {
  return (
    <div
      role="radiogroup"
      style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}
    >
      {opcoes.map((op) => {
        const ativo = op.valor === valor;
        return (
          <button
            key={op.rotulo}
            role="radio"
            aria-checked={ativo}
            onClick={() => aoMudar(op.valor)}
            style={{
              padding: "10px 16px",
              fontSize: f(0.85),
              fontFamily: "inherit",
              fontWeight: ativo ? 700 : 400,
              borderRadius: "8px",
              border: `2px solid ${ativo ? t.primary : t.border}`,
              background: ativo ? t.primary : t.surface,
              color: ativo ? "#fff" : t.text,
              cursor: "pointer",
              minHeight: "44px",
            }}
          >
            {op.rotulo}
          </button>
        );
      })}
    </div>
  );
}

function Interruptor({ t, ligado, aoMudar }) {
  return (
    <button
      role="switch"
      aria-checked={ligado}
      onClick={() => aoMudar(!ligado)}
      style={{
        width: "60px",
        height: "34px",
        borderRadius: "20px",
        border: `2px solid ${ligado ? t.primary : t.border}`,
        background: ligado ? t.primary : t.surface,
        position: "relative",
        cursor: "pointer",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: "2px",
          left: ligado ? "28px" : "2px",
          width: "26px",
          height: "26px",
          borderRadius: "50%",
          background: ligado ? "#fff" : t.textMuted,
          transition: "left 0.15s ease",
        }}
      />
    </button>
  );
}

// ---------------------------------------------------------------------------
// Aba 2 — Organizador de Atividades
// ---------------------------------------------------------------------------
function OrganizadorAtividades({ t, f, s, modo, tarefas, avancarEtapa, pedirConclusao }) {
  const pendentes = tarefas.filter((tar) => !tar.concluida);
  const feitas = tarefas.filter((tar) => tar.concluida);

  return (
    <div>
      <h2 style={{ fontSize: f(1.3), margin: `0 0 ${s(0.3)}`, fontWeight: 700 }}>
        Minhas atividades
      </h2>
      <p style={{ fontSize: f(0.9), color: t.textMuted, margin: `0 0 ${s(1.3)}` }}>
        {pendentes.length === 0
          ? "Nenhuma atividade pendente. Você está em dia!"
          : `Você tem ${pendentes.length} atividade${pendentes.length > 1 ? "s" : ""} para fazer.`}
      </p>

      <div style={{ display: "grid", gap: s(1) }}>
        {pendentes.map((tar) => (
          <TarefaCard
            key={tar.id}
            t={t}
            f={f}
            s={s}
            modo={modo}
            tarefa={tar}
            avancarEtapa={avancarEtapa}
            pedirConclusao={pedirConclusao}
          />
        ))}
      </div>

      {feitas.length > 0 && (
        <div style={{ marginTop: s(1.6) }}>
          <p style={{ fontSize: f(0.95), fontWeight: 700, margin: `0 0 ${s(0.6)}`, color: t.textMuted }}>
            Histórico de atividades concluídas
          </p>
          <div style={{ display: "grid", gap: "8px" }}>
            {feitas.map((tar) => (
              <div
                key={tar.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "12px 14px",
                  borderRadius: "10px",
                  background: t.surfaceAlt,
                  color: t.textMuted,
                }}
              >
                <CheckCircle2 size={20} style={{ color: t.primary }} aria-hidden="true" />
                <span style={{ fontSize: f(0.85), textDecoration: "line-through" }}>{tar.titulo}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TarefaCard({ t, f, s, modo, tarefa, avancarEtapa, pedirConclusao }) {
  const totalEtapas = tarefa.etapas.length;
  const naUltimaEtapa = tarefa.etapaAtual >= totalEtapas - 1;

  return (
    <div
      style={{
        border: `1px solid ${t.border}`,
        borderRadius: "12px",
        padding: s(1),
        background: t.surface,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px" }}>
        <p style={{ fontSize: f(1.05), fontWeight: 700, margin: 0 }}>{tarefa.titulo}</p>
        {tarefa.critica && (
          <span
            style={{
              fontSize: f(0.7),
              fontWeight: 700,
              color: t.alert,
              border: `1px solid ${t.alert}`,
              borderRadius: "6px",
              padding: "2px 8px",
              whiteSpace: "nowrap",
            }}
          >
            Ação definitiva
          </span>
        )}
      </div>

      <p style={{ fontSize: f(0.8), color: t.textMuted, margin: `${s(0.3)} 0 ${s(0.8)}` }}>
        Passo {tarefa.etapaAtual + 1} de {totalEtapas}
      </p>

      {modo === "avancado" && (
        <ol style={{ margin: `0 0 ${s(0.8)}`, paddingLeft: "20px" }}>
          {tarefa.etapas.map((etapa, i) => (
            <li
              key={etapa}
              style={{
                fontSize: f(0.85),
                color: i <= tarefa.etapaAtual ? t.text : t.textMuted,
                fontWeight: i === tarefa.etapaAtual ? 700 : 400,
                marginBottom: "4px",
              }}
            >
              {etapa}
            </li>
          ))}
        </ol>
      )}

      {modo === "simplificado" && (
        <p style={{ fontSize: f(0.95), margin: `0 0 ${s(0.8)}` }}>
          {tarefa.etapas[tarefa.etapaAtual]}
        </p>
      )}

      <div style={{ display: "flex", gap: "10px" }}>
        {!naUltimaEtapa ? (
          <button
            onClick={() => avancarEtapa(tarefa.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 18px",
              fontSize: f(0.9),
              fontWeight: 700,
              fontFamily: "inherit",
              borderRadius: "8px",
              border: "none",
              background: t.primary,
              color: "#fff",
              minHeight: "44px",
            }}
          >
            Próximo passo <ArrowRight size={18} aria-hidden="true" />
          </button>
        ) : (
          <button
            onClick={() => pedirConclusao(tarefa)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 18px",
              fontSize: f(0.9),
              fontWeight: 700,
              fontFamily: "inherit",
              borderRadius: "8px",
              border: "none",
              background: tarefa.critica ? t.alert : t.primary,
              color: "#fff",
              minHeight: "44px",
            }}
          >
            <Check size={18} aria-hidden="true" /> Marcar como concluída
          </button>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Aba 3 — Perfil
// ---------------------------------------------------------------------------
function Perfil({ t, f, s, fonte, contraste, espacamento, modo, feedbackReforcado, confirmarCritico, irParaPainel }) {
  const fonteRotulo = FONT_STEPS.find((o) => o.valor === fonte)?.rotulo ?? "Normal";
  const espacamentoRotulo = SPACING_STEPS.find((o) => o.valor === espacamento)?.rotulo ?? "Confortável";

  const linhas = [
    ["Tamanho da fonte", fonteRotulo],
    ["Contraste", contraste === "alto" ? "Alto contraste" : "Padrão"],
    ["Espaçamento", espacamentoRotulo],
    ["Modo de navegação", modo === "simplificado" ? "Simplificado" : "Avançado"],
    ["Feedback visual reforçado", feedbackReforcado ? "Ativado" : "Desativado"],
    ["Confirmação extra em ações críticas", confirmarCritico ? "Ativada" : "Desativada"],
  ];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: s(1.3) }}>
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            background: t.primary,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: f(1.2),
            fontWeight: 700,
          }}
        >
          D
        </div>
        <div>
          <p style={{ margin: 0, fontSize: f(1.15), fontWeight: 700 }}>Dona Marta</p>
          <p style={{ margin: 0, fontSize: f(0.8), color: t.textMuted }}>Aluna — Turma 2026</p>
        </div>
      </div>

      <p style={{ fontSize: f(0.95), fontWeight: 700, margin: `0 0 ${s(0.6)}` }}>
        Suas preferências salvas
      </p>
      <div style={{ border: `1px solid ${t.border}`, borderRadius: "12px", overflow: "hidden" }}>
        {linhas.map(([rotulo, valor], i) => (
          <div
            key={rotulo}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "14px 16px",
              borderTop: i === 0 ? "none" : `1px solid ${t.border}`,
              background: i % 2 === 0 ? t.surface : t.surfaceAlt,
            }}
          >
            <span style={{ fontSize: f(0.85), color: t.textMuted }}>{rotulo}</span>
            <span style={{ fontSize: f(0.85), fontWeight: 700 }}>{valor}</span>
          </div>
        ))}
      </div>

      <button
        onClick={irParaPainel}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginTop: s(1.2),
          padding: "12px 18px",
          fontSize: f(0.9),
          fontWeight: 700,
          fontFamily: "inherit",
          borderRadius: "8px",
          border: `2px solid ${t.primary}`,
          background: "transparent",
          color: t.primary,
          minHeight: "44px",
        }}
      >
        Editar minhas preferências <ChevronRight size={18} aria-hidden="true" />
      </button>
    </div>
  );
}
