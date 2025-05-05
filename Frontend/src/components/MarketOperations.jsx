import React from 'react';

const MarketOperations = () => {
  return (
    <section className="bg-white px-6 py-12 md:px-16 lg:px-32">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Text Content */}
        <div>
          <h2 className="text-4xl font-extrabold text-green-800 mb-4">Market Operations</h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-8 whitespace-pre-line text-justify">
            The Dambulla Dedicated Economic Center operates under a shop rental system, where selected and qualified entrepreneurs are allocated stalls on a monthly rental basis. The rental income collected from these shop owners is used to establish a management trust fund, which supports the maintenance and all development activities of the center.
          </p>
          <p className="text-gray-600 text-lg leading-relaxed mb-8 whitespace-pre-line text-justify">
            Farmers and traders are directly involved in the market operations, and the stall owners act as intermediaries, facilitating transactions between both parties. For this service, stall owners charge a commission fee.
          </p>
          <p className="text-gray-600 text-lg leading-relaxed mb-8 whitespace-pre-line text-justify">
            This market is known for having the lowest commission rates in Sri Lanka, which is one of the main reasons for the popularity of this system.
          </p>
          <p className="text-gray-600 text-lg leading-relaxed mb-8 whitespace-pre-line text-justify">
            The Dambulla Dedicated Economic Center functions as a day-and-night market, which is why Dambulla is popularly known as a "city that never sleeps." Currently, market activities take place from 5:00 AM to 12:00 midnight.
          </p>
        </div>

        {/* Image */}
        <div className="w-full flex justify-center">
          <img
            src="/images/market.jpeg"
            alt="Market operations"
            className="rounded-2xl shadow-lg w-full max-w-sm md:max-w-md lg:max-w-lg object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default MarketOperations;
