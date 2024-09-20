interface TabNavigationProps {
  activeTab: "login" | "register" | "recovery";
  setActiveTab: (tab: "login" | "register" | "recovery") => void;
}

export default function TabNavigation({
  activeTab,
  setActiveTab,
}: TabNavigationProps) {
  return (
    <div className="flex mb-4">
      <button
        className={`flex-1 py-2 text-center ${
          activeTab === "login" ? "font-bold" : "text-gray-500"
        }`}
        onClick={() => setActiveTab("login")}
      >
        Login
      </button>
      <button
        className={`flex-1 py-2 text-center ${
          activeTab === "register" ? "font-bold" : "text-gray-500"
        }`}
        onClick={() => setActiveTab("register")}
      >
        Register
      </button>
      {/* <button
        className={`flex-1 py-2 text-center ${
          activeTab === "recovery" ? "font-bold" : "text-gray-500"
        }`}
        onClick={() => setActiveTab("recovery")}
      >
        Forgot Password?
      </button> */}
    </div>
  );
}
