import { useState, useEffect } from 'react'
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import VotingEngineArtifact from '../../artifacts/contracts/vote-engine.sol/VotingEngine.json'
import { fr } from '@codegouvfr/react-dsfr'
import jsPDF from 'jspdf'

function exportResultsToPDF(candidates: Candidate[]) {
    const pdf = new jsPDF()
    pdf.setFontSize(16)
    pdf.text('Résultats du vote', 10, 10)

    let y = 25
    candidates.forEach((c, index) => {
        pdf.setFontSize(12)
        pdf.text(
            `${index + 1}. ${c.name} — ${c.voteCount.toString()} vote(s)`,
            10,
            y
        )
        y += 8
        pdf.setFontSize(10)
        pdf.text(c.description, 12, y)
        y += 12
    })

    pdf.save('resultats-vote.pdf')
}

interface Props {
    contractAddress: `0x${string}`
}

interface Candidate {
    id: bigint
    name: string
    description: string
    voteCount: bigint
}

export function AdminTab({ contractAddress }: Props) {
    const [voter, setVoter] = useState('')
    const [candidateName, setCandidateName] = useState('')
    const [candidateDesc, setCandidateDesc] = useState('')

    const { data: candidatesData, refetch: refetchCandidates } = useReadContract({
        address: contractAddress,
        abi: VotingEngineArtifact.abi,
        functionName: 'getAllCandidates',
    }) as { data: Candidate[] , refetch: ()=>void}

    const { data: votersData, refetch: refetchVoters } = useReadContract({
        address: contractAddress,
        abi: VotingEngineArtifact.abi,
        functionName: 'getAllVoters',
    }) as { data: string[], refetch: ()=>void}

    const { data: votingOpen } = useReadContract({
        address: contractAddress,
        abi: VotingEngineArtifact.abi,
        functionName: 'isVotingOpen',
    }) as { data: boolean }

    const { data: votingFinished } = useReadContract({
        address: contractAddress,
        abi: VotingEngineArtifact.abi,
        functionName: 'isVotingFinished',
    }) as { data: boolean }

    const { writeContract, data: hash, isPending } = useWriteContract()
    const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash })

    useEffect(() => {
        if (hash && !isPending && !isConfirming) {
            refetchCandidates()
            refetchVoters()
        }
    }, [hash, isPending, isConfirming, refetchCandidates, refetchVoters])

    const canOpenVote = candidatesData?.length > 0 && votersData?.length > 0 && !votingOpen && !votingFinished
    const canCloseVote = votingOpen && !votingFinished
    const canFinishVote = !votingOpen && candidatesData?.length > 0 && votersData?.length > 0 && !votingFinished
    const canAddVoter = !votingOpen && !votingFinished
    const canAddCandidate = !votingOpen && !votingFinished
    const showFinalActions = votingFinished


    return (
        <div className={fr.cx('fr-mt-4w')}>
            <h2>Administration du vote</h2>

            <div className={fr.cx('fr-mb-4w')}>
                {canOpenVote && (
                    <button
                        className={fr.cx('fr-btn', 'fr-mr-2w')}
                        onClick={() =>
                            writeContract({
                                address: contractAddress,
                                abi: VotingEngineArtifact.abi,
                                functionName: 'openVoting',
                            })
                        }
                    >
                        Ouvrir le vote
                    </button>
                )}

                {canCloseVote && (
                    <button
                        className={fr.cx('fr-btn', 'fr-mr-2w')}
                        onClick={() =>
                            writeContract({
                                address: contractAddress,
                                abi: VotingEngineArtifact.abi,
                                functionName: 'closeVoting',
                            })
                        }
                    >
                        Fermer le vote
                    </button>
                )}

                {canFinishVote && (
                    <button
                        className={fr.cx('fr-btn', 'fr-btn--secondary')}
                        onClick={() =>
                            writeContract({
                                address: contractAddress,
                                abi: VotingEngineArtifact.abi,
                                functionName: 'finishVote',
                            })
                        }
                    >
                        Terminer définitivement
                    </button>
                )}
            </div>

            <div className={fr.cx('fr-mb-4w')}>
                {canAddVoter && <><h3>Ajouter un électeur</h3>
                <input
                    className={fr.cx('fr-input')}
                    placeholder="Adresse Ethereum"
                    value={voter}
                    onChange={e => setVoter(e.target.value)}
                />
                <button
                    className={fr.cx('fr-btn', 'fr-mt-2w')}
                    onClick={() =>
                        writeContract({
                            address: contractAddress,
                            abi: VotingEngineArtifact.abi,
                            functionName: 'addVoter',
                            args: [voter as `0x${string}`],
                        })
                    }
                >
                    Ajouter
                </button></>}

                <div className={fr.cx('fr-mt-2w')}>
                    <h4>Votants inscrits ({votersData?.length || 0})</h4>
                    <ul>
                        {votersData?.map(v => (
                            <li key={v}>{v}</li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className={fr.cx('fr-mb-4w')}>
                {canAddCandidate && <><h3>Ajouter un candidat</h3>
                <input
                    className={fr.cx('fr-input')}
                    placeholder="Nom"
                    value={candidateName}
                    onChange={e => setCandidateName(e.target.value)}
                />
                <textarea
                    className={fr.cx('fr-input')}
                    placeholder="Description"
                    value={candidateDesc}
                    onChange={e => setCandidateDesc(e.target.value)}
                />
                <button
                    className={fr.cx('fr-btn', 'fr-mt-2w')}
                    onClick={() =>
                        writeContract({
                            address: contractAddress,
                            abi: VotingEngineArtifact.abi,
                            functionName: 'addCandidate',
                            args: [candidateName, candidateDesc],
                        })
                    }
                >
                    Ajouter candidat
                </button></>}

                <div className={fr.cx('fr-mt-2w')}>
                    <h4>Candidats inscrits ({candidatesData?.length || 0})</h4>
                    <ul>
                        {candidatesData?.map(c => (
                            <li key={c.id.toString()}>
                                <strong>{c.name}</strong>: {c.description} ({c.voteCount} votes)
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {showFinalActions && (
                <div className={fr.cx('fr-mt-4w')}>
                    <h3>Actions finales</h3>

                    <button
                        className={fr.cx('fr-btn', 'fr-mr-2w')}
                        onClick={() => exportResultsToPDF(candidatesData ?? [])}
                    >
                        Exporter les résultats (PDF)
                    </button>

                    <button
                        className={fr.cx('fr-btn', 'fr-btn--secondary')}
                        onClick={() =>
                            writeContract({
                                address: contractAddress,
                                abi: VotingEngineArtifact.abi,
                                functionName: 'clearVote',
                            })
                        }
                    >
                        Réinitialiser le vote
                    </button>
                </div>
            )}

            {(isPending || isConfirming) && <p>Transaction en cours…</p>}
        </div>
    )
}
