export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20 bg-gradient-to-br from-pink-100 via-orange-50 to-yellow-100 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-pink-200 rounded-full opacity-40 blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-yellow-200 rounded-full opacity-30 blur-3xl"></div>

      <div className="relative z-10 text-center max-w-4xl">
        <div className="mb-6">
          <span className="text-7xl">🎉</span>
        </div>
        
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-pink-600 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
          Happy Birthday
          <br />
          Chimwemwe!
        </h1>
        
        <p className="text-xl sm:text-2xl md:text-3xl text-pink-600 font-semibold mb-6">
          &quot;Happiness Personified&quot;
        </p>
        
        <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed mb-8">
          Today we celebrate not just a birthday, but the embodiment of joy, kindness, and warmth. 
          Chimwemwe—meaning happiness in Chichewa—is a name that perfectly captures the light you bring into the world.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full px-4 sm:px-0">
          <a 
            href="#gallery" 
            className="px-6 sm:px-8 py-3 bg-gradient-to-r from-pink-500 to-orange-400 text-white rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all w-full sm:w-auto text-center"
          >
            View Photos
          </a>
          <a 
            href="/wishes" 
            className="px-6 sm:px-8 py-3 bg-white border-2 border-pink-500 text-pink-600 rounded-full font-semibold hover:bg-pink-50 transform hover:scale-105 transition-all w-full sm:w-auto text-center"
          >
            Birthday Wishes
          </a>
        </div>
      </div>
    </section>
  )
}
