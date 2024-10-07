import React from "react";
import { ApiArea } from "@/types/geo/Area";

interface AreasDashboardProps {
  areas: ApiArea[];
  loading: boolean;
  error: Error | null;
  onEditArea: (area: ApiArea) => void;
  onAddNewArea: () => void;
  onRefreshAreas: () => void;
}

const AreasDashboard: React.FC<AreasDashboardProps> = ({
  areas,
  loading,
  error,
  onEditArea,
  onAddNewArea,
  onRefreshAreas,
}) => {
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Areas</h2>
        <div>
          <button
            onClick={onRefreshAreas}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
          >
            Refresh
          </button>
          <button
            onClick={onAddNewArea}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Add New
          </button>
        </div>
      </div>
      {loading ? (
        <p className="text-gray-600">Loading areas...</p>
      ) : error ? (
        <p className="text-red-600">{error.toString()}</p>
      ) : (
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
            {areas.map((area) => (
              <tr key={area.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {area.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {area.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => onEditArea(area)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AreasDashboard;
