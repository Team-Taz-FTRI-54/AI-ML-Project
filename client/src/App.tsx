import { Routes, Route } from 'react-router-dom';
import FileUpload from './components/documentupload/documentupload';
import Flash from './components/flashPage/flash';
import QueryWrapper from './components/QueryPage/querywrapper';
import Login from './components/login/login';

function App() {
  return (
    //prettier-ignore
    <Routes>
      <Route path="/" element={<><Flash /><FileUpload /></>} />
      <Route path="/login" element={<Login />} />
      <Route path="/query" element={<QueryWrapper />} />
      <Route path="/flash" element={<Flash />} />
    </Routes>
  );
}

export default App;
