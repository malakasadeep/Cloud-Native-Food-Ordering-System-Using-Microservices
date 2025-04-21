import React from 'react';

const MainMap = () => {
  return (
    <div className="w-full h-full rounded-lg overflow-hidden shadow-lg relative">
      <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
        <p className="text-gray-500">Loading Map...</p>
      </div>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126743.63162573964!2d79.8023851!3d6.9218374!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae253d10f7a7003%3A0x320b2e4d32d3838d!2sColombo!5e0!3m2!1sen!2slk!4v1652204824114!5m2!1sen!2slk"
        className="w-full h-full border-0"
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
};

export default MainMap;
