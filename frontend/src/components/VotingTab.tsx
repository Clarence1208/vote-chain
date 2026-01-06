import {useState} from 'react'
import {useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount} from 'wagmi'
import {fr} from '@codegouvfr/react-dsfr'
import VotingEngineArtifact from '../../artifacts/contracts/vote-engine.sol/VotingEngine.json'

interface Candidate {
    id: bigint
    name: string
    description: string
    voteCount: bigint
}

interface VotingTabProps {
    contractAddress: `0x${string}`
}
export const VOTING_ENGINE_ABI= VotingEngineArtifact.abi;


export function VotingTab({contractAddress}: VotingTabProps) {
    const {address} = useAccount()
    const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null)

    const {
        data: candidates, isLoading: loadingCandidates, refetch: refetchCandidates} = useReadContract({
        address: contractAddress,
        abi: VOTING_ENGINE_ABI,
        functionName: 'getAllCandidates',
    })

    const {data: hasVoted, refetch: refetchHasVoted} = useReadContract({
        address: contractAddress,
        functionName: 'checkIfVoted',
        abi: VOTING_ENGINE_ABI,
        args: [address!],
    })

    const {data: votingFinished = false} = useReadContract({
        address: contractAddress,
        abi: VOTING_ENGINE_ABI,
        functionName: 'isVotingFinished',
    })

    // Changez la valeur par défaut pour tester les 2 cas sans conenxion au smartcontract
    const {data: votingOpen = false} = useReadContract({
        address: contractAddress,
        abi: VOTING_ENGINE_ABI,
        functionName: 'isVotingOpen',
    })

    // Récupération des candidats depuis le contrat
    const {data: candidatesData} = useReadContract({
        address: contractAddress,
        abi: VOTING_ENGINE_ABI,
        functionName: 'getAllCandidates',
    }) as {data: Candidate[]}//mockCandidates as Candidate[]

    // Fonction pour voter
    const {data: hash, writeContract, isPending} = useWriteContract()

    // Attendre la confirmation de la transaction
    const {isLoading: isConfirming, isSuccess} = useWaitForTransactionReceipt({
        hash,
    })

    if (isSuccess) {
        refetchCandidates()
        refetchHasVoted()
    }

    const handleVote = (candidateId: number) => {
        if (hasVoted) {
            alert('Vous avez déjà voté !')
            return
        }

        //TODO: test this
        writeContract({
            abi: VOTING_ENGINE_ABI,
            address: contractAddress,
            functionName: 'vote',
            args: [BigInt(candidateId)],
        })
    }

    if (loadingCandidates) {
        return <div className={fr.cx('fr-mt-4w')}>Chargement des candidats...</div>
    }

    console.log("votingOpen: " , votingOpen);
    if (!votingOpen && !votingFinished) {
        return (
            <div className={fr.cx('fr-alert', 'fr-alert--warning', 'fr-mt-4w')}>
                <p>Le vote n'est pas encore ouvert.</p>
            </div>
        )
    }

    //Mock data to test, delete later
    const mockCandidates: Candidate[] = [
        {
            id: BigInt(0),
            name: "Sisi Zhazha",
            description: "Candidate pour la transition écologique et le développement durable",
            voteCount: BigInt(0)
        },
        {
            id: BigInt(1),
            name: "Clacla Hihi",
            description: "Candidat pour l'innovation numérique et la transformation digitale",
            voteCount: BigInt(0)
        },
        {
            id: BigInt(2),
            name: "Lolo Toto",
            description: "Candidate pour l'éducation et la formation professionnelle",
            voteCount: BigInt(0)
        },{
            id: BigInt(3),
            name: "Jaja Mama",
            description: "Candidate pour la transition écologique et le développement durable",
            voteCount: BigInt(0)
        },
    ]

    //This is some workaround to give types else typescript is unhappy
    const hasAlreadyVoted = hasVoted as boolean


    return (
        <div className={fr.cx('fr-mt-4w')}>
            <h2>{ votingFinished ? 'Résultats du vote' : 'Liste des candidats'}</h2>

            {hasAlreadyVoted && !votingFinished && (
                <div className={fr.cx('fr-alert', 'fr-alert--success', 'fr-mb-4w')}>
                    <p>Vous avez déjà voté.</p>
                </div>
            )}

            <div className={fr.cx('fr-grid-row', 'fr-grid-row--gutters')}>
                {candidatesData?.map((candidate: Candidate) => (
                    <div key={candidate.id.toString()} className={fr.cx('fr-col-12', 'fr-col-md-6')}>
                        <div className={fr.cx('fr-card', 'fr-card--shadow')}>
                            <div className={fr.cx('fr-card__body')}>
                                <div className={fr.cx('fr-card__content')}>
                                    <h3 className={fr.cx('fr-card__title')}>
                                        {candidate.name}
                                    </h3>
                                    <p className={fr.cx('fr-card__desc')}>
                                        {candidate.description}
                                    </p>
                                    <div className={fr.cx('fr-badge', 'fr-badge--info', 'fr-mt-2w')}>
                                        {candidate.voteCount.toString()} vote(s)
                                    </div>
                                </div>
                                {!votingFinished && <div className={fr.cx('fr-card__footer')}>
                                    <button
                                        className={fr.cx('fr-btn', selectedCandidate === Number(candidate.id) ? 'fr-btn--tertiary' : 'fr-btn--secondary')}
                                        onClick={() => setSelectedCandidate(Number(candidate.id))}
                                    >
                                        {selectedCandidate === Number(candidate.id) ? 'Sélectionné' : 'Sélectionner'}
                                    </button>
                                </div>
                                }

                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {selectedCandidate !== null && !hasVoted && (
                <div className={fr.cx('fr-mt-4w', 'fr-p-4w')}>
                    <h3>Confirmer votre vote</h3>
                    <p>
                        Vous êtes sur le point de voter pour : <strong>{candidatesData?.[selectedCandidate]?.name}</strong>
                    </p>
                    <button
                        className={fr.cx('fr-btn', 'fr-btn--lg')}
                        onClick={() => handleVote(selectedCandidate)}
                        disabled={isPending || isConfirming}
                    >
                        {isPending || isConfirming ? 'Vote en cours...' : 'Confirmer mon vote'}
                    </button>
                </div>
            )}
        </div>
    )
}