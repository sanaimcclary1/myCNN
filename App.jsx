import React, { useState } from 'react';
import './index.css';

export default function App() {
  const [page, setPage] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  function handleLogin(e) {
    e.preventDefault();
    if (username && password) {
      setPage('upload');
    } else {
      alert('Please enter a username and password.');
    }
  }

  function handleFileUpload(e) {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  }

  function Header() {
    return (
      <header className="bg-indigo-600 text-white p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">myCNN</h1>
          <nav>
            {page !== 'login' && (
              <button onClick={() => setPage('login')} className="underline">Sign Out</button>
            )}
          </nav>
        </div>
      </header>
    );
  }

  function LoginPage() {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded shadow-md w-80">
          <h2 className="text-2xl font-bold mb-4 text-center">Sign In</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="mt-1 w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full border rounded px-3 py-2" />
            </div>
            <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded">Sign In</button>
          </form>
          <p className="text-xs text-gray-500 mt-4 text-center">Demo only — this does not connect to a backend.</p>
        </div>
      </div>
    );
  }

  function UploadPage() {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {Header()}
        <main className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="bg-white p-6 rounded shadow w-full max-w-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Upload Image</h2>
            <input type="file" accept="image/*" onChange={handleFileUpload} />
            <div className="mt-4">
              {preview ? (
                <img src={preview} alt="Preview" className="w-full max-h-96 object-contain rounded border" />
              ) : (
                <div className="w-full h-64 bg-gray-100 flex items-center justify-center text-gray-400 rounded">No image selected</div>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-4">Prediction functionality will be added later.</p>
          </div>
        </main>
      </div>
    );
  }

  return page === 'login' ? LoginPage() : UploadPage();
}
