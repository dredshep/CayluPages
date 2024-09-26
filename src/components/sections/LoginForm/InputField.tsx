interface InputFieldProps {
  label: string;
  type: string;
  register: any;
  error?: string;
  className?: string;
}

export default function InputField({
  label,
  type,
  register,
  error,
  className,
}: InputFieldProps) {
  return (
    <div className="mb-4">
      <label className="block mb-1">{label}</label>
      <input
        type={type}
        className={`w-full p-2 border border-gray-300 rounded ${className}`}
        {...register}
      />
      {error && <span className="text-red-500">{error}</span>}
    </div>
  );
}
