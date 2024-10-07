import React, { useState } from "react";
import AppNavbar from "@components/sections/AppNavbar";
import { useAreasApi } from "@/hooks/geo/useAreasApi";
import AreaModal from "@/components/geo/AreaModal";
import { ApiArea, Area } from "@/types/geo/Area";
import apiAreaToArea from "@/utils/geo/apiAreaToArea";

const AreasPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentArea, setCurrentArea] = useState<Area | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  const {
    fetchAreas,
    updateArea,
    deleteArea,
    createArea,
    loading,
    error: apiError,
    areas: apiAreas,
  } = useAreasApi();

  const handleEditArea = (area: ApiArea) => {
    setCurrentArea(apiAreaToArea(area));
    setIsModalOpen(true);
  };

  const handleAddNewArea = () => {
    setCurrentArea(undefined);
    setIsModalOpen(true);
  };

  const handleSaveArea = async (area: Area) => {
    try {
      if (area.id) {
        await updateArea({
          id: area.id,
          name: apiAreas.find((a) => a.id === area.id)?.name || "",
          polygon: area.coordinates.flatMap((coord) => coord).join(","),
        });
      } else {
        await createArea({
          name: "New Area",
          polygon: area.coordinates.flatMap((coord) => coord).join(","),
        });
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteArea = async (id: string) => {
    try {
      await deleteArea(id);
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AppNavbar />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Areas</h1>
          <button
            onClick={fetchAreas}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
          >
            Refresh Areas
          </button>
          <button
            onClick={handleAddNewArea}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Add New Area
          </button>
        </div>
        {loading ? (
          <p className="text-lg text-gray-700">Loading areas...</p>
        ) : apiError ? (
          <p className="text-lg text-red-600">{apiError.toString()}</p>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {apiAreas.map((area) => (
                  <tr key={area.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {area.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {area.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleEditArea(area)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <AreaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        area={currentArea}
        onSave={handleSaveArea}
        onDelete={handleDeleteArea}
      />
    </div>
  );
};

export default AreasPage;
