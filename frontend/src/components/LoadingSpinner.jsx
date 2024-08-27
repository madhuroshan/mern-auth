import { Loader } from "lucide-react";
import React from "react";

const LoadingSpinner = () => {
  return (
    <div
      className="min-h-screen bg-gradient-to-br
from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden"
    >
      <Loader className="size-32 text-white animate-spin" />
    </div>
  );
};

export default LoadingSpinner;
