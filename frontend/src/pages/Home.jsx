import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getPosts, deletePost, getUserData } from "../services/api";
import Notification from '../components/Notification.jsx';
import EditPost from "./EditPost.jsx";
import { Button, Card, Spinner } from "flowbite-react";
import { motion } from "framer-motion";
import Header from "../components/Header.jsx";

// Funzione per generare particelle casuali
const Particle = () => {
  const x = Math.random() * window.innerWidth;
  const y = Math.random() * window.innerHeight;
  const size = Math.random() * 10 + 5;
  const duration = Math.random() * 5 + 5;

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        borderRadius: '0%',
        pointerEvents: 'none',
      }}
      animate={{
        x: [x, x + (Math.random() - 0.5) * 200],
        y: [y, y + (Math.random() - 0.5) * 200],
        opacity: [1, 0],
      }}
      transition={{ duration, repeat: Infinity, repeatType: 'loop' }}
    />
  );
};

export default function Home({ setLoggedIn, loggedIn, search, viewMyPosts }) {
  const [posts, setPosts] = useState([]);
  const [notification, setNotification] = useState(null);
  const [editPostId, setEditPostId] = useState(null);
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Funzione per il recupero dei dati
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await getPosts();
        setPosts(response.data);
        
        if (loggedIn) {
          const userData = await getUserData();
          setCurrentUser(userData);
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error("Errore nel recupero dei dati:", error);
        if (error.response && error.response.status === 401) {
          setLoggedIn(false);
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, [loggedIn, navigate, setLoggedIn]);

  // Funzione per eliminare un post
  const handleDeletePost = async (id, e) => {
    e.preventDefault();
    const confirmDelete = window.confirm('Are you sure?');
    if (confirmDelete) {
      try {
        await deletePost(id);
        setPosts(posts.filter((post) => post._id !== id));
        setNotification("Post eliminato!");
      } catch (error) {
        console.error('Errore eliminazione post', error);
        setNotification("Errore nella cancellazione del post");
      }
    }
  };

  // Funzione per modificare un post
  const handleEditPost = (id, e) => {
    e.preventDefault();
    setEditPostId(id);
  };

  // Funzione per chiudere la modale di modifica
  const handleCloseEditModal = () => {
    setEditPostId(null);
  };

  // Funzione per aggiornare i post
  const handlePostUpdate = (updatedPost) => {
    setPosts(prevPosts => prevPosts.map(post => post._id === updatedPost._id ? updatedPost : post));
    setNotification("Post modificato!");
    setEditPostId(null);
  };

  if (isLoading) {
    return <div className="ms-4"> <Spinner aria-label="Medium sized spinner example" size="md" /> </div>
  }

  // Funzione per filtrare i post
  const filterPosts = (posts) => {
    let filtered = posts.filter((post) =>
      post.title.toLowerCase().includes(search.toLowerCase())
    );
    
    if (viewMyPosts && currentUser) {
      filtered = filtered.filter(post => post.author === currentUser.email);
    }
    
    return filtered;
  };

  return (
    <>
    <Header/>
    <div className="relative overflow-hidden bg-gray-200 min-h-screen">
      {/* Sfondo con particelle animate */}
      <div className="absolute inset-0 overflow-hidden z-0">
        {Array.from({ length: 200 }).map((_, index) => (
          <Particle key={index} />
        ))}
      </div>
      <div className="container mx-auto flex flex-col items-center justify-center p-4 relative z-10">
        <h1 className="mb-6 text-4xl font-extrabold text-white drop-shadow-lg">{viewMyPosts ? "My Posts" : "All Posts"}</h1>
        {notification && (
          <Notification message={notification} onClose={() => setNotification(null)} />
        )}
        <div className="post-grid grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mx-auto px-4">
          {filterPosts(posts).map((post) => (
            <motion.div
            key={post._id}
            whileHover={{ scale: 1.03, boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)" }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden rounded-lg bg-white text-black"
          >
              <Link to={`/post/${post._id}`} className="post-card">
                <Card className="max-w-sm h-full">
                  <img
                    src={post.cover}
                    alt={post.title}
                    className="h-48 w-full object-cover"
                  />
                  <div className="p-4 flex-grow">
                    <h2 className="mb-2 text-xl font-semibold text-gray-800 dark:text-gray-200">{post.title}</h2>
                    <p className="font-normal text-gray-600 dark:text-gray-400">
                      Autore: {post.author}
                    </p>
                    {loggedIn && currentUser && currentUser.email === post.author && (
                      <div className="mt-2 flex gap-2">
                        <Button 
                          size="sm" 
                          className="mt-1 flex-1 h-8" 
                          outline 
                          gradientDuoTone="greenToBlue" 
                          onClick={(e) => handleEditPost(post._id, e)}
                        >
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          className="mt-1 flex-1 h-8" 
                          outline 
                          gradientDuoTone="greenToBlue" 
                          onClick={(e) => handleDeletePost(post._id, e)}
                        >
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              </Link>
              {editPostId && <EditPost postId={editPostId} onUpdate={handlePostUpdate} onClose={handleCloseEditModal} />}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
}
