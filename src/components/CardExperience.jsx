import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Briefcase } from "lucide-react";
import { toSlug } from "../utils/slug";

const CardExperience = ({ Img, Company, Role, Period, Description }) => {
  return (
    <div className="group relative w-full">
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-lg border border-white/10 shadow-2xl transition-all duration-300 hover:shadow-purple-500/20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>

        <div className="relative p-5 z-10 flex flex-col h-full">
          {Img && (
            <div className="relative overflow-hidden rounded-lg mb-4 aspect-[16/9]">
              <img
                src={Img}
                alt={Company}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          )}

          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-[11px]">
              <Calendar className="w-3 h-3" />
              <span>{Period}</span>
            </div>
          </div>

          <div className="space-y-1 mb-3">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent">
              {Role}
            </h3>
            <p className="text-sm font-medium text-indigo-400 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5" /> {Company}
            </p>
          </div>

          <p className="text-gray-300/80 text-sm leading-relaxed text-justify line-clamp-3 mb-4">
            {Description}
          </p>

          <div className="pt-2 mt-auto border-t border-white/5 flex justify-end">
            <Link
              to={`/experience/${toSlug(Role + "-" + Company)}`}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/90 transition-all duration-200 hover:scale-105 active:scale-95 text-xs"
            >
              <span>Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardExperience;