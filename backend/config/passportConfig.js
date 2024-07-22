import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import Author from "../models/Author.js";

//strategia di autenticazione Google
passport.use(
    new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: "/api/auth/google/callback"
        },
        // se l'autenticazione avviene con successo, viene chiamata questa funzione
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Cerca se l'autore esiste nel database
                let author = await Author.findOne({ googleId: profile.id }); //profile contiene l'id di google

                if (!author) {
                    author = new Author({
                        googleId: profile.id,
                        nome: profile.name.givenName,
                        cognome: profile.name.familyName,
                        email: profile.emails[0].value,
                        dataDiNascita: null
                    });
                    // Salva l'autore nel database
                    await author.save();
                }

                // done: passare al prossimo middleware, null: nessun errore, author: l'autore che ho creato
                done(null, author);

            } catch (error) {
                // si passa l'errore a passport
                done(error, null);
            }
        }
    )
);

// serializza l'autore in una stringa JSON
//funzione che determina quali dati dell'utente vengono memorizzati nella sessione
passport.serializeUser((user, done) => {
    done(null, user.id); // solo id utente
});  

//deserializza l'autore da una stringa JSON: recupero l'intero oggetto oggetto basandomi su l'id
passport.deserializeUser(async (id, done) => {
    try {
        // Cerca l'autore nel database utilizzando l'id
        const user = await Author.findById(id);
        // passo l'autore al middleware passport
        done(null, user);
    } catch (error) {
        console.error("Errore durante la deserializzazione dell'autore:", error);
        // passo l'errore a passport
        done(error, null);
    }
});

export default passport;