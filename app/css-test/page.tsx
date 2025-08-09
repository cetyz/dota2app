'use client';

export default function CSSTestPage() {
  return (
    <div className="min-h-screen bg-background text-textLight p-8">
      <h1 className="text-3xl font-bold mb-8 text-accentPrimary">CSS & Tailwind Test</h1>
      
      <div className="space-y-6">
        {/* Basic Tailwind classes */}
        <div className="bg-red-500 w-32 h-16 flex items-center justify-center text-white">
          Red Background
        </div>

        {/* Hover effects test */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Hover Effects Test:</h2>
          
          <div className="bg-blue-500 hover:bg-blue-300 w-40 h-12 flex items-center justify-center text-white cursor-pointer transition-colors duration-300">
            Hover Color Change
          </div>
          
          <div className="bg-green-500 hover:scale-110 w-40 h-12 flex items-center justify-center text-white cursor-pointer transition-transform duration-300">
            Hover Scale
          </div>
          
          <div className="bg-purple-500 hover:shadow-lg w-40 h-12 flex items-center justify-center text-white cursor-pointer transition-shadow duration-300">
            Hover Shadow
          </div>

          <div className="bg-yellow-500 hover:bg-yellow-300 hover:scale-105 hover:shadow-md w-40 h-12 flex items-center justify-center text-black cursor-pointer transition-all duration-300">
            Combined Effects
          </div>
        </div>

        {/* Custom color test */}
        <div className="bg-accentPrimary text-textLight p-4 rounded">
          Custom colors from Tailwind config
        </div>

        {/* CSS-only hover test */}
        <div 
          className="w-40 h-12 flex items-center justify-center cursor-pointer"
          style={{
            backgroundColor: 'orange',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'darkorange';
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'orange';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          Inline CSS Hover
        </div>
      </div>
    </div>
  );
}