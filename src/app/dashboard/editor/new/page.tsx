'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Komponen untuk menampilkan pesan loading atau status
const StatusMessage = ({ message, type }: { message: string; type: 'loading' | 'error' }) => {
  const baseClasses = "text-center p-4 rounded-md my-4";
  const typeClasses = type === 'error' ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700";
  return <div className={`${baseClasses} ${typeClasses}`}>{message}</div>;
};

export default function ArticleEditor() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (articleStatus: 'draft' | 'published') => {
    setStatus('loading');
    setError(null);

    if (!title.trim()) {
      setError('Judul tidak boleh kosong.');
      setStatus('error');
      return;
    }

    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          status: articleStatus,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal membuat artikel.');
      }

      // Arahkan kembali ke dasbor setelah berhasil
      router.push('/dashboard');
      router.refresh(); // Memuat ulang data di halaman dasbor
    } catch (err: any) {
      setError(err.message);
      setStatus('error');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Buat Artikel Baru</h1>
            <p className="text-gray-600 mt-1">Tulis dan publikasikan ide-ide Anda.</p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="mb-6">
                <label htmlFor="title" className="block text-lg font-semibold text-gray-800 mb-2">
                  Judul
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Judul artikel Anda..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  disabled={status === 'loading'}
                />
              </div>

              <div className="mb-8">
                <label htmlFor="content" className="block text-lg font-semibold text-gray-800 mb-2">
                  Konten
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Tulis konten Anda di sini..."
                  rows={12}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  disabled={status === 'loading'}
                />
              </div>

              {status === 'error' && error && <StatusMessage message={error} type="error" />}
              
              <div className="flex justify-end items-center gap-4">
                <button
                  type="button"
                  onClick={() => handleSubmit('draft')}
                  disabled={status === 'loading'}
                  className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? 'Menyimpan...' : 'Simpan sebagai Draf'}
                </button>
                <button
                  type="button"
                  onClick={() => handleSubmit('published')}
                  disabled={status === 'loading'}
                  className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? 'Menerbitkan...' : 'Terbitkan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
