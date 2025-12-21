import { Header } from '@codegouvfr/react-dsfr/Header'
import { fr } from '@codegouvfr/react-dsfr'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import '@codegouvfr/react-dsfr/main.css'

function App() {
    // const { address, isConnected } = useAccount()
    // const { connect, connectors } = useConnect()
    // const { disconnect } = useDisconnect()
    const isConnected = false;
    const connectors = [{id: "123", name: "Eth"}, {id: "132", name: "Fox"}]

    return (
        <div className={fr.cx('fr-container')}>
            <Header
                homeLinkProps={{title: "This is not a true website. This is a personal project"}}
                brandTop={
                    <>
                        RÉPUBLIQUE
                        <br />
                        FRANÇAISE
                    </>
                }
                serviceTitle="Plateforme de Vote Blockchain"
                serviceTagline="Vote sécurisé et transparent"
            />

            <main className={fr.cx('fr-mt-6w')}>
                <div className={fr.cx('fr-grid-row', 'fr-grid-row--center')}>
                    <div className={fr.cx('fr-col-12', 'fr-col-md-8')}>
                        <h1>Bienvenue sur la plateforme de vote</h1>

                        <div className={fr.cx('fr-callout', 'fr-mt-4w')}>
                            <h3 className={fr.cx('fr-callout__title')}>
                                Connexion Wallet
                            </h3>
                            <p className={fr.cx('fr-callout__text')}>
                                {isConnected ? (
                                    <>
                                        <strong>Connecté:</strong>
                                        <br />
                                        <button
                                            className={fr.cx('fr-btn', 'fr-btn--secondary', 'fr-mt-2w')}
                                            onClick={() => console.log('clicked')}
                                        >
                                            Se déconnecter
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        Connectez votre wallet pour participer aux votes
                                        <br />
                                        {connectors.map((connector) => (
                                            <button
                                                key={connector.id}
                                                className={fr.cx('fr-btn', 'fr-mt-2w', 'fr-mr-2w')}
                                                onClick={() => console.log('clicked' + connector.id)}
                                            >
                                                {connector.name}
                                            </button>
                                        ))}
                                    </>
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default App