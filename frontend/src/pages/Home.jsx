import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
        console.log("🔍 Fetching desde:", BASE_URL);
        
        const [articlesRes, categoriesRes] = await Promise.all([
          fetch(`${BASE_URL}/api/articles/`),
          fetch(`${BASE_URL}/api/categories/`),
        ]);
        
        console.log("📡 Articles Response Status:", articlesRes.status);
        console.log("📡 Categories Response Status:", categoriesRes.status);
        
        const articlesData = await articlesRes.json();
        const categoriesData = await categoriesRes.json();
        
        console.log("📰 Artículos recibidos:", articlesData.length, articlesData);
        console.log("📚 Categorías recibidas:", categoriesData.length, categoriesData);
        
        setArticles(articlesData.slice(0, 6));
        setCategories(categoriesData);
      } catch (error) {
        console.error("❌ Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
            Tu salud, nuestro compromiso
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Descubre contenido educativo sobre salud, bienestar y hábitos saludables.
            Herramientas gratuitas para mejorar tu calidad de vida.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/blog"
              className="bg-slate-900 text-white px-8 py-3 rounded-lg hover:bg-slate-800 transition font-medium text-lg"
            >
              Explorar Blog
            </Link>
            <Link
              to="/calculadoras"
              className="bg-white text-slate-900 px-8 py-3 rounded-lg border-2 border-slate-900 hover:bg-slate-50 transition font-medium text-lg"
            >
              Calculadoras
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-slate-900 mb-8">Categorías</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/blog?category=${category.slug}`}
              className="bg-white p-6 rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition text-center group"
            >
              <div className="text-2xl mb-2">📚</div>
              <h3 className="font-semibold text-slate-900 group-hover:text-emerald-600 transition">
                {category.name}
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                {category.articles_count} artículos
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Articles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Artículos Destacados</h2>
          <Link to="/blog" className="text-emerald-600 hover:text-emerald-700 font-medium">
            Ver todos →
          </Link>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-slate-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-5/6"></div>
              </div>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500">No hay artículos disponibles en este momento.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-slate-200 hover:shadow-lg transition overflow-hidden group"
              >
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
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>{new Date(article.published_at).toLocaleDateString('es-ES')}</span>
                    <span>{article.views_count} vistas</span>
                  </div>
                </div>
                <div className="px-6 pb-6">
                  <Link
                    to={`/blog/${article.slug}`}
                    className="text-emerald-600 hover:text-emerald-700 font-medium text-sm"
                  >
                    Leer más →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
          Herramientas Gratuitas
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Link
            to="/calculadoras/imc"
            className="bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-xl border border-emerald-200 hover:shadow-lg transition"
          >
            <div className="text-4xl mb-4">⚖️</div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Calculadora IMC
            </h3>
            <p className="text-slate-600">
              Calcula tu Índice de Masa Corporal y obtén recomendaciones personalizadas.
            </p>
          </Link>

          <Link
            to="/calculadoras/calorias"
            className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-xl border border-blue-200 hover:shadow-lg transition"
          >
            <div className="text-4xl mb-4">🔥</div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Calorías Diarias
            </h3>
            <p className="text-slate-600">
              Descubre cuántas calorías necesitas según tu nivel de actividad.
            </p>
          </Link>

          <Link
            to="/calculadoras/hidratacion"
            className="bg-gradient-to-br from-cyan-50 to-blue-50 p-8 rounded-xl border border-cyan-200 hover:shadow-lg transition"
          >
            <div className="text-4xl mb-4">💧</div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Hidratación
            </h3>
            <p className="text-slate-600">
              Calcula tu ingesta diaria de agua recomendada.
            </p>
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-slate-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Quieres seguimiento personalizado?
          </h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Regístrate para acceder a tu dashboard personal, seguimiento de hábitos,
            objetivos y mucho más.
          </p>
          <Link
            to="/register"
            className="inline-block bg-white text-slate-900 px-8 py-3 rounded-lg hover:bg-slate-100 transition font-medium"
          >
            Crear cuenta gratuita
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-slate-600 text-sm">
            <strong>Aviso importante:</strong> Esta plataforma proporciona información general con fines
            educativos únicamente. El contenido no constituye asesoramiento médico, diagnóstico o
            tratamiento. Siempre consulte con un profesional de la salud calificado.
          </p>
          <p className="text-center text-slate-500 text-sm mt-4">
            © 2026 FisioApp. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
