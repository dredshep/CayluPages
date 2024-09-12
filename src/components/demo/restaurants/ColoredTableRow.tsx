interface ColoredTableRowProps {
  date: string;
  isWithinInput: boolean;
  isWithinNow: boolean;
  isBusinessOpen?: boolean; // Optional for holiday rows
  description: string;
}

const ColoredTableRow: React.FC<ColoredTableRowProps> = ({
  date,
  isWithinInput,
  isWithinNow,
  isBusinessOpen,
  description,
}) => {
  return (
    <tr className="bg-gray-900">
      {" "}
      {/* Row stays gray */}
      <td className="p-2 font-mono">{date}</td>
      {/* Cell coloring based on condition */}
      <td className={`p-2 ${isWithinInput ? "bg-green-900" : "bg-red-900"}`}>
        {isWithinInput ? "Yes" : "No"}
      </td>
      <td className={`p-2 ${isWithinNow ? "bg-green-900" : "bg-red-900"}`}>
        {isWithinNow ? "Yes" : "No"}
      </td>
      {/* Business Open status is optional */}
      {isBusinessOpen !== undefined && (
        <td className={`p-2 ${isBusinessOpen ? "bg-green-900" : "bg-red-900"}`}>
          {isBusinessOpen ? "Yes" : "No"}
        </td>
      )}
      <td className="p-2">{description}</td>
    </tr>
  );
};

export default ColoredTableRow;
