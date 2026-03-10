import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import { Plus, Edit2, Power, Layout, Target, Layers } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import DomainService from "@/appwrite/domainServices";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AddDomainForm from "./AddDomainForm";

const domainService = new DomainService();

const AllDomains = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const fetchDomains = async () => {
    const res = await domainService.getAllDomains();
    return res.rows || [];
  };

  const {
    data: domains = [],
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["domains"],
    queryFn: fetchDomains
  });

  const toggleDomain = async (e, domain) => {
    e.stopPropagation();
    try {
      await domainService.updateDomain(domain.$id, { isActive: !domain.isActive });
      queryClient.invalidateQueries({ queryKey: ["domains"] });
    } catch (err) {
      console.error("Toggle domain error:", err);
    }
  };

  const handleEdit = (e, id) => {
    e.stopPropagation();
    navigate(`/dashboard/edit-domain/${id}`);
  };

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 font-bold animate-pulse uppercase tracking-widest text-xs">Fetching Domains...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header Area */}
      <div className="flex items-end justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-wider rounded-md">Content Catalog</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Curriculum Domains</h1>
          <p className="text-slate-500 font-medium">Manage and organize learning paths across the platform</p>
        </motion.div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-8 py-4 bg-gradient-to-br from-indigo-600 to-violet-700 text-white rounded-2xl font-black uppercase tracking-wider text-xs shadow-xl shadow-indigo-200 hover:shadow-indigo-300 transition-all"
            >
              <Plus className="w-5 h-5" />
              Add Domain
            </motion.button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl bg-white rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 text-white">
              <h2 className="text-2xl font-black">Create New Domain</h2>
              <p className="text-indigo-100 text-sm opacity-80 font-medium">Define a new learning specialization path</p>
            </div>
            <div className="p-8">
              <AddDomainForm
                onSuccess={() => {
                  queryClient.invalidateQueries({ queryKey: ["domains"] });
                  setOpen(false);
                }}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Domains Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {domains.map((domain, idx) => (
            <motion.div
              key={domain.$id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => navigate(`/dashboard/domains/${domain.$id}/topics`)}
              className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500 cursor-pointer overflow-hidden group flex flex-col"
            >
              {/* Card Image Wrapper */}
              <div className="relative h-56 overflow-hidden">
                {domain.imageId ? (
                  <img
                    src={domainService.getImagePreview(domain.imageId)}
                    alt={domain.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                    <Layout className="w-12 h-12 text-slate-300" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 flex items-end p-6">
                  <div className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg backdrop-blur-md ${domain.isActive ? "bg-emerald-500/80" : "bg-rose-500/80"}`}>
                    {domain.isActive ? "Online" : "Paused"}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{domain.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-6 font-medium">
                  {domain.description || "Start building a comprehensive curriculum path for this domain."}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center gap-3">
                    <Target className="w-4 h-4 text-indigo-500" />
                    <div>
                      <p className="text-[10px] uppercase font-black text-slate-400 leading-none mb-1">Level</p>
                      <p className="text-sm font-black text-slate-800 uppercase tracking-tighter">{domain.level || "Any"}</p>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center gap-3">
                    <Layers className="w-4 h-4 text-indigo-500" />
                    <div>
                      <p className="text-[10px] uppercase font-black text-slate-400 leading-none mb-1">Status</p>
                      <p className={`text-sm font-black uppercase tracking-tighter ${domain.isActive ? "text-emerald-600" : "text-rose-600"}`}>
                        {domain.isActive ? "Published" : "Draft"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-auto">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => toggleDomain(e, domain)}
                    className={`flex-1 py-3 px-4 rounded-xl text-white font-black uppercase tracking-widest text-[10px] shadow-lg transition-all ${domain.isActive
                      ? "bg-rose-500 shadow-rose-200"
                      : "bg-emerald-600 shadow-emerald-200"
                      }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Power className="w-3.5 h-3.5" />
                      {domain.isActive ? "Deactivate" : "Activate"}
                    </div>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => handleEdit(e, domain.$id)}
                    className="py-3 px-5 bg-indigo-50 text-indigo-700 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-100 transition-all border border-indigo-100"
                  >
                    <Edit2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AllDomains;
