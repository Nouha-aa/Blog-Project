import express from "express";
import Author from "../models/Author.js";
import { generateJWT } from "../utils/jwt.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import passport from "../config/passportConfig.js";

const router = express.Router(); // crea un router per le rotte

router.post("/login", async (req, res) => {
    console.log("Dati ricevuti dal server:", req.body);
    try {
        // estrae email e password dal dal corpo della richiesta 
        const { email, password } = req.body;
        // cerca l'autore nel database usando l'email
        const author = await Author.findOne({ email });
        if (!author) {
            // se l'autore non viene trovato restituisce errore 401 (unauthorized)
            return res.status(401).json({ message: "Credenziali non valide" });
        }

        // verifica la password usando il metodo comparePassword definito nel modello Author
        const isMatch = await author.comparePassword(password);
        if (!isMatch) {
            // se la password non corrisponde restituisce errore 401 (unauthorized)
            return res.status(401).json({ message: "Credenziali non valide" });
        }

        // se l'autore e la password corrispondono crea un token usando la funzione generateJWT
        const token = await generateJWT({ id: author._id });
        // restituisce il token come risposta JSON e messaggio di successo
        res.json({ token, message: "Login effettuato con successo" });
    } catch (error) {
        //gestione di eventuali errori del server e restituisce un messaggio di errore
        console.error("Errore durante il login:", error);
        res.status(500).json({ message: "errore del server" });
    }
    });

    // GET /me : restituisce l'autore correntemente loggato
    router.get("/me", authMiddleware, (req, res) => {
        // converte il documento mongoose in un oggetto JavaScript semplice
        const authorData = req.author.toObject();
        // rimuove il campo password per sicurezza
        delete authorData.password;
        // restituisce l'autore correntemente loggato come risposta JSON
        res.json(authorData);
    });

    // GET /google : autenticazione con google, google è la strategia e lo scope specifica i permessi
   router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

   // GET /google/callback : callback dopo autenticazione
   router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), 
   async (req, res) => {
    try {

       // se l'autenticazione va a buon fine, viene creato un token usando la funzione generateJWT
       const token = await generateJWT({ id: req.user._id }); //se non c'è un errore deve generare un token
       // si sfrutta l'id dell'autore come payload per generare un token
       // si reinderizza alla homepage con il token generato così il frontend salva il token e lo usa per le richieste autorizzate
       res.redirect(`http://localhost:5173/login?token=${token}`);

    } catch (error) {

       console.error("Errore durante la generazione del token:", error);
       res.redirect("/login/error=auth_failed");
    }

   });

    export default router;