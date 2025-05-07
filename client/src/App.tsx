import { Routes, Route } from 'react-router-dom';
import FileUpload from './components/documentupload/documentupload';
import QueryInput from './components/queryinput/queryInput';

function App() {
  return (
    <Routes>
      <Route path="/" element={<FileUpload />} />
      <Route path="/queryinput" element={<QueryInput />} />
    </Routes>
  );
}

export default App;
