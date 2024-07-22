import express from "express";
import BlogPost from "../models/BlogPost.js";
//import upload from "../middlewares/upload.js"; // Import nuovo Middleware per upload (NO CLOUDINARY)
import cloudinaryUploader from "../config/claudinaryConfig.js"; // Import dell'uploader di Cloudinary (CON CLOUDINARY)
import { sendEmail } from "../services/emailService.js"; // Import del codice per l'invio delle mail (INVIO MAIL)
//import middleware per proteggere le rotte
import {authMiddleware} from "../middlewares/authMiddleware.js";
import upload from '../middlewares/upload.js';

// import controlloMail from "../middlewares/controlloMail.js"; // NON USARE - SOLO PER DIDATTICA - MIDDLEWARE (commentato)

const router = express.Router();

// router.use(controlloMail); // NON USARE - SOLO PER DIDATTICA - Applicazione del middleware a tutte le rotte (commentato)

// GET /blogPosts: ritorna una lista di blog post
router.get("/", async (req, res) => {
  try {
    let query = {};
    // Se c'è un parametro 'title' nella query, crea un filtro per la ricerca case-insensitive
    if (req.query.title) {
      query.title = { $regex: req.query.title, $options: "i" }; // Per fare ricerca case-insensitive:
      // Altrimenti per fare ricerca case-sensitive -> query.title = req.query.title;
    }
    // Cerca i blog post nel database usando il filtro (se presente)
    const blogPosts = await BlogPost.find(query);
    // Invia la lista dei blog post come risposta JSON
    res.json(blogPosts);
  } catch (err) {
    // In caso di errore, invia una risposta di errore
    res.status(500).json({ message: err.message });
  }
});

// GET /blogPosts/123: ritorna un singolo blog post
router.get("/:id", async (req, res) => {
  try {
    // Cerca un blog post specifico per ID
    const blogPost = await BlogPost.findById(req.params.id);
    if (!blogPost) {
      // Se il blog post non viene trovato, invia una risposta 404
      return res.status(404).json({ message: "Blog post non trovato" });
    }
    // Invia il blog post trovato come risposta JSON
    res.json(blogPost);
  } catch (err) {
    // In caso di errore, invia una risposta di errore
    res.status(500).json({ message: err.message });
  }
});

// POST /blogPosts: crea un nuovo blog post (AGGIORNATA AD UPLOAD!)

// router.post("/", upload.single("cover"), async (req, res) => {
router.post("/", cloudinaryUploader.single("cover"), async (req, res) => {
  try {
    const postData = req.body;
    if (req.file) {
      // postData.cover = `http://localhost:5001/uploads/${req.file.filename}`;
      postData.cover = req.file.path; // Cloudinary restituirà direttamente il suo url
    }
    const newPost = new BlogPost(postData);
    await newPost.save();

    // CODICE PER INVIO MAIL con MAILGUN
    const htmlContent = `
      <h1>Il tuo post è stato pubblicato!</h1>
      <p>Ciao ${newPost.author},</p>
      <p>Il tuo post "${newPost.title}" è stato pubblicato con successo.</p>
      <p>Categoria: ${newPost.category}</p>
      <p>Grazie per il tuo contributo al blog!</p>
    `;

    await sendEmail(
      newPost.author, // Ovviamente assumendo che newPost.author sia l'email dell'autore
      "Il tuo post è stato correttamente pubblicato",
      htmlContent
    );

    res.status(201).json(newPost);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});


// PUT /blogPosts/123: modifica il blog post con l'id associato
router.put("/:id", async (req, res) => {
  try {
    // Trova e aggiorna il blog post nel database
    const updatedBlogPost = await BlogPost.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Opzione per restituire il documento aggiornato
    );
    if (!updatedBlogPost) {
      // Se il blog post non viene trovato, invia una risposta 404
      return res.status(404).json({ message: "Blog post non trovato" });
    }
    // Invia il blog post aggiornato come risposta JSON
    res.json(updatedBlogPost);
  } catch (err) {
    // In caso di errore, invia una risposta di errore
    res.status(400).json({ message: err.message });
  }
});

//creo una patch per modificare i post con l'id associato
router.patch("/:id", upload.single('cover'), async (req, res) => {
  console.log("Received PATCH request for post ID:", req.params.id);
  console.log("Request body:", req.body);

  try {
    const updateData = {};

    // Aggiungi solo i campi presenti nel corpo della richiesta
    if (req.body.category) updateData.category = req.body.category;
    if (req.body.title) updateData.title = req.body.title;
    if (req.body.author) updateData.author = req.body.author;
    if (req.body.content) updateData.content = req.body.content;
    
    // Gestione del readTime
    if (req.body.readTime) {
      updateData.readTime = {};
      if (req.body['readTime.value']) updateData.readTime.value = parseInt(req.body['readTime.value']);
      if (req.body['readTime.unit']) updateData.readTime.unit = req.body['readTime.unit'];
    }

    // Se c'è un nuovo file di copertina, gestiscilo qui
    if (req.file) {
      updateData.cover = req.file.path;
    }

    console.log("Update data:", updateData);

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "Nessun dato valido fornito per l'aggiornamento" });
    }

    const blogPost = await BlogPost.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!blogPost) {
      return res.status(404).json({ message: "Post non trovato" });
    }

    // Invia il blog post aggiornato come risposta JSON
    res.json(blogPost);
  } catch (error) {
    console.error("Error updating post:", error);
    // In caso di errore, invia una risposta di errore
    res.status(400).json({ message: error.message });
  }
});

// PATCH /blogPosts/:blogPostId/cover: carica un'immagine di copertina per il post specificato
router.patch("/:blogPostId/cover", cloudinaryUploader.single("cover"), async (req, res) => {
  try {
    // Verifica se è stato caricato un file o meno
    if (!req.file) {
      return res.status(400).json({ message: "Ops, nessun file caricato" });
    }

    // Cerca il blog post nel db
    const blogPost = await BlogPost.findById(req.params.blogPostId);
    if (!blogPost) {
      return res.status(404).json({ message: "Blog post non trovato" });
    }

    // Aggiorna l'URL della copertina del post con l'URL fornito da Cloudinary
    blogPost.cover = req.file.path;

    // Salva le modifiche nel db
    await blogPost.save();

    // Invia la risposta con il blog post aggiornato
    res.json(blogPost);
  } catch (error) {
    console.error("Errore durante l'aggiornamento della copertina:", error);
    res.status(500).json({ message: "Errore interno del server" });
  }
});

// DELETE /blogPosts/123: cancella il blog post con l'id associato
router.delete("/:id", async (req, res) => {
  try {
    // Trova e elimina il blog post dal database
    const deletedBlogPost = await BlogPost.findByIdAndDelete(req.params.id);
    if (!deletedBlogPost) {
      // Se il blog post non viene trovato, invia una risposta 404
      return res.status(404).json({ message: "Blog post non trovato" });
    }
    // Invia un messaggio di conferma come risposta JSON
    res.json({ message: "Blog post eliminato" });
  } catch (err) {
    // In caso di errore, invia una risposta di errore
    res.status(500).json({ message: err.message });
  }
});


//creazione rotta
router.get("/:id/comments", async (req, res) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id);
    if (!blogPost) {
      return res.status(404).json({message: "Commento non trovato"})
    }
    res.json(blogPost.comments)
  } catch (error) {
    res.status(500).json({message: error.message});
  }
})


//rotta post
router.post("/:id/comments", async (req, res) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id);
    if (!blogPost) {
      return res.status(404).json({message: "Post non trovato"})
    }
    console.log("body", req.body);
    const newComment = {
      name: req.body.name,
      email: req.body.email,
      comment: req.body.comment
    };
    blogPost.comments.push(newComment);
    await blogPost.save();
    const htmlContent = `
      <h1>Il tuo commento è stato pubblicato!</h1>
      <p>Ciao ${newComment.name},</p>
      <p>Il tuo commento è stato pubblicato con successo.</p>
      <br>
      <br>
      <p>Grazie per il tuo contributo al blog!</p>
    `;

    await sendEmail(
      newComment.email, // Ovviamente assumendo che newPost.author sia l'email dell'autore
      "Il tuo commento è stato correttamente pubblicato",
      htmlContent
    );

    res.status(201).json(newComment);
  } catch (error) {
    res.status(400).json({message: error.message});
  }
});

//creo rotta del commento specifico del singolo post
router.get("/:id/comments/:commentId", async (req, res) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id);
    if (!blogPost) {
      return res.status(404).json({message: "post non trovato"});
    };
    const comment = blogPost.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({message: "commento non trovato"});
    };
    res.json(comment);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});


router.patch("/:id/comments/:commentId", async(req, res) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id);
    if (!blogPost) {
      return res.status(404).json({message: "post non trovato"});
    };
    const comment = blogPost.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({message: "commento non trovato"});
    };
    if (req.body.name) comment.name = req.body.name;
    if (req.body.email) comment.email = req.body.email;
    if (req.body.comment) comment.comment = req.body.comment;
    await blogPost.save();
    res.json(blogPost)
  } catch (error) {
    res.status(400).json({message: error.message});
  }
});

// proteggo le rotte con il middleware
router.use(authMiddleware);

router.delete("/:id/comments/:commentId", async(req, res) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id);
    if (!blogPost) {
      return res.status(404).json({message: "post non trovato"});
    };
    const comment = blogPost.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({message: "commento non trovato"});
    };
    blogPost.comments.pull({_id: req.params.commentId});
    await blogPost.save();
    res.json({blogPost, message: "commento eliminato"});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});



export default router;
