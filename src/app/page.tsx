import { articleService } from "./lib/db";

export default async function Home() {
 
  let articles;
  try {
    articles = await articleService.getPublicArticles();
  } catch (error) {
   
    articles = [
      {
        id: "1",
        title: "Memahami Next.js App Router",
        summary: "Panduan lengkap menggunakan App Router di Next.js 15",
        createdAt: new Date("2024-01-15"),
        status: "published",
        views: 150,
        author: { name: "Admin" }
      },
      {
        id: "2", 
        title: "Authentication dengan NextAuth.js",
        summary: "Implementasi sistem autentikasi modern dengan NextAuth.js",
        createdAt: new Date("2024-01-14"),
        status: "published",
        views: 89,
        author: { name: "Admin" }
      },
      {
        id: "3",
        title: "Middleware di Next.js",
        summary: "Cara menggunakan middleware untuk proteksi route",
        createdAt: new Date("2024-01-13"),
        status: "published",
        views: 67,
        author: { name: "Admin" }
      }
    ];
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Portal Artikel
        </h1>
        <p className="text-xl text-gray-600">
          Kumpulan artikel teknologi terbaru
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <div key={article.id} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">
              {article.title}
            </h2>
            <p className="text-gray-600 mb-4">
              {article.summary}
            </p>
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>Oleh: {article.author?.name || 'Unknown'}</span>
              <span>{new Date(article.createdAt).toLocaleDateString('id-ID')}</span>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              Views: {article.views}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <p className="text-gray-600 mb-4">
          Ingin membuat artikel sendiri?
        </p>
        <a
          href="/login"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Login ke Dashboard
        </a>
      </div>
    </div>
  );
}