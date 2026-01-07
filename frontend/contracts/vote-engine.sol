// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract VotingEngine {
    // Structure pour un candidat
    struct Candidate {
        uint256 id;
        string name;
        string description;
        uint256 voteCount;
    }

    struct Vote {
        // Liste des électeurs autorisés
        address[] voterList;

        // Mapping pour vérifier rapidement si une adresse est électeur
        mapping(address => bool) isVoter;

        // Mapping pour savoir qui a déjà voté
        mapping(address => bool) hasVoted;

        // Mapping pour les jetons de vote (1 jeton = 1 droit de vote)
        mapping(address => uint256) voteTokenBalance;

        Candidate[] candidates;

        // Statut du vote
        bool isVotingOpen;

        bool isVotingFinished;
    }

    // Adresse de l'administrateur
    address public admin;

    // tableau de vote
    Vote[] public votes;

    uint256 private currentVote;

    function _getCurrentVote() private view returns (Vote storage) {
        require(votes.length > 0, "Aucun vote cree");
        require(currentVote < votes.length, "Vote courant invalide");
        return votes[currentVote];
    }

    event VoterAdded(address indexed voter);
    event VoteTokensDistributed(uint256 voterCount);
    event CandidateAdded(uint256 indexed candidateId, string name);
    event VoteCast(address indexed voter, uint256 indexed candidateId);
    event VotingClosed();
    event VoteEnd();

    // Modificateurs
    modifier onlyAdmin() {
        require(msg.sender == admin, "Seul l'admin peut executer cette action");
        _;
    }

    modifier hasVoteToken() {
        require(_getCurrentVote().voteTokenBalance[msg.sender] > 0, "Vous n'avez pas de jeton de vote");
        _;
    }

    function isVotingOpen() external view returns (bool) {
        return _getCurrentVote().isVotingOpen;
    }

    function isVotingFinished() external view returns (bool) {
        return _getCurrentVote().isVotingFinished;
    }

    constructor() {
        admin = msg.sender;
        votes.push();
        currentVote = 0;

        Vote storage v = votes[votes.length - 1];
        v.isVotingOpen = false;
        v.isVotingFinished = false;
    }

    // Ajouter un électeur à la liste électorale
    function addVoter(address _voter) external onlyAdmin {
        require(!_getCurrentVote().isVoter[_voter], "Electeur deja dans la liste");
        require(!_getCurrentVote().isVotingOpen, "Impossible d'ajouter des electeurs pendant le vote");
        require(!_getCurrentVote().isVotingFinished, "Impossible d'ajouter des electeurs apres le vote");

        _getCurrentVote().voterList.push(_voter);
        _getCurrentVote().isVoter[_voter] = true;
        emit VoterAdded(_voter);
    }

    function addCandidate(string calldata _name, string calldata _description) external onlyAdmin {
        require(!_getCurrentVote().isVotingOpen, "Impossible d'ajouter des candidats pendant le vote");
        require(!_getCurrentVote().isVotingFinished, "Impossible d'ajouter des candidats apres le vote");

        _getCurrentVote().candidates.push(Candidate({
            id: _getCurrentVote().candidates.length,
            name: _name,
            description: _description,
            voteCount: 0
        }));
        emit CandidateAdded(_getCurrentVote().candidates.length - 1, _name);
    }

    // Ouvrir le vote : distribue automatiquement 1 jeton à chaque électeur
    function openVoting() external onlyAdmin {
        require(!_getCurrentVote().isVotingOpen, "Le vote est deja ouvert");
        require(!_getCurrentVote().isVotingFinished, "Le vote est deja termine");
        require(_getCurrentVote().voterList.length > 0, "Aucun electeur enregistre");
        require(_getCurrentVote().candidates.length > 0, "Aucun candidat enregistre");

        _getCurrentVote().isVotingOpen = true;

        for (uint256 i = 0; i < _getCurrentVote().voterList.length; i++) {
            _getCurrentVote().voteTokenBalance[_getCurrentVote().voterList[i]] = 1;
        }

        emit VoteTokensDistributed(_getCurrentVote().voterList.length);
    }

    function closeVoting() external onlyAdmin {
        require(_getCurrentVote().isVotingOpen, "Le vote est deja ferme");
        require(!_getCurrentVote().isVotingFinished, "La fin du vote a deja ete declenchee");
        _getCurrentVote().isVotingOpen = false;
        emit VotingClosed();
    }

    function finishVote() external onlyAdmin {
        require(!_getCurrentVote().isVotingOpen, "Le vote est encore en cours");
        require(!_getCurrentVote().isVotingFinished, "La fin du vote a deja ete declenchee");
        _getCurrentVote().isVotingFinished = true;

    }

     function clearVote() external onlyAdmin {
         votes.push();                 // nouveau vote
         currentVote = votes.length - 1;

         Vote storage v = votes[currentVote];
         v.isVotingOpen = false;
         v.isVotingFinished = false;
     }

    //     require(!isVotingOpen, "Le vote est encore ouvert");
    //     require(isVotingFinished, "Le vote n'est pas termine");

    //     // Reset des votants
    //     for (uint256 i = 0; i < voterList.length; i++) {
    //         address voter = voterList[i];
    //         isVoter[voter] = false;
    //         hasVoted[voter] = false;
    //         voteTokenBalance[voter] = 0;
    //     }

    //     while (voterList.length > 0) {
    //         voterList.pop();
    //     }

    //     while (candidates.length > 0) {
    //         candidates.pop();
    //     }
    //     isVotingFinished = false;
    // }

    // Voter pour un candidat (consomme le jeton)
    function vote(uint256 _candidateId) external hasVoteToken {
        require(_getCurrentVote().isVotingOpen, "Le vote n'est pas ouvert");
        require(!_getCurrentVote().hasVoted[msg.sender], "Vous avez deja vote");
        require(_candidateId < _getCurrentVote().candidates.length, "Candidat inexistant");

        // Consommer le jeton de vote
        _getCurrentVote().voteTokenBalance[msg.sender] = 0;
        _getCurrentVote().hasVoted[msg.sender] = true;
        _getCurrentVote().candidates[_candidateId].voteCount++;

        emit VoteCast(msg.sender, _candidateId);
    }

    function getAllCandidates() external view returns (Candidate[] memory) {
        return _getCurrentVote().candidates;
    }

    function getAllVoters() external view returns (address[] memory) {
        return _getCurrentVote().voterList;
    }

    function getVoteTokenBalance(address _voter) external view returns (uint256) {
        return _getCurrentVote().voteTokenBalance[_voter];
    }

    function checkIfVoted(address _voter) external view returns (bool) {
        return _getCurrentVote().hasVoted[_voter];
    }

    function isAdmin(address _address) external view returns (bool) {
        return _address == admin;
    }

    // Structure pour les résultats d'un vote dans l'historique
    struct VoteResult {
        uint256 voteIndex;
        bool isFinished;
        Candidate[] candidates;
    }

    // Récupérer l'historique de tous les votes
    function getHistory() external view returns (VoteResult[] memory) {
        VoteResult[] memory results = new VoteResult[](votes.length);
        for (uint256 i = 0; i < votes.length; i++) {
            results[i] = VoteResult({
                voteIndex: i,
                isFinished: votes[i].isVotingFinished,
                candidates: votes[i].candidates
            });
        }
        return results;
    }
}