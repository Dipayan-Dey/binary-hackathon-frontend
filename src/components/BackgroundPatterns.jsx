import React from 'react';

// Mesh Gradient Background
export const MeshGradient = ({ className = '' }) => (
  <div className={`absolute inset-0 overflow-hidden ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 opacity-50"></div>
    <div className="absolute top-0 left-0 w-full h-full">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
    </div>
  </div>
);

// Dot Pattern Background
export const DotPattern = ({ className = '' }) => (
  <div className={`absolute inset-0 ${className}`}>
    <div className="absolute inset-0" style={{
      backgroundImage: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 1px, transparent 1px)',
      backgroundSize: '30px 30px'
    }}></div>
  </div>
);

// Grid Pattern Background
export const GridPattern = ({ className = '' }) => (
  <div className={`absolute inset-0 ${className}`}>
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f1a_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f1a_1px,transparent_1px)] bg-[size:40px_40px]"></div>
  </div>
);

// Wave Pattern Background
export const WavePattern = ({ className = '' }) => (
  <div className={`absolute inset-0 overflow-hidden ${className}`}>
    <svg className="absolute bottom-0 w-full h-64" viewBox="0 0 1440 320" preserveAspectRatio="none">
      <path 
        fill="rgba(59, 130, 246, 0.1)" 
        fillOpacity="1" 
        d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,144C960,149,1056,139,1152,128C1248,117,1344,107,1392,101.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
      ></path>
    </svg>
    <svg className="absolute bottom-0 w-full h-64" viewBox="0 0 1440 320" preserveAspectRatio="none">
      <path 
        fill="rgba(139, 92, 246, 0.1)" 
        fillOpacity="1" 
        d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,208C672,213,768,203,864,186.7C960,171,1056,149,1152,154.7C1248,160,1344,192,1392,208L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
      ></path>
    </svg>
  </div>
);

// Hexagon Pattern Background
export const HexagonPattern = ({ className = '' }) => (
  <div className={`absolute inset-0 ${className}`}>
    <div className="absolute inset-0 opacity-10" style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill='none' stroke='%233b82f6' stroke-width='1'/%3E%3C/svg%3E")`,
      backgroundSize: '60px 60px'
    }}></div>
  </div>
);

// Circuit Pattern Background
export const CircuitPattern = ({ className = '' }) => (
  <div className={`absolute inset-0 ${className}`}>
    <div className="absolute inset-0 opacity-5" style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 50h20M80 50h20M50 0v20M50 80v20M20 20h10v10h-10zM70 20h10v10h-10zM20 70h10v10h-10zM70 70h10v10h-10z' stroke='%233b82f6' fill='none' stroke-width='1'/%3E%3Ccircle cx='50' cy='50' r='5' fill='%233b82f6'/%3E%3C/svg%3E")`,
      backgroundSize: '100px 100px'
    }}></div>
  </div>
);

// Topography Pattern Background
export const TopographyPattern = ({ className = '' }) => (
  <div className={`absolute inset-0 ${className}`}>
    <div className="absolute inset-0 opacity-10" style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 50 Q25 25, 50 50 T100 50' stroke='%233b82f6' fill='none'/%3E%3Cpath d='M0 60 Q25 35, 50 60 T100 60' stroke='%238b5cf6' fill='none'/%3E%3Cpath d='M0 70 Q25 45, 50 70 T100 70' stroke='%23ec4899' fill='none'/%3E%3C/svg%3E")`,
      backgroundSize: '100px 100px'
    }}></div>
  </div>
);

export default {
  MeshGradient,
  DotPattern,
  GridPattern,
  WavePattern,
  HexagonPattern,
  CircuitPattern,
  TopographyPattern
};
