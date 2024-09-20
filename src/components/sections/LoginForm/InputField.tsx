interface InputFieldProps {
  label: string;
  type: string;
  register: any;
  error?: string;
}

export default function InputField({
  label,
  type,
  register,
  error,
}: InputFieldProps) {
  return (
    <div className="mb-4">
      <label className="block mb-1">{label}</label>
      <input
        type={type}
        className="w-full p-2 border border-gray-300 rounded"
        {...register}
      />
      {error && <span className="text-red-500">{error}</span>}
    </div>
  );
}
