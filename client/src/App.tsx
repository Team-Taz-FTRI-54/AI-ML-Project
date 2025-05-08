import { Routes, Route } from 'react-router-dom';
import FileUpload from './components/documentupload/documentupload';
import Flash from './components/flashPage/flash';
import QueryWrapper from './components/QueryPage/querywrapper';
import Login from './components/login/login';
import NavBar from './components/navbar/NavBar';
import QueryHistory from './components/queryHistory/queryHistory';

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        {/*prettier-ignore */}
        <Route path="/" element={<><Flash /><FileUpload /></>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Login />} />
        <Route path="/query" element={<QueryWrapper />} />
        <Route path="/flash" element={<Flash />} />
        <Route path="/history" element={<QueryHistory />} />
      </Routes>
    </>
  );
}

export default App;
