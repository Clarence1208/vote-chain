``` mermaid
%% Palette pâle
%% - Couleurs très claires pour fonds/acteurs/lignes/notes
%% - Compatible avec la plupart des parseurs Mermaid récents
%% - Ajuste au besoin les hex ci-dessous
%%{init: {
  "theme": "base",
  "themeVariables": {
    "primaryColor": "#EAF2FF",
    "primaryTextColor": "#1B2A4A",
    "primaryBorderColor": "#C8DAFF",
    "lineColor": "#CFD8E3",
    "secondaryColor": "#F3FAF3",
    "tertiaryColor": "#FFF5E6",
    "noteBkgColor": "#FFFBEA",
    "noteTextColor": "#4B4B4B",
    "actorBkg": "#F7F9FF",
    "actorBorder": "#E1E6F9"
  }
}}%%

sequenceDiagram
  autonumber

  actor Citoyen as Citoyen
  participant UI as dApp
  participant Wallet as Wallet
  participant FC as FranceConnect
  participant SC1 as SC MemberPass
  participant SC2 as SC Voting
  participant SC3 as SC Delegation
  participant L2 as L2 Chain
  actor Delegue as Délégué
  actor Audit as Auditeur

  %% --- Connexion & identité ---
  rect rgba(234,242,255,0.55)
    Citoyen->>UI: Ouvre l'application
    UI->>FC: Demande d'authentification
    FC-->>UI: Jeton d'identité (assertion)
    UI->>Wallet: Demande de signature (preuve KYC)
    Wallet-->>UI: Signature retournée
    UI->>SC1: Mint MemberPass (preuve + signature)
    SC1-->>Citoyen: MemberPass émis
  end

  note over Citoyen,SC1: Le MemberPass contrôle l'accès aux scrutins

  %% --- Création d'une proposition ---
  rect rgba(243,250,243,0.55)
    Citoyen->>UI: Créer une proposition
    UI->>SC2: createProposal(titre, description, paramètres)
    SC2-->>UI: ID de proposition
  end

  %% --- Délégation (optionnelle) ---
  rect rgba(255,245,230,0.55)
    Citoyen->>SC3: delegateVote(vers Délégué)
    SC3-->>Citoyen: Délégation enregistrée
  end

  %% --- Vote & enregistrement on-chain ---
  rect rgba(247,249,255,0.55)
    Citoyen->>SC2: vote(proposition, choix) 
    Delegue->>SC2: vote délégué (si délégation)
    SC2->>L2: Écrit événements de vote
    L2-->>SC2: Confirmation bloc/tx
    SC2-->>UI: État du scrutin (votes, quorum, etc.)
  end

  %% --- Décompte & récompenses ---
  rect rgba(255,251,234,0.55)
    UI->>SC2: closeAndTally(proposition)
    SC2-->>UI: Résultats finaux
    SC2->>SC3: notifier résultats pour récompenses
    SC3-->>Delegue: Distribution de récompenses
  end

  %% --- Auditabilité ---
  rect rgba(234,242,255,0.35)
    Audit->>L2: Lecture des événements (audit)
    L2-->>Audit: Historique immuable
  end

```