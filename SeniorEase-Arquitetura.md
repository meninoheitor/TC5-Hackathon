# SeniorEase — Documento de Arquitetura

## 1. Visão geral

SeniorEase é dividido em três módulos funcionais que aparecem no briefing —
**Painel de Personalização**, **Organizador de Atividades** e **Perfil** — mais um
módulo transversal de **Configurações** que os outros três consultam. A ideia
central da arquitetura é simples: **acessibilidade não é uma tela, é um estado
global**. Fonte, contraste, espaçamento, modo e confirmações não pertencem à
tela de configurações — pertencem à aplicação inteira, e cada módulo lê esse
estado sem precisar saber como ele é calculado ou onde é salvo.

Isso é o que o protótipo React entregue já demonstra na prática: mudar uma
opção no Painel re-renderiza o Organizador e o Perfil instantaneamente,
porque os três leem da mesma fonte de verdade.

## 2. Camadas (Clean Architecture)

```
┌─────────────────────────────────────────────┐
│  Frameworks & Drivers                        │  Next.js (web) / React Native (mobile),
│  (mais externo)                              │  UI Kit, navegação, storage, APIs HTTP
├─────────────────────────────────────────────┤
│  Interface Adapters                          │  Controllers de tela, presenters,
│                                               │  ViewModels, mapeadores DTO ↔ Entidade
├─────────────────────────────────────────────┤
│  Application (Casos de uso)                  │  AjustarPreferenciasDeAcessibilidade,
│                                               │  ConcluirAtividade, ListarAtividadesPendentes,
│                                               │  CarregarPerfil, SalvarPerfil
├─────────────────────────────────────────────┤
│  Domain (Entidades e regras)                 │  PreferenciasDeAcessibilidade, Atividade,
│  (mais interno, sem dependências)            │  EtapaGuiada, Usuario
└─────────────────────────────────────────────┘
```

Regra de dependência: as setas de importação sempre apontam para dentro. O
domínio não conhece React, não conhece Next.js, não conhece Flutter. Um caso
de uso como `ConcluirAtividade` recebe uma interface `RepositorioDeAtividades`
e não sabe se, por trás, existe uma API REST, um banco local ou um mock em
memória (como no protótipo).

### 2.1 Domínio (exemplo simplificado)

```ts
// domain/entities/PreferenciasDeAcessibilidade.ts
export type NivelDeFonte = "normal" | "grande" | "extra-grande";
export type NivelDeContraste = "padrao" | "alto";
export type ModoDeNavegacao = "simplificado" | "avancado";

export interface PreferenciasDeAcessibilidade {
  fonte: NivelDeFonte;
  contraste: NivelDeContraste;
  espacamento: "compacto" | "confortavel" | "amplo";
  modo: ModoDeNavegacao;
  feedbackReforcado: boolean;
  confirmarAcoesCriticas: boolean;
}

// domain/usecases/AjustarPreferencias.ts
export class AjustarPreferencias {
  constructor(private repo: RepositorioDePreferencias) {}
  async executar(novas: Partial<PreferenciasDeAcessibilidade>) {
    const atuais = await this.repo.obter();
    const atualizadas = { ...atuais, ...novas };
    await this.repo.salvar(atualizadas);
    return atualizadas;
  }
}
```

`RepositorioDePreferencias` é uma interface definida no domínio; quem a
implementa (LocalStorage no web, `AsyncStorage`/`SharedPreferences` no
mobile, ou uma API) mora na camada de infraestrutura. Isso é o que permite
reaproveitar o domínio inteiro entre Web e Mobile.

## 3. Módulos e limites

| Módulo | Responsabilidade | Depende de |
|---|---|---|
| `configuracoes` | Dono das `PreferenciasDeAcessibilidade`; expõe um hook/provider (`usePreferencias`) que qualquer módulo pode consumir | domínio compartilhado |
| `painel` | UI para editar preferências | `configuracoes` |
| `tarefas` | Organizador de atividades: listagem, etapas guiadas, conclusão, histórico | `configuracoes` (para saber como renderizar) |
| `perfil` | Exibe dados do usuário + resumo somente-leitura das preferências | `configuracoes` |

Comunicação entre módulos é feita **só através de interfaces/contratos
compartilhados** (o "domínio compartilhado"), nunca um módulo importando
componente interno de outro. Se `tarefas` precisar saber o nível de
contraste, ele consome `usePreferencias()`, não importa algo de dentro de
`painel/`.

## 4. Stack recomendada

**Web:** Next.js (App Router) + TypeScript + Zustand ou Context API para o
estado de preferências (é pequeno, não precisa de Redux) + CSS Modules ou
Tailwind com tokens de design em variáveis CSS (para permitir escala de
fonte/contraste via `:root` sem duplicar componentes).

**Mobile:** React Native (Expo) — a escolha, em vez de Flutter, é para
reaproveitar a camada de domínio em TypeScript entre Web e Mobile sem
reescrever regra de negócio em Dart. Se o time preferir Flutter por outro
motivo (ex: já domina a stack), o domínio replica-se em Dart seguindo a
mesma estrutura de pastas — a arquitetura não muda, só a linguagem.

**Persistência de preferências:** local-first (LocalStorage / AsyncStorage)
com sincronização opcional para uma conta logada, para que a preferência
"siga" o usuário entre dispositivos — importante para alguém que usa o
computador da biblioteca da faculdade e o celular em casa.

## 5. Acessibilidade — como cada requisito vira implementação técnica

| Requisito do briefing | Implementação técnica |
|---|---|
| Ajuste real de fonte | Variável CSS `--escala-fonte` multiplicando um `rem` base; nunca `px` fixo nos componentes |
| Contraste alto | Segundo conjunto de tokens de cor (`tema-alto-contraste.css`), trocado via atributo `data-contraste` no `<html>`, não reescrita de componente |
| Espaçamento | Variável `--escala-espacamento` aplicada em `padding`/`gap` via tokens, mesma lógica da fonte |
| Botões e áreas clicáveis ampliadas | Altura mínima de toque de 44×44px (WCAG) / 48dp no mobile, sempre — não é opcional, é piso |
| Feedback claro após ação | Todo caso de uso que muda estado retorna um resultado explícito que a UI transforma em mensagem (toast/banner), nunca um "silêncio" após clique |
| Navegação previsível | Mesma ordem de itens de menu em toda a aplicação; sem reordenar por "relevância" dinâmica |
| Fluxos guiados passo a passo | Componente `EtapaGuiada` reutilizável (uma etapa visível por vez em modo simplificado) em vez de formulário longo |
| Animações suaves e controláveis | `prefers-reduced-motion` respeitado por padrão; toggle de "feedback reforçado" no Painel controla intensidade, nunca liga animação decorativa que o usuário não pediu |
| Confirmação antes de ações irreversíveis | Camada de aplicação marca casos de uso como `critico: boolean`; a UI decide se pede confirmação com base nisso + na preferência do usuário |

Meta de conformidade: WCAG 2.1 nível AA como piso, mirando AAA em contraste
de texto (7:1) no modo de alto contraste.

## 6. Testes

- **Domínio e casos de uso:** testes unitários puros (Jest/Vitest), sem
  mock de UI — são funções, testam-se como funções.
- **Componentes:** testes de integração com Testing Library, verificando
  que mudar uma preferência realmente altera o DOM renderizado (ex: "ao
  ativar alto contraste, o texto usa a cor X").
- **Acessibilidade automatizada:** `jest-axe` (web) / `react-native-a11y`
  (mobile) rodando em CI a cada PR, falhando o build em violação de nível A/AA.
- **E2E dos fluxos críticos:** Playwright (web) / Detox (mobile) cobrindo:
  ajustar preferência → preferência persiste após reload; iniciar tarefa →
  concluir com confirmação → aparece no histórico.

## 7. CI/CD (visão geral do pipeline)

```
PR aberto
  → lint + type-check
  → testes unitários (domínio e casos de uso)
  → testes de componente + jest-axe
  → build de preview (Web) / build de dev client (Mobile)
  → deploy de preview (Vercel/Expo EAS) vinculado ao PR
merge na main
  → suíte completa (unitário + integração + e2e)
  → build de produção
  → deploy (Web) / submissão a trilha interna de release (Mobile)
```

Gate obrigatório: nenhum PR entra em `main` com falha de teste de
acessibilidade automatizado — trata-se como bug de build, não como nice-to-have.

## 8. O que o protótipo entregue mostra vs. o que fica para a próxima fase

**No protótipo (`SeniorEaseProtótipo.jsx`):**
- As três telas obrigatórias, navegáveis.
- Toda a lógica de fonte/contraste/espaçamento/modo/feedback/confirmação,
  aplicada em tempo real e de forma coerente entre telas.
- Fluxo guiado de tarefa com confirmação extra condicional.

**Fica para a implementação real (fora do escopo de um protótipo em um
único arquivo React):**
- Persistência de verdade (hoje é estado do React; some ao recarregar).
- Autenticação e dados reais de matrícula/atividades vindos de uma API.
- Versão mobile (a mesma árvore de domínio, consumida por telas React
  Native equivalentes — layout muda, lógica não).
- Suíte de testes e pipeline de CI/CD descritos acima.
