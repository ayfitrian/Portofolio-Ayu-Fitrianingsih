import { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import { Plus, Trash2, Upload, Briefcase, X, ImageIcon, Pencil, Calendar, Layers, Code2 } from "lucide-react";

const Card = ({ children, className = "" }) => (
  <div className={`relative group ${className}`}>
    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-2xl blur opacity-10 group-hover:opacity-25 transition duration-500" />
    <div className="relative bg-white/5 backdrop-blur-xl border border-white/12 rounded-2xl h-full">{children}</div>
  </div>
);

const InputField = ({ label, value, onChange, placeholder, required = false }) => (
  <div className="space-y-1.5">
    <label className="text-xs text-indigo-300/70 uppercase tracking-wider font-medium">{label}</label>
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full bg-[#0d0d22] border border-white/10 rounded-xl px-4 py-2.5 text-gray-200 placeholder-gray-600 text-sm outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20 transition-all"
    />
  </div>
);

const ExpCard = ({ exp, onDelete, onEdit }) => {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <Card>
      <div className="p-4 flex flex-col h-full">
        {exp.Img && (
          <div className="w-full aspect-[16/9] rounded-xl mb-4 border border-white/8 overflow-hidden bg-white/5">
            {!imgLoaded && <div className="w-full h-full animate-pulse bg-white/5" />}
            <img
              src={exp.Img}
              alt={exp.Company}
              onLoad={() => setImgLoaded(true)}
              className={`w-full h-full object-cover transition-opacity duration-300 ${imgLoaded ? "opacity-100" : "opacity-0 absolute"}`}
            />
          </div>
        )}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] uppercase font-semibold">
            {exp.Category}
          </span>
          <p className="text-gray-500 text-[11px] flex items-center gap-1"><Calendar className="w-3 h-3"/> {exp.Period}</p>
        </div>
        <h3 className="font-semibold text-white text-sm mb-0.5">{exp.Role}</h3>
        <p className="text-indigo-400 text-xs font-medium mb-2">{exp.Company}</p>
        <p className="text-gray-400 text-xs mb-3 line-clamp-3 leading-relaxed">{exp.Description}</p>

        {exp.TechStack && exp.TechStack.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {exp.TechStack.map((tech, idx) => (
              <span key={idx} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] text-gray-400">
                {tech}
              </span>
            ))}
          </div>
        )}
        
        <div className="mt-auto flex items-center justify-end gap-2 pt-2 border-t border-white/8">
          <button onClick={() => onEdit(exp)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-500/25 text-indigo-400 hover:bg-indigo-500/10 text-xs transition-colors">
            <Pencil className="w-3 h-3" /> Edit
          </button>
          <button onClick={() => onDelete(exp.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 text-xs transition-colors">
            <Trash2 className="w-3 h-3" /> Delete
          </button>
        </div>
      </div>
    </Card>
  );
};

const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
    <div className="relative z-10 w-full max-w-2xl flex flex-col" style={{ maxHeight: "calc(100vh - 24px)" }}>
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-2xl blur opacity-20 pointer-events-none" />
      <div className="relative bg-[#0a0a1a] border border-white/12 rounded-2xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8 shrink-0">
          <h2 className="text-base font-semibold text-white">{title}</h2>
          <button type="button" onClick={onClose} className="p-1 text-gray-500 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <div className="overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  </div>
);

const ExpForm = ({ initial, onSubmit, onCancel, submitLabel = "Save Experience", uploading }) => {
  const [form, setForm] = useState({
    Company: initial?.Company || "",
    Role: initial?.Role || "",
    Period: initial?.Period || "",
    Description: initial?.Description || "",
    Category: initial?.Category || "Organization",
    TechStack: initial?.TechStack ? initial.TechStack.join(", ") : "",
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(initial?.Img || null);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmitForm = (e) => {
    e.preventDefault();
    const arrayTech = form.TechStack
      ? form.TechStack.split(",").map((t) => t.trim()).filter((t) => t !== "")
      : [];
    onSubmit({ ...form, TechStack: arrayTech }, file);
  };

  return (
    <form onSubmit={handleSubmitForm} className="p-5 sm:p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField label="Organisasi / Kepanitiaan" value={form.Company} onChange={set("Company")} placeholder="e.g. HMIF Unsoed / Jasa Marga" required />
        <InputField label="Jabatan / Posisi" value={form.Role} onChange={set("Role")} placeholder="e.g. Staff Administrasi / Intern" required />
        <InputField label="Periode Waktu (Bulan Tahun)" value={form.Period} onChange={set("Period")} placeholder="e.g. Juli 2025 - Agustus 2025" required />
        
        <div className="space-y-1.5">
          <label className="text-xs text-indigo-300/70 uppercase tracking-wider font-medium">Kategori</label>
          <select value={form.Category} onChange={set("Category")} className="w-full bg-[#0d0d22] border border-white/10 rounded-xl px-4 py-2.5 text-gray-200 text-sm outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20 transition-all">
            <option value="Works">Works</option>
            <option value="Organization">Organization</option>
            <option value="Committes">Committes</option>
          </select>
        </div>

        <div className="sm:col-span-2 space-y-1.5">
          <InputField label="Keahlian / Tech Stack (Pisahkan dengan koma)" value={form.TechStack} onChange={set("TechStack")} placeholder="e.g. Laravel, React, Teamwork, Public Speaking" />
        </div>
        
        <div className="sm:col-span-2 space-y-1.5">
          <label className="text-xs text-indigo-300/70 uppercase tracking-wider font-medium">Description</label>
          <textarea value={form.Description} onChange={set("Description")} placeholder="Jelaskan deskripsi tugas atau kontribusi kamu..." rows={4} className="w-full bg-[#0d0d22] border border-white/10 rounded-xl px-4 py-2.5 text-gray-200 placeholder-gray-600 text-sm outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20 transition-all resize-none" required />
        </div>

        <div className="sm:col-span-2 space-y-1.5">
          <label className="text-xs text-indigo-300/70 uppercase tracking-wider font-medium">Dokumentasi</label>
          <label className="flex items-center gap-4 w-full bg-[#0d0d22] border border-dashed border-white/15 rounded-xl px-4 py-4 cursor-pointer hover:border-indigo-500/40 hover:bg-white/4 transition-all">
            {preview ? <img src={preview} className="h-16 w-24 object-cover rounded-lg border border-white/10" alt="preview" /> : (
              <div className="w-24 h-16 rounded-lg bg-white/5 flex items-center justify-center border border-white/10"><ImageIcon className="w-5 h-5 text-gray-600" /></div>
            )}
            <div>
              <p className="text-sm text-gray-300">{preview ? "Change Image" : "Click to Upload Image"}</p>
              <p className="text-xs text-gray-600 mt-0.5">PNG, JPG, WEBP supported</p>
            </div>
            <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files[0]; if(f){ setFile(f); setPreview(URL.createObjectURL(f)); } }} className="hidden" />
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-1">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-xl border border-white/10 text-gray-400 hover:text-white text-sm transition-colors">Cancel</button>
        <button type="submit" disabled={uploading} className="relative group/s">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#4f52c9] to-[#8644c5] rounded-xl opacity-60 blur group-hover/s:opacity-100 transition duration-300" />
          <div className="relative flex items-center gap-2 px-5 py-2 bg-[#030014] rounded-xl border border-white/10">
            {uploading ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Upload className="w-4 h-4 text-indigo-400" />}
            <span className="text-sm text-gray-200">{uploading ? "Saving..." : submitLabel}</span>
          </div>
        </button>
      </div>
    </form>
  );
};

export default function ExperiencesDashboard() {
  const [exps, setExps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editExp, setEditExp] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchExps = async () => {
    setLoading(true);
    const { data } = await supabase.from("experiences").select("*").order("created_at", { ascending: false });
    setExps(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchExps(); }, []);

  const uploadImage = async (f) => {
    const fileName = `exp-${Date.now()}-${f.name}`;
    await supabase.storage.from("experience-images").upload(fileName, f);
    const { data } = supabase.storage.from("experience-images").getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleCreate = async (form, file) => {
    setUploading(true);
    let imgUrl = "";
    if (file) imgUrl = await uploadImage(file);
    await supabase.from("experiences").insert({
      Company: form.Company,
      Role: form.Role,
      Period: form.Period,
      Description: form.Description,
      Category: form.Category,
      TechStack: form.TechStack,
      Img: imgUrl,
    });
    setShowCreate(false); setUploading(false); fetchExps();
  };

  const handleEdit = async (form, file) => {
    setUploading(true);
    let imgUrl = editExp.Img || "";
    if (file) imgUrl = await uploadImage(file);
    await supabase.from("experiences").update({
      Company: form.Company,
      Role: form.Role,
      Period: form.Period,
      Description: form.Description,
      Category: form.Category,
      TechStack: form.TechStack,
      Img: imgUrl,
    }).eq("id", editExp.id);
    setEditExp(null); setUploading(false); fetchExps();
  };

  const deleteExp = async (id) => {
    if (!confirm("Delete this experience?")) return;
    await supabase.from("experiences").delete().eq("id", id);
    fetchExps();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-xl blur opacity-50" />
            <div className="relative w-9 h-9 bg-[#030014] rounded-xl border border-white/15 flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-indigo-400" />
            </div>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">Experiences</h1>
            <p className="text-gray-500 text-xs">{loading ? "Loading..." : `${exps.length} experiences total`}</p>
          </div>
        </div>

        <button onClick={() => setShowCreate(true)} className="relative group shrink-0">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#4f52c9] to-[#8644c5] rounded-xl opacity-50 blur group-hover:opacity-80 transition duration-300" />
          <div className="relative flex items-center gap-2 px-4 py-2.5 bg-[#030014] rounded-xl border border-white/10">
            <Plus className="w-4 h-4 text-indigo-400" />
            <span className="text-sm text-gray-200">New Experience</span>
          </div>
        </button>
      </div>

      {showCreate && (
        <Modal title="Add New Experience" onClose={() => setShowCreate(false)}>
          <ExpForm onSubmit={handleCreate} onCancel={() => setShowCreate(false)} uploading={uploading} />
        </Modal>
      )}

      {editExp && (
        <Modal title="Edit Experience" onClose={() => setEditExp(null)}>
          <ExpForm initial={editExp} onSubmit={handleEdit} onCancel={() => setEditExp(null)} submitLabel="Update Experience" uploading={uploading} />
        </Modal>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white/5 border border-white/12 rounded-2xl p-4 h-48 animate-pulse" />
          ))}
        </div>
      ) : exps.length === 0 ? (
        <Card>
          <div className="p-16 text-center">
            <Briefcase className="w-10 h-10 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No experiences yet.</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {exps.map((exp) => (
            <ExpCard key={exp.id} exp={exp} onDelete={deleteExp} onEdit={setEditExp} />
          ))}
        </div>
      )}
    </div>
  );
}