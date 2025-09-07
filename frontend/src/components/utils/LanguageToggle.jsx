import React from 'react';

const LanguageToggle = ({ currentLanguage, onPress }) => {
return (
 <button
 className="absolute top-5 right-5 bg-white py-2.5 px-4 rounded-full shadow-md hover:bg-gray-100 transition-colors z-50"
 onClick={onPress}
 >
 <span className="text-base font-bold text-black">
 {currentLanguage === "en" ? "தமிழ்" : "English"}
</span>
</button>
);
};

export default LanguageToggle;
