import {useState} from 'react'
import {Header} from '@codegouvfr/react-dsfr/Header'
import {SideMenu} from '@codegouvfr/react-dsfr/SideMenu'
import {fr} from '@codegouvfr/react-dsfr'
import {VotingTab} from './components/VotingTab'
import '@codegouvfr/react-dsfr/main.css'
import {useAccount, useConnect, useDisconnect} from "wagmi";

function App() {
    const {isConnected, address} = useAccount()
    const {connect, connectors, isPending} = useConnect()
    const {disconnect} = useDisconnect()

    const [activeTab, setActiveTab] = useState('profile')

    // Adresse du contrat déployé (TODO: à déployer, j'ai tenté un truc avec Hardhat mais pour l'instant c'est un echec, les clés qu'ils me donnent marchent pas)
    const CONTRACT_ADDRESS = '0xtest';

    if (!isConnected) {
        return (
            <div style={{minHeight: '80vh', display: 'flex', flexDirection: 'column'}}>
                <Header
                    homeLinkProps={{title: "This is a test website. It's for personal use."}}
                    brandTop={
                        <>
                            RÉPUBLIQUEUH
                            <br/>
                            FRANÇAISE
                        </>
                    }
                    serviceTitle="Plateforme de Vote-chain"
                    serviceTagline="Vote sécurisé et transparent"
                />

                <main className={fr.cx('fr-container')} style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    paddingTop: '2rem',
                    paddingBottom: '2rem'
                }}>
                    <div className={fr.cx('fr-grid-row', 'fr-grid-row--center')} style={{width: '100%'}}>
                        <div className={fr.cx('fr-col-12', 'fr-col-md-8', 'fr-col-lg-6')}>

                            {/* Titre principal */}
                            <div className={fr.cx('fr-mb-6w')} style={{textAlign: 'center'}}>
                                <h1 className={fr.cx('fr-h2', 'fr-mb-2w')}>
                                    Bienvenue sur la plateforme de vote
                                </h1>
                                <p className={fr.cx('fr-text--lead', 'fr-text--regular')} style={{color: '#666'}}>
                                    Votez de manière sécurisée et transparente grâce à la blockchain
                                </p>
                            </div>

                            {/* Card de connexion */}
                            <div className={fr.cx('fr-card', 'fr-card--shadow', 'fr-card--grey')}
                                 style={{height: '70%'}}>
                                <div className={fr.cx('fr-card__body')}>
                                    <div className={fr.cx('fr-card__content')}>

                                        <h2 className={fr.cx('fr-h5', 'fr-mb-3w')}>
                                            Connexion à votre portefeuille
                                        </h2>

                                        <p className={fr.cx('fr-text--sm', 'fr-mb-4w')} style={{color: '#666'}}>
                                            Pour accéder à la plateforme, connectez votre portefeuille Web3.
                                        </p>

                                        {/* Callout d'information */}
                                        <div className={fr.cx('fr-callout', 'fr-callout--blue-ecume', 'fr-mb-4w')}>
                                            <p className={fr.cx('fr-callout__text', 'fr-text--sm', 'fr-mb-0')}>
                                                <span className={fr.cx('fr-icon-information-line', 'fr-mr-1w')}
                                                      aria-hidden="true"/>
                                                Configurez votre wallet sur le réseau <strong>Hardhat
                                                Local</strong> (Chain ID: 31337)
                                            </p>
                                        </div>

                                        {/* Boutons de connexion */}
                                        {connectors.length > 0 ? (
                                            <div className={fr.cx('fr-btns-group', 'fr-btns-group--inline-lg')}>
                                                {connectors.map((connector) => (
                                                    <button
                                                        key={connector.id}
                                                        className={fr.cx('fr-btn', 'fr-btn--lg')}
                                                        style={{flex: 1}}
                                                        onClick={() => connect({connector})}
                                                        disabled={isPending}
                                                    >
                                                        {isPending ? 'Connexion en cours...' : `Connecter ${connector.name}`}
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className={fr.cx('fr-alert', 'fr-alert--warning', 'fr-alert--sm')}>
                                                <p className={fr.cx('fr-text--sm', 'fr-mb-0')}>
                                                    Aucun portefeuille détecté. Veuillez installer MetaMask pour
                                                    continuer.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        )
    }

    return (
        <div style={{minHeight: '80vh', display: 'flex', flexDirection: 'column'}}>
            <Header
                homeLinkProps={{title: 'this is a fake website for personal use.'}}
                brandTop={
                    <>
                        RÉPUBLIQUEUH
                        <br/>
                        FRANÇAISE
                    </>
                }
                serviceTitle="Plateforme de Vote Blockchain"
                serviceTagline="Vote sécurisé et transparent"
                quickAccessItems={[
                    {
                        iconId: 'ri-account-circle-line',
                        buttonProps: {
                            onClick: () => {
                                if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
                                    disconnect()
                                }
                            }
                        },
                        text: `Connecté (Déconnexion)`
                    }
                ]}
            />

            <div className={fr.cx('fr-grid-row')}>
                <div className={fr.cx('fr-col-12', 'fr-col-md-3')}>
                    <SideMenu
                        align="left"
                        style={{paddingLeft: "1vw"}}
                        burgerMenuButtonText="Menu"
                        sticky
                        fullHeight
                        title="Onglets"
                        items={[
                            {
                                text: 'Mon profil',

                                isActive: activeTab === 'profile',
                                linkProps: {
                                    href: '#',
                                    onClick: (e) => {
                                        e.preventDefault()
                                        setActiveTab('profile')
                                    }
                                }
                            },
                            {
                                text: 'Vote',

                                isActive: activeTab === 'vote',
                                linkProps: {
                                    href: '#',
                                    onClick: (e) => {
                                        e.preventDefault()
                                        setActiveTab('vote')
                                    }
                                }
                            },
                        ]}
                    />
                </div>

                <div className={fr.cx('fr-col-12', 'fr-col-md-9')}>
                    <main className={fr.cx('fr-mt-6w', 'fr-mb-6w')}>
                        {activeTab === 'vote' && (
                            <VotingTab
                                contractAddress={CONTRACT_ADDRESS}
                            />
                        )}

                        {activeTab === 'profile' && (
                            <div>
                                <h2>Mon profil</h2>
                                <div className={fr.cx('fr-callout')}>
                                    <p className={fr.cx('fr-callout__text')}>
                                        <strong>Adresse du compte connecté :</strong> {address!}
                                    </p>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    )
}

export default App