import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import { articleService } from "@/app/lib/db";
import Link from 'next/link';
import { FileText, Eye, Edit3, Trash2, PlusCircle } from 'lucide-react';

type Article = {
  id: string;
  title: string;
  status: string;
  views: number;
  createdAt: Date;
  authorId: string;
};

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  let userArticles: Article[] = [];
  let stats = {
    totalArticles: 0,
    totalViews: 0,
    draftCount: 0,
  };

  try {
    userArticles = await articleService.getUserArticles(session.user.id);
    stats = await articleService.getStats(session.user.id);
  } catch (error) {
    console.error("Gagal mengambil artikel:", error);
    userArticles = [
      {
        id: "1",
        title: "Contoh Artikel: Diterbitkan",
        status: "published",
        views: 150,
        createdAt: new Date("2024-01-15T10:00:00Z"),
        authorId: session.user.id,
      },
      {
        id: "2",
        title: "Contoh Artikel: Draf",
        status: "draft",
        views: 0,
        createdAt: new Date("2024-01-14T15:30:00Z"),
        authorId: session.user.id,
      },
    ];
    
    stats = {
      totalArticles: userArticles.length,
      totalViews: userArticles.reduce((sum, article) => sum + article.views, 0),
      draftCount: userArticles.filter(article => article.status === 'draft').length,
    };
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dasbor Penulis
          </h1>
          <p className="text-gray-600">
            Selamat datang kembali, {session.user?.name || 'Penulis'}!
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 flex items-center">
            <FileText className="w-8 h-8 text-blue-500 mr-4"/>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-1">Total Artikel</h3>
              <p className="text-4xl font-extrabold text-blue-600">{stats.totalArticles}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 flex items-center">
            <Eye className="w-8 h-8 text-green-500 mr-4"/>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-1">Total Dilihat</h3>
              <p className="text-4xl font-extrabold text-green-600">{stats.totalViews.toLocaleString('id-ID')}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 flex items-center">
            <Edit3 className="w-8 h-8 text-yellow-500 mr-4"/>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-1">Jumlah Draf</h3>
              <p className="text-4xl font-extrabold text-yellow-600">{stats.draftCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Artikel Saya</h2>
            <Link href="/dashboard/editor/new" legacyBehavior>
              <a className="inline-flex items-center bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm">
                <PlusCircle className="w-5 h-5 mr-2" />
                Buat Artikel Baru
              </a>
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Judul
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dilihat
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {userArticles.length > 0 ? (
                  userArticles.map((article) => (
                    <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {article.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full ${
                          article.status === 'published' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {article.status === 'published' ? 'Diterbitkan' : 'Draf'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {article.views.toLocaleString('id-ID')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(article.createdAt).toLocaleDateString('id-ID', {
                          year: 'numeric', month: 'long', day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                        <Link href={`/dashboard/editor/${article.id}`} legacyBehavior>
                          <a className="inline-flex items-center text-indigo-600 hover:text-indigo-900 mr-4 font-semibold">
                            <Edit3 className="w-4 h-4 mr-1" />
                            Edit
                          </a>
                        </Link>
                        <button className="inline-flex items-center text-red-600 hover:text-red-900 font-semibold">
                          <Trash2 className="w-4 h-4 mr-1" />
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      Anda belum memiliki artikel.
                      <Link href="/dashboard/editor/new" legacyBehavior>
                         <a className="text-blue-600 hover:underline ml-2 font-semibold">Buat satu sekarang!</a>
                      </Link>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
