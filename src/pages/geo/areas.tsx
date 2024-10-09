import React, { useState } from "react";
import AppNavbar from "@components/sections/AppNavbar";
import { useAreasApi } from "@/hooks/geo/useAreasApi";
import AreaModal from "@/components/geo/AreaModal";
import { ApiArea, Area } from "@/types/geo/Area";
import apiAreaToArea from "@/utils/geo/apiAreaToArea";
import AreasDashboard from "@/components/geo/AreasDashboard";
import AreasMap from "@/components/geo/AreasMap";
import MeasuringTool from "@/components/geo/MeasuringTool";
import PointInPolygonTool from "@/components/geo/PointInPolygonTool";
import AddressSearch from "@/components/geo/AddressSearch";

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
      fetchAreas();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteArea = async (id: string) => {
    try {
      await deleteArea(id);
      setIsModalOpen(false);
      fetchAreas();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAreaAdded = async (newArea: Area) => {
    try {
      await createArea({
        name: "New Area",
        polygon: newArea.coordinates.flatMap((coord) => coord).join(","),
      });
      fetchAreas();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AppNavbar />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Areas Dashboard
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <AreasDashboard
              areas={apiAreas}
              loading={loading}
              error={apiError as Error | null}
              onEditArea={handleEditArea}
              onAddNewArea={handleAddNewArea}
              onRefreshAreas={fetchAreas}
            />
          </div>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <AreasMap
              areas={apiAreas.map(apiAreaToArea)}
              onAreaAdded={handleAreaAdded}
            />
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <MeasuringTool />
          <PointInPolygonTool />
          <AddressSearch />
        </div>
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
