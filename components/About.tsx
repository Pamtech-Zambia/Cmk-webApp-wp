export default function About() {
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-transparent">
              The Meaning of Chimwemwe
            </h2>
            
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              <span className="font-bold text-pink-600">Chimwemwe</span> is a beautiful Chichewa name that means <span className="font-bold">"Happiness"</span> or <span className="font-bold">"Joy"</span>. It perfectly encapsulates the spirit of the person who bears it.
            </p>
            
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              True to her name, Chimwemwe brings light, laughter, and warmth wherever she goes. Her kindness knows no bounds, and her genuine care for others makes everyone around her feel valued and loved.
            </p>
            
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              On this special day, we celebrate not only her birthday but also the incredible person she is—someone whose goodness, strength, and compassion inspire all of us.
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">💛</span>
                <span className="text-gray-700">A heart full of generosity</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎂</span>
                <span className="text-gray-700">Passion for baking and creating joy</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">✨</span>
                <span className="text-gray-700">A spirit that shines with authenticity</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🌟</span>
                <span className="text-gray-700">Strength that uplifts others</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-orange-300 rounded-3xl blur-2xl opacity-50"></div>
              <div className="relative bg-white rounded-3xl p-8 shadow-xl">
                <div className="text-6xl text-center mb-4">🎉</div>
                <p className="text-center text-2xl font-bold text-pink-600 mb-2">April 25th</p>
                <p className="text-center text-gray-600 text-lg">A day to celebrate</p>
                <p className="text-center text-gray-600 text-lg">your beautiful spirit</p>
                
                <div className="mt-6 pt-6 border-t border-pink-200">
                  <p className="text-center text-sm text-gray-600 italic">
                    Thank you for being the embodiment of your name—bringing happiness wherever you go.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
