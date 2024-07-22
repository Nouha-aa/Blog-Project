import { Link } from "react-router-dom";
import { Button, Navbar } from "flowbite-react";
import GetMe from "./GetMe";
import Search from "./Search";
import Logo from "./Logo";

export default function Navbarr({ loggedIn, setLoggedIn, author, setAuthor, search, setSearch, setViewMyPosts }) {
  return (
    <Navbar fluid rounded>
      <Navbar.Brand as={Link} to="/" onClick={() => setViewMyPosts(false)}>
        <Logo />
      </Navbar.Brand>
      
      <Search search={search} setSearch={setSearch} />
      
      <Navbar.Toggle />
      
      <Navbar.Collapse>
        <Navbar.Link as={Link} to="/" onClick={() => setViewMyPosts(false)} className={({ isActive }) => (isActive ? "text-blue-600 dark:text-blue-500" : "")}>
          Home
        </Navbar.Link>
        {loggedIn && (
          <>
          <Navbar.Link as={Link} to="/create">
            Create Post
          </Navbar.Link>
          <Navbar.Link as={Link} to="/" onClick={() => setViewMyPosts(true)}>
              My Posts
          </Navbar.Link>
        </>
        )}
      </Navbar.Collapse>
      
      <div className="ml-4">
        <GetMe 
          loggedIn={loggedIn}
          setLoggedIn={setLoggedIn}
          author={author}
          setAuthor={setAuthor}
        />
      </div>
    </Navbar>
  );
}

