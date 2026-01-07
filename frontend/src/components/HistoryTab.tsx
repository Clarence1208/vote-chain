import { useReadContract } from 'wagmi'
import { fr } from '@codegouvfr/react-dsfr'
import VotingEngineArtifact from '../../artifacts/contracts/vote-engine.sol/VotingEngine.json'

interface Candidate {
    id: bigint
    name: string
    description: string
    voteCount: bigint
}

interface VoteResult {
    voteIndex: bigint
    isFinished: boolean
    candidates: Candidate[]
}

interface HistoryTabProps {
    contractAddress: `0x${string}`
}

export function HistoryTab({ contractAddress }: HistoryTabProps) {
    const { data: historyData, isLoading } = useReadContract({
        address: contractAddress,
        abi: VotingEngineArtifact.abi,
        functionName: 'getHistory',
    }) as { data: VoteResult[] | undefined; isLoading: boolean }

    if (isLoading) {
        return <div className={fr.cx('fr-mt-4w')}>Chargement de l'historique...</div>
    }

    if (!historyData || historyData.length === 0) {
        return (
            <div className={fr.cx('fr-alert', 'fr-alert--info', 'fr-mt-4w')}>
                <p>Aucun vote dans l'historique.</p>
            </div>
        )
    }

    // Filtrer pour ne montrer que les votes terminés, ou tous si aucun n'est terminé
    const finishedVotes = historyData.filter(vote => vote.isFinished)
    const votesToDisplay = finishedVotes.length > 0 ? finishedVotes : historyData

    return (
        <div className={fr.cx('fr-mt-4w')}>
            <h2>Historique des votes</h2>
            <p className={fr.cx('fr-text--sm', 'fr-mb-4w')} style={{ color: '#666' }}>
                {finishedVotes.length > 0 
                    ? `${finishedVotes.length} vote(s) terminé(s) sur ${historyData.length} vote(s) au total`
                    : `${historyData.length} vote(s) enregistré(s) (aucun terminé pour le moment)`
                }
            </p>

            <div className={fr.cx('fr-grid-row', 'fr-grid-row--gutters')}>
                {votesToDisplay.map((vote, voteIndex) => (
                    <div key={vote.voteIndex.toString()} className={fr.cx('fr-col-12', 'fr-mb-4w')}>
                        <div className={fr.cx('fr-card', 'fr-card--shadow')}>
                            <div className={fr.cx('fr-card__body')}>
                                <div className={fr.cx('fr-card__content')}>
                                    <div className={fr.cx('fr-grid-row', 'fr-grid-row--gutters')}>
                                        <div className={fr.cx('fr-col-12')}>
                                            <h3 className={fr.cx('fr-card__title', 'fr-mb-2w')}>
                                                Vote #{vote.voteIndex.toString()}
                                            </h3>
                                            <div className={fr.cx('fr-badge', vote.isFinished ? 'fr-badge--success' : 'fr-badge--warning', 'fr-mb-3w')}>
                                                {vote.isFinished ? 'Terminé' : 'En cours'}
                                            </div>
                                        </div>
                                    </div>

                                    {vote.candidates.length > 0 ? (
                                        <div>
                                            <h4 className={fr.cx('fr-h6', 'fr-mb-2w')}>Résultats :</h4>
                                            <div className={fr.cx('fr-grid-row', 'fr-grid-row--gutters')}>
                                                {vote.candidates
                                                    .slice()
                                                    .sort((a, b) => {
                                                        if (b.voteCount > a.voteCount) return 1
                                                        if (b.voteCount < a.voteCount) return -1
                                                        return 0
                                                    })
                                                    .map((candidate) => (
                                                        <div key={candidate.id.toString()} className={fr.cx('fr-col-12', 'fr-col-md-6', 'fr-mb-2w')}>
                                                            <div className={fr.cx('fr-tile', 'fr-tile--horizontal')}>
                                                                <div className={fr.cx('fr-tile__body')}>
                                                                    <h5 className={fr.cx('fr-tile__title')}>
                                                                        {candidate.name}
                                                                    </h5>
                                                                    <p className={fr.cx('fr-tile__desc', 'fr-text--sm')}>
                                                                        {candidate.description}
                                                                    </p>
                                                                    <div className={fr.cx('fr-badge', 'fr-badge--info', 'fr-mt-1w')}>
                                                                        {candidate.voteCount.toString()} vote(s)
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <p className={fr.cx('fr-text--sm')} style={{ color: '#666' }}>
                                            Aucun candidat enregistré pour ce vote.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

