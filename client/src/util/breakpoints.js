const SM = '640px';
const MD = '768px';
const LG = '1024px';
const XL = '1280px';
const XXL = '1536px';

const breakpoints = {
      'sm': SM,
      // => @media (min-width: 640px) { ... }
      'md': MD,
      // => @media (min-width: 768px) { ... }
      'lg': LG,
      // => @media (min-width: 1024px) { ... }
      'xl': XL,
      // => @media (min-width: 1280px) { ... }
      '2xl': XXL,
};

module.exports.SM = SM
module.exports.MD = MD
module.exports.LG = LG;
module.exports.XL = XL;
module.exports.XXL = XXL;

module.exports.breakpoints = breakpoints;