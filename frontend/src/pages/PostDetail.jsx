// Importa gli hook necessari da React
import { useState, useEffect } from "react";
// Importa useParams per accedere ai parametri dell'URL
import { useParams } from "react-router-dom";
// Importo la funzione getPost dal mio file services/api
import { getPost, getUserData } from "../services/api";
// Importa il file CSS per gli stili specifici di questo componente
import Comments from "../components/Comments";
import { Card, Spinner } from "flowbite-react";
import { motion } from "framer-motion";
import { FaUser, FaClock, FaTags } from "react-icons/fa";

export default function PostDetail({ loggedIn, setLoggedIn, author, setAuthor }) {
  const [post, setPost] = useState(null);
  const [userData, setUserData] = useState(null);

  const { id } = useParams();

  // Funzione per il recupero del post e l'utente
  useEffect(() => {
    const fetchPostAndUser = async () => {
      try {
        const response = await getPost(id);
        setPost(response.data);

        const token = localStorage.getItem("token");
        if (token) {
          setLoggedIn(true);
          const userDataResponse = await getUserData();
          setUserData(userDataResponse);
        } else {
          setLoggedIn(false);
        }
      } catch (error) {
        console.error("Errore nella fetch del post:", error);
      }
    };

    fetchPostAndUser();
  }, [id]);

  if (!post) return <div className="flex justify-center items-center h-screen"><Spinner size="xl" /></div>;

  return (
    <div className="container mx-auto p-4">
      <motion.div 
        className="post-detail max-w-3xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <Card>
          <img 
            src={post.cover} 
            alt={post.title} 
            className="rounded-t-lg object-cover w-full h-64" 
          />
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
            <div className="flex-col post-meta text-gray-600 dark:text-gray-400 mb-4">
              <div className="flex items-center mb-2">
                <FaTags className="mr-2" /> 
                <span>Categoria: {post.category}</span>
              </div>
              <div className="flex items-center mb-2">
                <FaUser className="mr-2" /> 
                <span>Autore: {post.author}</span>
              </div>
              <div className="flex items-center">
                <FaClock className="mr-2" /> 
                <span>Tempo di lettura: {post.readTime.value} {post.readTime.unit}</span>
              </div>
            </div>
            <div 
              className="post-content text-lg leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </Card>
        <Comments 
          loggedIn={loggedIn} 
          setLoggedIn={setLoggedIn}
          userData={userData} 
          author={author}
          setAuthor={setAuthor}
          postId={id}
        />
      </motion.div>
    </div>
  );
}

