# Vote-Chain 

VoteChain est la plateforme de gouvernance décentralisée conçue pour couvrir l'éventail complet des besoins en vote pour les scrutins officiels.
Il s'agit d'un projet. Ce n'est pas une plateforme officielle.


## Qu'est-il possible de faire sur la plateforme ?

Pour un utilisateur: 
- Se connecter à son wallet et voir le contenu (jeton pour voter disponible ou non)
- Voir les candidats à l'élection
- Voter pour un candidat
- Voir les résultats
- (En option, déléguer son vote ?)

Pour l'admin (celui qui a déployé le smart contract): 
- Ajouter des gens à la liste éléctorale (= définir qui peut voter)
- Ajouter des candidats (= définir pour qui on peut voter)
- Ouvrir / Fermer une session de vote


## Installer le projet en local : 

### Requirements : 
- Node 22.10 minimum

### Tutorial :

- Run `cd frontend`
- Run `npm install`
- Run `npx hardhat compile`
- Run `npm run dev`
- Go to localhost:5173

Si l'utilisateur utilise l'extension Metamask et qu'il est connecté, il sera automatiquement connecté à la plateforme.
Sinon, il doit se connecter manuellement.

### Tester : 
(A destination du prochain dev)
Les smart contracts sont rangés dans frontend/contracts (oui endroit pas logique c'est pas du frontend mais bref)
J'ai essayé de déployer en local grâce à HardHat (https://v2.hardhat.org/hardhat-runner/docs/guides/test-contracts) 
mais j'ai des problèmes avec les comptes de test qu'ils me génèrent et je suis même pas sûre d'avoir compris quoi en faire après de toute façon

Du coup, j'ai testé le smartcontract existant sur Remix (https://remix.ethereum.org/) mais pas entre le frontend et le smart contract


## Ce qu'il reste à faire / remarques: 
- Faire commmuniquer le smartContract et le frontend
- Revoir si on a besoin d'une brique FranceConnect ou si juste on affiche le logo sur le bouton et en vrai ça connecte uniquement au wallet
- Afficher les résultats
- Déléguer le vote à qqn d'autre (ouais on a écrit ça dans notre pitch deck)
- Pour l'identité, on parlait de NFT dans le pitch desk, j'ai pas capté comment l'intégrer dans le projet.
- Refaire le schema ?


## Technologies: 

Node / React / Vite / HardHat / Solidity / Système de design de l'état FR


