'use client';

export default function TailwindCheckPage() {
  return (
    <div className="min-h-screen bg-background text-textLight p-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-accentPrimary">
        Tailwind CSS Status Check
      </h1>
      
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Status indicators */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-green-400">✅ Working if you see:</h2>
            <ul className="space-y-2 text-sm">
              <li>• Dark background (#121315)</li>
              <li>• Light text (#d1d1c6)</li>
              <li>• Orange heading (#ad3f21)</li>
              <li>• Rounded corners on boxes</li>
              <li>• Hover effects working below</li>
            </ul>
          </div>
          
          <div className="bg-red-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-red-300">❌ NOT working if you see:</h2>
            <ul className="space-y-2 text-sm">
              <li>• White background</li>
              <li>• Black text</li>
              <li>• No styling/rounded corners</li>
              <li>• No hover effects</li>
              <li>• Default browser fonts</li>
            </ul>
          </div>
        </div>

        {/* Color palette test */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Custom Color Palette Test</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-background border-2 border-white p-4 text-center rounded">
              <div className="text-xs">bg-background</div>
              <div className="text-xs text-gray-400">#121315</div>
            </div>
            <div className="bg-accentPrimary p-4 text-center rounded text-white">
              <div className="text-xs">bg-accentPrimary</div>
              <div className="text-xs">#ad3f21</div>
            </div>
            <div className="bg-black p-4 text-center rounded text-white">
              <div className="text-xs">bg-black</div>
              <div className="text-xs">#000000</div>
            </div>
            <div className="bg-gray-800 p-4 text-center rounded">
              <div className="text-xs text-textLight">text-textLight</div>
              <div className="text-xs text-gray-400">#d1d1c6</div>
            </div>
            <div className="bg-gray-700 p-4 text-center rounded">
              <div className="text-xs text-textSecondary">text-textSecondary</div>
              <div className="text-xs text-gray-400">#cecece</div>
            </div>
          </div>
        </div>

        {/* Hover effects test */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Hover Effects Test</h2>
          <div className="grid md:grid-cols-4 gap-4">
            
            <div className="bg-blue-500 hover:bg-blue-400 p-4 text-center rounded cursor-pointer transition-colors duration-300">
              <div className="text-white font-medium">Color Change</div>
              <div className="text-blue-100 text-xs">hover:bg-blue-400</div>
            </div>
            
            <div className="bg-green-500 hover:scale-110 p-4 text-center rounded cursor-pointer transition-transform duration-300">
              <div className="text-white font-medium">Scale</div>
              <div className="text-green-100 text-xs">hover:scale-110</div>
            </div>
            
            <div className="bg-purple-500 hover:shadow-xl hover:shadow-purple-500/50 p-4 text-center rounded cursor-pointer transition-shadow duration-300">
              <div className="text-white font-medium">Shadow</div>
              <div className="text-purple-100 text-xs">hover:shadow-xl</div>
            </div>
            
            <div className="bg-yellow-500 hover:bg-yellow-400 hover:scale-105 hover:shadow-lg p-4 text-center rounded cursor-pointer transition-all duration-300">
              <div className="text-yellow-900 font-medium">Combined</div>
              <div className="text-yellow-700 text-xs">Multiple effects</div>
            </div>
          </div>
        </div>

        {/* Layout test */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Layout & Spacing Test</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
              Flex
            </div>
            <div className="w-16 h-16 bg-orange-500 rounded-lg flex items-center justify-center text-white text-xs">
              Grid
            </div>
            <div className="w-16 h-16 bg-yellow-500 rounded flex items-center justify-center text-black text-xs">
              Space
            </div>
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
              Size
            </div>
          </div>
        </div>

        {/* Status summary */}
        <div className="bg-gray-800 border-l-4 border-accentPrimary p-6 rounded">
          <h2 className="text-xl font-semibold mb-2">Diagnosis:</h2>
          <p className="text-textSecondary">
            If you can see all the colors, hover effects work, and the layout looks good, 
            then <span className="text-green-400 font-semibold">Tailwind CSS is working perfectly!</span>
          </p>
          <p className="text-textSecondary mt-2">
            If this page looks styled but other pages don't, it means Tailwind is working 
            but there might be component-specific issues.
          </p>
        </div>
      </div>
    </div>
  );
}