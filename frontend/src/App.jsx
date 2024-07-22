// Importa i componenti necessari da react-router-dom per gestire il routing
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Importa i componenti personalizzati dell'applicazione
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import PostDetail from "./pages/PostDetail";
import 'flowbite/dist/flowbite.css'; 
import 'flowbite';
import "./App.css";
import EditPost from "./pages/EditPost";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Navbarr from "./components/Navbarr";
import { useState } from "react";
import NotFound from "./pages/NotFound";
import Footer from "./components/Footer";

// Definisce il componente principale App
function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [author, setAuthor] = useState({});
  console.log(loggedIn);
  console.log("Author:" , author);
  const [search, setSearch] = useState("");
  const [viewMyPosts, setViewMyPosts] = useState(false);
  return (
    // Router avvolge l'intera applicazione, abilitando il routing
    <Router>
      <div className="App">
        {/* Navbar è renderizzato in tutte le pagine */}
        <Navbarr 
        setViewMyPosts={setViewMyPosts}
        loggedIn={loggedIn} 
        setLoggedIn={setLoggedIn} 
        author={author} 
        setAuthor={setAuthor} 
        search={search} 
        setSearch={setSearch}
        />

        {/* Il tag main contiene il contenuto principale che cambia in base al routing */}
        <main>
          {/* definisce le diverse rotte dell'applicazione */}
          <Routes>
            {/* Route per la home page */}
            <Route path="/" element={<Home 
                                     viewMyPosts={viewMyPosts}
                                     author={author} 
                                     setAuthor={setAuthor} 
                                     loggedIn={loggedIn} 
                                     setLoggedIn={setLoggedIn} 
                                     search={search} 
                                     setSearch={setSearch}/>} 
                                     />

            {/* Route per la pagina di creazione di un nuovo post */}
            <Route path="/create" element={<CreatePost 
                                           author={author} 
                                           setAuthor={setAuthor} 
                                           loggedIn={loggedIn} 
                                           setLoggedIn={setLoggedIn}/>} 
                                           />

            {/* Route per la pagina di dettaglio di un post
                :id è un parametro dinamico che rappresenta l'ID del post */}
            <Route path="/post/:id" element={<PostDetail 
                                             setAuthor={setAuthor}
                                             author={author}
                                             loggedIn={loggedIn}  
                                             setLoggedIn={setLoggedIn} 
                                             />} 
                                             /> 
            {/* <Route path="/post/id" element={<Mock/>}/> */}
            <Route path="/edit/:id" element={<EditPost 
                                             author={author} 
                                             setAuthor={setAuthor} 
                                             loggedIn={loggedIn} 
                                             setLoggedIn={setLoggedIn}/>}
                                             />
            <Route path="/register" element={<Register/>}/>
            <Route path="/login" element={<Login 
                                          loggedIn={loggedIn} 
                                          setLoggedIn={setLoggedIn} 
                                          author={author} 
                                          setAuthor={setAuthor} />}
                                          />

            <Route path="*" element={<NotFound/>}/>
          </Routes>
        </main>

        <Footer/>
      </div>
    </Router>
  );
}

// Esporta il componente App come default per essere utilizzato in altri file
export default App;
