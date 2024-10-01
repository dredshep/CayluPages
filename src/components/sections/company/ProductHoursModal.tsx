import React from "react";
import moment from "moment";
import { FaTimes, FaClock } from "react-icons/fa";
import { useProductStore } from "@/store/product/useProductStore";
import { transformBigIntToNumber } from "@/utils/transformBigIntToNumber";

interface ProductHoursModalProps {
  productId: number;
  companyId: number;
  onClose: () => void;
}

const ProductHoursModal: React.FC<ProductHoursModalProps> = ({
  productId,
  companyId,
  onClose,
}) => {
  const { products } = useProductStore();
  const product = products[companyId]?.find((p) => p.id === productId);

  if (!product) {
    return null;
  }

  const formatHours = (hours: string) => {
    return moment(hours, "HH:mm:ss").format("h:mm A");
  };

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const getHoursForDay = (day: string) => {
    const dayIndex = daysOfWeek.indexOf(day);
    const hoursForDay = product.productHours.filter(
      (hour) => hour.weekday === dayIndex + 1
    );

    return hoursForDay.length > 0 ? hoursForDay : null;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="bg-indigo-100 rounded-full p-2 mr-3">
              <FaClock className="text-indigo-600 text-xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              {product.name} - Available Hours
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <FaTimes className="h-6 w-6" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {daysOfWeek.map((day) => (
            <div key={day} className="bg-gray-50 p-3 rounded-md">
              <h4 className="font-medium text-gray-900">{day}</h4>
              {getHoursForDay(day) && (
                <table className="table-auto w-full">
                  <tbody>
                    {getHoursForDay(day)?.map((hour, index) => (
                      <tr key={index}>
                        <td className="text-sm text-gray-500">
                          {formatHours(hour.start_time)} -{" "}
                          {formatHours(hour.end_time)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ))}
        </div>
        <div className="mt-5 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductHoursModal;
