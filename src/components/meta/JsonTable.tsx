import React from 'react';

type Props = {
  data: Array<Record<string, any>>;
};

const JsonTable: React.FC<Props> = ({ data }) => {
  const renderValue = (value: any): JSX.Element | string => {
    if (Array.isArray(value) && value.every(item => typeof item === 'object')) {
      return <JsonTable data={value} />; // Recursive call for nested arrays of objects
    } else if (typeof value === 'object' && value !== null) {
      return <JsonTable data={[value]} />; // Treat single objects as an array with one object
    } else {
      return value?.toString() ?? 'N/A'; // Convert null or undefined to 'N/A'
    }
  };

  // Extracting all unique keys from the data array for table headers
  const headers = Array.from(new Set(data.flatMap(Object.keys)));

  return (
    <div className="overflow-x-auto shadow-md sm:rounded-lg mt-4">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {headers.map((header, index) => (
              <th key={index} className="px-6 py-3">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              {headers.map((header, headerIndex) => (
                <td key={headerIndex} className="px-6 py-4 whitespace-nowrap">
                  {renderValue(item[header])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JsonTable;
