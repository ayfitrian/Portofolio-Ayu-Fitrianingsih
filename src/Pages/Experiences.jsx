import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "../supabase";
import CardExperience from "../components/CardExperience";
import { Briefcase, Layers, Users, Award } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

const ToggleButton = ({ onClick, isShowingMore }) => (
  <button
    onClick={onClick}
    className="px-4 py-2 text-slate-300 hover:text-white text-sm font-medium transition-all duration-300 flex items-center gap-2 bg-white/5 hover:bg-white/10 rounded-md border border-white/10 hover:border-white/20 backdrop-blur-sm group relative overflow-hidden"
  >
    <span className="relative z-10 flex items-center gap-2">
      {isShowingMore ? "See Less" : "See More"}
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-300 ${isShowingMore ? "group-hover:-translate-y-0.5" : "group-hover:translate-y-0.5"}`}><polyline points={isShowingMore ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}/></svg>
    </span>
  </button>
);

export default function Experiences() {
  const [activeTab, setActiveTab] = useState("All");
  const [experiences, setExperiences] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);

  const initialItems = 6;

  useEffect(() => {
    AOS.init({ once: false });
    
    const fetchExperiences = async () => {
      try {
        const { data, error } = await supabase
          .from("experiences")
          .select("*")
          .order("id", { ascending: false });

        if (error) throw error;
        setExperiences(data || []);
      } catch (error) {
        console.error("Error fetching experiences:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  // Filter berdasarkan Kategori Tab
  const filteredExperiences = experiences.filter((exp) => {
    if (activeTab === "All") return true;
    return exp.Category === activeTab;
  });

  const displayedExperiences = showAll ? filteredExperiences : filteredExperiences.slice(0, initialItems);

  const tabs = [
    { id: "All", label: "All", icon: Layers },
    { id: "Works", label: "Works", icon: Briefcase },
    { id: "Organization", label: "Organization", icon: Users },
    { id: "Committes", label: "Committees", icon: Award },
  ];

  return (
    <div className="md:px-[10%] px-[5%] w-full py-16 bg-[#030014] overflow-hidden" id="Experiences">
      {/* Header */}
      <div className="text-center pb-8" data-aos="fade-up" data-aos-duration="1000">
        <h2 className="inline-block text-3xl md:text-5xl font-bold text-center mx-auto text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]">
          Experiences Journey
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base mt-2">
          Explore my structural milestones categorized by Professional Works, Organization involvement, and Committees management.
        </p>
      </div>

      {/* Tabs Kategori Custom Desain Kaca */}
      <div className="flex flex-wrap justify-center gap-3 mb-10" data-aos="fade-up" data-aos-duration="1200">
        <div className="flex bg-white/5 p-1.5 rounded-xl border border-white/10 backdrop-blur-md gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setShowAll(false); }}
                className={`flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-semibold rounded-lg transition-all duration-300 ${
                  active 
                    ? "bg-gradient-to-r from-indigo-500/30 to-purple-500/30 border border-indigo-500/40 text-white shadow-lg" 
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-indigo-400' : ''}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-5 h-64 animate-pulse" />
          ))}
        </div>
      ) : displayedExperiences.length === 0 ? (
        <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
          <p className="text-gray-500 text-sm">No experiences listed in this category.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedExperiences.map((exp, index) => (
              <div
                key={exp.id}
                data-aos={index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left"}
                data-aos-duration="1000"
              >
                <CardExperience
                  Img={exp.Img}
                  Company={exp.Company}
                  Role={exp.Role}
                  Period={exp.Period}
                  Description={exp.Description}
                />
              </div>
            ))}
          </div>

          {/* See More Toggle Button */}
          {filteredExperiences.length > initialItems && (
            <div className="mt-8 w-full flex justify-start" data-aos="fade-up">
              <ToggleButton
                onClick={() => setShowAll(!showAll)}
                isShowingMore={showAll}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}