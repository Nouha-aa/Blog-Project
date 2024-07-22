// Importa useState hook da React
import { useState, useEffect } from "react";
// Importa useNavigate da react-router-dom per la navigazione programmatica
import { useNavigate } from "react-router-dom";
// Importo la funzione createPost dal mio file services/api
import { createPost, getUserData } from "../services/api";
import { Button, TextInput, Textarea, Label, Card } from "flowbite-react";

export default function CreatePost() {
  // Stato per memorizzare i dati dell'utente
  const [currentUser, setCurrentUser] = useState(null);

  // Funzione per il recupero dei dati dell'utente
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserData();
        setCurrentUser(userData);
        // Imposta l'email dell'utente nel campo autore del post
        setPost(prevPost => ({ ...prevPost, author: userData.email }));
      } catch (error) {
        console.error("Errore nel recupero dei dati:", error);
      }
    };
    fetchUser();
  }, []);


  // Stato per memorizzare i dati del nuovo post
  const [post, setPost] = useState({
    title: "",
    category: "",
    content: "",
    readTime: { value: 1, unit: "minutes" },
    author: "",
  });

  const [createdMessage, setCreatedMessage] = useState(false);

  // Nuovo stato per gestire il file di copertina
  const [coverFile, setCoverFile] = useState(null);

  // Hook per la navigazione
  const navigate = useNavigate();

  // Gestore per i cambiamenti nei campi del form
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "readTimeValue") {
      // Gestiamo il "readTime" del post
      setPost({
        ...post,
        readTime: { ...post.readTime, value: parseInt(value) },
      });
    } else {
      // Aggiornamento generale per gli altri campi
      setPost({ ...post, [name]: value });
    }
  };

  // Nuovo gestore per il cambiamento del file di copertina
  const handleFileChange = (e) => {
    setCoverFile(e.target.files[0]);
  };

  // Gestore per l'invio del form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Creiamo un oggetto FormData per inviare sia i dati del post che il file
      const formData = new FormData();

      // Aggiungiamo tutti i campi del post al FormData
      Object.keys(post).forEach((key) => {
        if (key === "readTime") {
          formData.append("readTime[value]", post.readTime.value);
          formData.append("readTime[unit]", post.readTime.unit);
        } else {
          formData.append(key, post[key]);
        }
      });

      // Aggiungiamo il file di copertina se presente
      if (coverFile) {
        formData.append("cover", coverFile);
      }

      // Invia i dati del post al backend
      await createPost(formData);
      // Naviga alla rotta della home dopo la creazione del post
      // navigate("/");
    } catch (error) {
      console.error("Errore nella creazione del post:", error)
    }
    finally {
      setCreatedMessage(true);
      setTimeout(() => {
        navigate("/");
      }, 2000);
      
    };
  };

  return (
    <div className="container mx-auto max-w-2xl p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Create Post</h1>
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title" value="Title" />
            <TextInput
              id="title"
              name="title"
              value={post.title}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="category" value="Category" />
            <TextInput
              id="category"
              name="category"
              value={post.category}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="content" value="Content" />
            <Textarea
              id="content"
              name="content"
              value={post.content}
              onChange={handleChange}
              required
              rows={6}
            />
          </div>
          <div>
            <Label htmlFor="cover" value="Post Image" />
            <TextInput
              type="file"
              id="cover"
              name="cover"
              onChange={handleFileChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="readTimeValue" value="Reading Time (minutes)" />
            <TextInput
              type="number"
              min="1"
              id="readTimeValue"
              name="readTimeValue"
              value={post.readTime.value}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="author" value="Author Email" />
            <TextInput
              type="email"
              id="author"
              name="author"
              value={post.author}
              readOnly={currentUser !== null}
              required
            />
          </div>
          {createdMessage && (
            <p className="text-green-600 font-bold text-center">
              Post created successfully!
            </p>
          )}
          <Button
            gradientDuoTone="greenToBlue"
            type="submit"
            className="w-full"
          >
            Save Post
          </Button>
        </form>
      </Card>
    </div>
  );
}
