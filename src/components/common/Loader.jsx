import React from 'react';

export default function Loader({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="w-10 h-10 border-4 border-[#CBDCEB] border-t-[#6D94C5] rounded-full animate-spin" />
      <p className="text-sm text-[#6D94C5] font-medium">{text}</p>
    </div>
  );
}