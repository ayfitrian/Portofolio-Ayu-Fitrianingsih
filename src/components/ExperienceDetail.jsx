import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight, Briefcase, Calendar, Layers, Star, Code2, Award } from "lucide-react";
import { supabase } from "../supabase";
import { toSlug } from "../utils/slug";

export default function ExperienceDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [exp, setExp] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchExperienceData = async () => {
      try {
        const { data, error } = await supabase.from("experiences").select("*");
        if (error) throw error;

        const target = data.find((e) => toSlug(e.Role + "-" + e.Company) === slug);
        if (target) {
          setExp(target);
        } else {
          navigate("/404");
        }
      } catch (err) {
        console.error("Error loading detail experience:", err.message);
      }
    };
    fetchExperienceData();
  }, [slug, navigate]);

  if (!exp) {
    return (
      <div className="min-h-screen bg-[#030014] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-t-transparent border-[#6366f1] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{exp.Role} di {exp.Company} — Ayu Fitrianingsih</title>
      </Helmet>

      <div className="min-h-screen bg-[#030014] px-[5%] lg:px-[10%] py-12 relative overflow-hidden text-white">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center space-x-2 mb-8 relative z-10">
          <button onClick={() => navigate(-1)} className="flex items-center space-x-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all text-sm">
            <ArrowLeft className="w-4 h-4" /> <span>Back</span>
          </button>
          <div className="flex items-center space-x-1 text-sm text-white/50">
            <span>Experiences</span><ChevronRight className="w-4 h-4" />
            <span className="text-white truncate">{exp.Company}</span>
          </div>
        </div>

        {/* Layout Grid Detail */}
        <div className="grid lg:grid-cols-2 gap-12 relative z-10">
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs uppercase tracking-wide font-bold">
                {exp.Category}
              </span>
              <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent leading-tight">
                {exp.Role}
              </h1>
              <p className="text-base font-medium text-indigo-400 flex items-center gap-2">
                <Briefcase className="w-4 h-4" /> {exp.Company}
              </p>
              <p className="text-xs text-gray-400 flex items-center gap-1.5 pt-1">
                <Calendar className="w-3.5 h-3.5" /> {exp.Period}
              </p>
            </div>

            {/* Konten Deskripsi Penuh */}
            <div className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl space-y-3">
              <h3 className="text-md font-semibold text-white/90 flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400" /> Tugas & Kontribusi Utama
              </h3>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed text-justify whitespace-pre-line">
                {exp.Description}
              </p>
            </div>

            {/* Keahlian yang Diperoleh */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-blue-400" /> Keahlian / Tech Stack
              </h3>
              {exp.TechStack && exp.TechStack.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {exp.TechStack.map((tech, idx) => (
                    <div key={idx} className="px-3 py-1.5 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/10 rounded-xl text-xs font-medium text-blue-300">
                      {tech}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500 italic">Tidak ada keahlian khusus ditambahkan.</p>
              )}
            </div>
          </div>

          {/* Kolom Dokumentasi Gambar */}
          {exp.Img && (
            <div className="flex items-start justify-center">
              <div className="w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-white/5">
                <img src={exp.Img} alt="Dokumentasi" className="w-full h-auto object-cover" />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}