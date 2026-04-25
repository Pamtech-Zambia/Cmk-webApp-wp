export default function Timeline() {
  const memories = [
    {
      year: '2024',
      title: 'Master Baker',
      description: 'Started her incredible baking business, creating delicious treats that bring joy to so many.',
      icon: '🎂',
    },
    {
      year: '2023',
      title: 'Community Champion',
      description: 'Made a significant impact in the community with her kindness and generous spirit.',
      icon: '❤️',
    },
    {
      year: '2022',
      title: 'Year of Growth',
      description: 'Overcame challenges and emerged stronger, inspiring everyone around her.',
      icon: '🌟',
    },
    {
      year: '2021',
      title: 'Living True to Her Name',
      description: 'Became the beacon of happiness and light that defines Chimwemwe.',
      icon: '💛',
    },
  ]

  return (
    <section className="py-16 px-4 bg-gradient-to-r from-orange-50 via-pink-50 to-purple-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-transparent">
          Memory Timeline
        </h2>
        <p className="text-center text-gray-600 mb-12 text-lg">
          Celebrating milestones and moments that define her
        </p>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-pink-300 to-orange-300 hidden md:block"></div>

          <div className="space-y-8 md:space-y-12">
            {memories.map((memory, index) => (
              <div
                key={memory.year}
                className={`flex flex-col ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                } gap-6 md:gap-12 items-center`}
              >
                {/* Content */}
                <div className="flex-1 md:text-right md:even:text-left">
                  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                    <p className="text-sm font-bold text-pink-600 uppercase tracking-widest mb-2">
                      {memory.year}
                    </p>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {memory.title}
                    </h3>
                    <p className="text-gray-600 text-base leading-relaxed">
                      {memory.description}
                    </p>
                  </div>
                </div>

                {/* Timeline dot */}
                <div className="flex justify-center md:relative md:w-auto">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-orange-300 rounded-full flex items-center justify-center text-3xl shadow-lg z-10 flex-shrink-0">
                    {memory.icon}
                  </div>
                </div>

                {/* Empty space for alignment */}
                <div className="flex-1 hidden md:block"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
