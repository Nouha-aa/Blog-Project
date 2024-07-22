import axios from "axios";

// Definiamo l'url di base'
const API_URL = "http://localhost:5001/api";

// Configura un'istanza di axios con l'URL di base
const api = axios.create({
  baseURL: API_URL,
});

// Aggiungi un interceptor per includere il token in tutte le richieste
const getToken = () => localStorage.getItem('token');

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//interceptor per gestire gli errori di autenticazione
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token non valido o scaduto
      logout();
      // Puoi anche reindirizzare l'utente alla pagina di login qui
    }
    return Promise.reject(error);
  }
);

// Funzioni per le operazioni CRUD
export const getPosts = () => api.get("/blogPosts");
export const getPost = (id) => api.get(`/blogPosts/${id}`);
// UPLOAD: modificata la funzione createPost per gestire FormData
export const createPost = (postData) =>
  api.post("/blogPosts", postData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const updatePost = (id, postData) =>
  api.put(`/blogPosts/${id}`, postData);
export const patchPost = (id, formData) => 
  api.patch(`/blogPosts/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
export const deletePost = (id) => api.delete(`/blogPosts/${id}`);

// funzione per l'upload dell'immagine di copertina
export const updateBlogPostCover = (blogPostId, coverFile) => {
  const formData = new FormData();
  formData.append('cover', coverFile);

  return api.patch(`/blogPosts/${blogPostId}/cover`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
// funzione per l'upload dell'immagine sell'avatar
export const updateAuthorAvatar = (authorId, avatarFile) => {
  const formData = new FormData();
  formData.append('avatar', avatarFile);

  return api.patch(`/authors/${authorId}/avatar`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// funzioni per le operazioni CRUD dei commenti
export const getComments = (postId) => api.get(`/blogPosts/${postId}/comments`);
export const getComment = (postId, commentId) => api.get(`/blogPosts/${postId}/comments/${commentId}`);
export const createComment = (postId, comment) => 
  api.post(`/blogPosts/${postId}/comments`, comment);
export const updateComment = (postId, commentId, commentData) => api.patch(`/blogPosts/${postId}/comments/${commentId}`, commentData);
export const deleteComment = (postId, commentId) => api.delete(`/blogPosts/${postId}/comments/${commentId}`);

// Funzioni per effettuare il login di un utente
// Funzione per registrare un nuovo utente
export const registerUser = (userData) => api.post("/authors", userData);

// Funzione per effettuare il login di un utente
export const loginUser = async (credentials) => {
  try {
    const response = await api.post("/auth/login", credentials); // Effettua la richiesta di login
    console.log("Risposta API login:", response.data); // Log della risposta per debugging
    return response.data; // Restituisce i dati della risposta
  } catch (error) {
    console.error("Errore nella chiamata API di login:", error); // Log dell'errore per debugging
    throw error; // Lancia l'errore per essere gestito dal chiamante
  }
};

// Funzione per ottenere i dati dell'utente attualmente autenticato
export const getMe = () =>
  api.get("/auth/me").then((response) => response.data);

// Funzione per ottenere i dati dell'utente attualmente autenticato con gestione degli errori
export const getUserData = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      logout();
      throw new Error('Sessione scaduta. Effettua nuovamente il login.');
    }
    console.error('Errore nel recupero dei dati utente:', error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  // Rimuovi il token dall'header di default di Axios
  delete api.defaults.headers.common['Authorization'];
};

export default api;
