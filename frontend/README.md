Seguendo le lezioni sulla base di Strive-Blog ho voluto creare un blog per fotografi con le stesse funzionalità del compito.
Il blog è perfettamente funzionante ed in linea con tutte le task che erano da fare. 
Personalmente avrei voluto sistemarlo molto di più esteticamente ma con la mole di cose da consegnare non ho potuto, però se la cava.

Ho usato Flowbite-react con CSS tailwind in combinazione con qualche effetto di Framer motion e react Icons per le icone.

Ho creato un logo personalizzato ed animato --> Pic Me con allusione alle foto.

Visualizzazione dei Contenuti
Prima di effettuare il login, gli utenti possono:

Visualizzare tutti i post.
Cercare post specifici tramite la barra di ricerca nella Navbar.
Visualizzare i dettagli di ogni post.
Leggere i commenti dei post.
Tutti gli altri pulsanti spariscono se l'utente non è loggato e questo accade perchè
passo la prop loggedIn da App ai figli.


Registrazione e Login tramite pulsante "Login" nella barra di ricerca
Gli utenti possono registrarsi o accedere tramite il sito, con la possibilità di utilizzare l'autenticazione tramite Google. Dopo la registrazione, il blog offre funzionalità aggiuntive, inclusa la possibilità di creare nuovi post.


Creazione e Gestione dei Post
Una volta registrati, gli utenti possono:

Creare nuovi post sulla fotografia tramite bottone "Create Post".
Modificare i propri post.
Eliminare i propri post.
Filtrare i propri post attraverso il bottone "MyPost".


Commenti
Gli utenti registrati possono:
Aggiungere nuovi commenti ai post tramite "Add Comment".
-tramite il menu a tendina con l'icona di setting -->
Modificare i propri commenti.
Eliminare i propri commenti.


Autenticazione e Sicurezza
Email dell'Utente: L'email dell'utente loggato è utilizzata per garantire che solo l'autore possa modificare o eliminare i propri contenuti. Questa email non può essere modificata o cancellata dall'utente.


Icona del Profilo: Dopo il login, viene visualizzata un'icona con la prima lettera del nome dell'utente. L'icona è un dropdown che mostra una stringa di benvenuto, l'email dell'utente e un bottone per il logout.


Il footer ha un bottone che ti fa tornare all'inizio della pagina e un 'seguici' che apre la finestra del social in questione ma senza ovviamente renderizzare la pagina correlata visto che ancora non esiste.

Not FOUND Page
nel caso in cui l'utente si perdesse da qualche parte :\