import { useState } from "react";
import DomainService from "@/src/appwrite/domainServices";
import { useNavigate } from "react-router";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AddDomainForm from "./AddDomainForm";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const domainService = new DomainService();

const AllDomains = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const fetchDomains=async()=>{
 const res = await domainService.getAllDomains();
 return res.rows || []
  }
  const {
    data: domains = [],
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["domains"],
    queryFn: fetchDomains
  });

  async function toggleDomain(e, domain) {
    e.stopPropagation();

    await domainService.updateDomain(domain.$id, {
      isActive: !domain.isActive,
    });

    queryClient.invalidateQueries({ queryKey: ["domains"] });
  }

  function handleEdit(e, id) {
    e.stopPropagation();
    navigate(`/dashboard/edit-domain/${id}`);
  }

  if (isPending) {
    return <p className="text-center mt-10">Loading domains...</p>;
  }

  if (isError) {
    return <p className="text-red-500">{error.message}</p>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">All Domains</h2>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>+ Add Domain</Button>
          </DialogTrigger>

          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Domain</DialogTitle>
            </DialogHeader>

            <AddDomainForm
              onSuccess={() => {
                queryClient.invalidateQueries({ queryKey: ["domains"] });
                setOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {domains.map((domain) => (
          <div
            key={domain.$id}
            onClick={() =>
              navigate(`/dashboard/domains/${domain.$id}/topics`)
            }
            className="bg-white rounded-xl shadow hover:shadow-lg transition cursor-pointer overflow-hidden"
          >
            {domain.imageId && (
              <img
                src={domainService.getImagePreview(domain.imageId)}
                alt={domain.title}
                className="w-full h-44 object-cover"
              />
            )}

            <div className="p-4">
              <h3 className="text-lg font-semibold">{domain.title}</h3>
              <p className="text-sm text-gray-600 mt-1">
                {domain.description}
              </p>

              <div className="flex justify-between mt-3 text-sm">
                <span>
                  <strong>Level:</strong> {domain.level}
                </span>
                <span
                  className={
                    domain.isActive ? "text-green-600" : "text-red-600"
                  }
                >
                  {domain.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={(e) => toggleDomain(e, domain)}
                  className={`flex-1 py-2 text-white rounded ${
                    domain.isActive
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {domain.isActive ? "Deactivate" : "Activate"}
                </button>

                <button
                  onClick={(e) => handleEdit(e, domain.$id)}
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllDomains;
