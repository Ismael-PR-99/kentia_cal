import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";

export default function Blog() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
        
        const categoryFilter = selectedCategory ? `?category=${selectedCategory}` : "";
        const articlesUrl = `${BASE_URL}/api/articles${categoryFilter}`;
        const categoriesUrl = `${BASE_URL}/api/categories/`;
        
        console.log("🔍 Fetching articles desde:", articlesUrl);
        console.log("🔍 Fetching categories desde:", categoriesUrl);
        
        const [articlesRes, categoriesRes] = await Promise.all([
          fetch(articlesUrl),
          fetch(categoriesUrl),
        ]);
        
        console.log("📡 Articles Response Status:", articlesRes.status);
        console.log("📡 Categories Response Status:", categoriesRes.status);
        
        const articlesData = await articlesRes.json();
        const categoriesData = await categoriesRes.json();
        
        console.log("📰 Artículos recibidos:", articlesData.length, articlesData);
        console.log("📚 Categorías recibidas:", categoriesData.length, categoriesData);
        
        setArticles(articlesData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("❌ Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar />

      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Blog de Salud
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Artículos verificados por profesionales sobre salud, bienestar y hábitos saludables
          </p>
        </div>

        {/* Filtro por categorías */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              selectedCategory === null
                ? "bg-emerald-600 text-white"
                : "bg-white text-slate-700 border border-slate-200 hover:border-emerald-600"
            }`}
          >
            Todos
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.slug)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedCategory === category.slug
                  ? "bg-emerald-600 text-white"
                  : "bg-white text-slate-700 border border-slate-200 hover:border-emerald-600"
              }`}
            >
              {category.name} ({category.articles_count})
            </button>
          ))}
        </div>

        {/* Lista de artículos */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-slate-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-5/6"></div>
              </div>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500 text-lg">
              No hay artículos disponibles en esta categoría.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-slate-200 hover:shadow-xl transition overflow-hidden group"
              >
                {article.featured_image && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={article.featured_image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                )}
                <div className="p-6">
                  {article.category && (
                    <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full mb-3">
                      {article.category.name}
                    </span>
                  )}
                  {article.is_verified && (
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full mb-3 ml-2">
                      ✓ Verificado
                    </span>
                  )}
                  <h3 className="text-xl font-semibold text-slate-900 mb-2 group-hover:text-emerald-600 transition">
                    {article.title}
                  </h3>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                    <span>{new Date(article.published_at).toLocaleDateString('es-ES')}</span>
                    <span>{article.views_count} vistas</span>
                  </div>
                  <Link
                    to={`/blog/${article.slug}`}
                    className="inline-block text-emerald-600 hover:text-emerald-700 font-medium text-sm"
                  >
                    Leer artículo completo →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
