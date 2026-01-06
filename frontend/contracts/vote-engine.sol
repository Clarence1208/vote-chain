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

    // Adresse de l'administrateur
    address public admin;

    // Liste des électeurs autorisés
    address[] public voterList;

    // Mapping pour vérifier rapidement si une adresse est électeur
    mapping(address => bool) public isVoter;

    // Mapping pour savoir qui a déjà voté
    mapping(address => bool) public hasVoted;

    // Mapping pour les jetons de vote (1 jeton = 1 droit de vote)
    mapping(address => uint256) public voteTokenBalance;

    Candidate[] public candidates;

    // Statut du vote
    bool public isVotingOpen;

    bool public isVotingFinished;

    event VoterAdded(address indexed voter);
    event VoteTokensDistributed(uint256 voterCount);
    event CandidateAdded(uint256 indexed candidateId, string name);
    event VoteCast(address indexed voter, uint256 indexed candidateId);
    event isVotingOpened();
    event VotingClosed();
    event VoteEnd();

    // Modificateurs
    modifier onlyAdmin() {
        require(msg.sender == admin, "Seul l'admin peut executer cette action");
        _;
    }

    modifier hasVoteToken() {
        require(voteTokenBalance[msg.sender] > 0, "Vous n'avez pas de jeton de vote");
        _;
    }

    modifier votingIsOpen() {
        require(isVotingOpen, "Le vote n'est pas ouvert");
        _;
    }

    constructor() {
        admin = msg.sender;
        isVotingOpen = false;
        isVotingFinished = false;
    }

    // Ajouter un électeur à la liste électorale
    function addVoter(address _voter) external onlyAdmin {
        require(!isVoter[_voter], "Electeur deja dans la liste");
        require(!isVotingOpen, "Impossible d'ajouter des electeurs pendant le vote");
        require(!isVotingFinished, "Impossible d'ajouter des electeurs apres le vote");

        voterList.push(_voter);
        isVoter[_voter] = true;
        emit VoterAdded(_voter);
    }

    function addCandidate(string calldata _name, string calldata _description) external onlyAdmin {
        require(!isVotingOpen, "Impossible d'ajouter des candidats pendant le vote");
        require(!isVotingFinished, "Impossible d'ajouter des candidats apres le vote");

        candidates.push(Candidate({
            id: candidates.length,
            name: _name,
            description: _description,
            voteCount: 0
        }));
        emit CandidateAdded(candidates.length - 1, _name);
    }

    // Ouvrir le vote : distribue automatiquement 1 jeton à chaque électeur
    function openVoting() external onlyAdmin {
        require(!isVotingOpen, "Le vote est deja ouvert");
        require(!isVotingFinished, "Le vote est deja termine");
        require(voterList.length > 0, "Aucun electeur enregistre");
        require(candidates.length > 0, "Aucun candidat enregistre");

        isVotingOpen = true;

        for (uint256 i = 0; i < voterList.length; i++) {
            voteTokenBalance[voterList[i]] = 1;
        }

        emit isVotingOpened();
        emit VoteTokensDistributed(voterList.length);
    }

    function closeVoting() external onlyAdmin {
        require(isVotingOpen, "Le vote est deja ferme");
        require(!isVotingFinished, "La fin du vote a deja ete declenchee");
        isVotingOpen = false;
        emit VotingClosed();
    }

    function finishVote() external onlyAdmin {
        require(!isVotingOpen, "Le vote est encore en cours");
        require(!isVotingFinished, "La fin du vote a deja ete declenchee");
        isVotingFinished = true;

    }

    // function clearVote() external onlyAdmin {
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
    function vote(uint256 _candidateId) external hasVoteToken votingIsOpen {
        require(!hasVoted[msg.sender], "Vous avez deja vote");
        require(_candidateId < candidates.length, "Candidat inexistant");

        // Consommer le jeton de vote
        voteTokenBalance[msg.sender] = 0;
        hasVoted[msg.sender] = true;
        candidates[_candidateId].voteCount++;

        emit VoteCast(msg.sender, _candidateId);
    }

    function getAllCandidates() external view returns (Candidate[] memory) {
        return candidates;
    }

    function getAllVoters() external view returns (address[] memory) {
        return voterList;
    }

    function getVoteTokenBalance(address _voter) external view returns (uint256) {
        return voteTokenBalance[_voter];
    }

    function checkIfVoted(address _voter) external view returns (bool) {
        return hasVoted[_voter];
    }

    function isAdmin(address _address) external view returns (bool) {
        return _address == admin;
    }
}