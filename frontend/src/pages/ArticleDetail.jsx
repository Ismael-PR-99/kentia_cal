import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function ArticleDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
        const response = await fetch(`${BASE_URL}/api/articles/${slug}/`);
        
        if (!response.ok) {
          throw new Error("Artículo no encontrado");
        }
        
        const data = await response.json();
        setArticle(data);
      } catch (error) {
        console.error("Error cargando artículo:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2 mb-8"></div>
            <div className="h-64 bg-slate-200 rounded mb-6"></div>
            <div className="space-y-3">
              <div className="h-4 bg-slate-200 rounded"></div>
              <div className="h-4 bg-slate-200 rounded"></div>
              <div className="h-4 bg-slate-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            Artículo no encontrado
          </h1>
          <p className="text-slate-600 mb-8">{error}</p>
          <Link
            to="/blog"
            className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition"
          >
            Volver al blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar />
      
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-slate-600">
          <Link to="/" className="hover:text-emerald-600">Inicio</Link>
          <span className="mx-2">→</span>
          <Link to="/blog" className="hover:text-emerald-600">Blog</Link>
          <span className="mx-2">→</span>
          <span className="text-slate-900">{article.title}</span>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {article.category && (
              <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-full">
                {article.category.name}
              </span>
            )}
            {article.is_verified && (
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                ✓ Verificado por profesional
              </span>
            )}
            {article.tags && article.tags.map((tag) => (
              <span
                key={tag.id}
                className="inline-block px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full"
              >
                #{tag.name}
              </span>
            ))}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            {article.title}
          </h1>
          
          <div className="flex items-center gap-4 text-slate-600 text-sm">
            <span>Por {article.author_name}</span>
            <span>•</span>
            <span>{new Date(article.published_at).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
            <span>•</span>
            <span>{article.views_count} vistas</span>
          </div>
        </header>

        {/* Imagen destacada */}
        {article.featured_image && (
          <div className="mb-8 rounded-xl overflow-hidden">
            <img
              src={article.featured_image}
              alt={article.title}
              className="w-full h-auto"
            />
          </div>
        )}

        {/* Contenido */}
        <div className="prose prose-lg max-w-none mb-12">
          <div className="text-xl text-slate-700 mb-8 font-medium">
            {article.excerpt}
          </div>
          
          <div className="text-slate-800 whitespace-pre-wrap leading-relaxed">
            {article.content}
          </div>
        </div>

        {/* Información adicional */}
        {article.source_url && (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-slate-900 mb-2">Fuente de referencia:</h3>
            <a
              href={article.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 hover:text-emerald-700 underline break-all"
            >
              {article.source_url}
            </a>
          </div>
        )}

        {article.reviewed_by_name && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <p className="text-blue-900">
              <strong>✓ Artículo revisado por:</strong> {article.reviewed_by_name}
            </p>
          </div>
        )}

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
          <p className="text-sm text-amber-900">
            <strong>Aviso:</strong> Este contenido tiene fines informativos y educativos únicamente. 
            No sustituye el consejo médico profesional. Consulte siempre con un profesional de la salud 
            calificado antes de tomar decisiones sobre su salud.
          </p>
        </div>

        {/* Navegación */}
        <div className="flex justify-center">
          <Link
            to="/blog"
            className="inline-block bg-emerald-600 text-white px-8 py-3 rounded-lg hover:bg-emerald-700 transition font-medium"
          >
            ← Volver al blog
          </Link>
        </div>
      </article>
    </div>
  );
}
