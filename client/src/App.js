import './App.css';
import Layout from './Layout';
import { Route, Routes } from "react-router-dom"; 
import { lazy, Suspense } from 'react'; 
import { UserContextProvider } from './UserContext';

// Lazy load your pages
const IndexPage = lazy(() => import('./pages/IndexPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const CreatePost = lazy(() => import('./pages/CreatePost'));
const PostPage = lazy(() => import('./pages/PostPage'));
const EditPost = lazy(() => import('./pages/EditPost'));

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route 
            index 
            element={
              <Suspense fallback={<div>Loading Index Page...</div>}>
                <IndexPage />
              </Suspense>
            } 
          />
          <Route 
            path="/login" 
            element={
              <Suspense fallback={<div>Loading Login Page...</div>}>
                <LoginPage />
              </Suspense>
            } 
          />
          <Route 
            path="/register" 
            element={
              <Suspense fallback={<div>Loading Register Page...</div>}>
                <RegisterPage />
              </Suspense>
            } 
          />
          <Route 
            path="/create" 
            element={
              <Suspense fallback={<div>Loading Create Post Page...</div>}>
                <CreatePost />
              </Suspense>
            } 
          />
          <Route 
            path="/post/:id" 
            element={
              <Suspense fallback={<div>Loading Post Page...</div>}>
                <PostPage />
              </Suspense>
            } 
          />
          <Route 
            path="/edit/:id" 
            element={
              <Suspense fallback={<div>Loading Edit Post Page...</div>}>
                <EditPost />
              </Suspense>
            } 
          />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
