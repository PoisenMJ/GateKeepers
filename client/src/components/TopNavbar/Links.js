export const Home = {
  authenticated: [
    {
      text: "HOME",
      link: "/home"
    },
    [ "GATEKEEPERS",
      {
        text: "maksie_aki",
        link: "/shop/maksie_aki"
      }
    ],
    {
      text: "ABOUT",
      link: "/about"
    },
    {
      text: "PROFILE",
      link: "/profile"
    },
    {
      text: "LOG-OUT",
      link: "/logout"
    },
    
  ],
  unauthenticated: [
    {
      text: "HOME",
      link: "/home"
    },
    [ "GATEKEEPERS",
      {
        text: "maksie_aki",
        link: "/maksie_aki/shop"
      }
    ],
    {
      text: "ABOUT",
      link: "/about"
    },
    {
      text: "LOGIN",
      link: "/login"
    },
  ]
};

export const Shop = {
  authenticated: [
    {
      text: "HOME",
      link: '../../home'
    },
    {
      text: "SHOP",
      link: `shop`
    },
    {
      text: "CUSTOM",
      link: `custom`
    },
    {
      text: "LOG-OUT",
      link: "logout"
    }
  ],
  unauthenticated: [
    {
      text: "HOME",
      link: '../../home'
    },
    {
      text: "SHOP",
      link: `shop`
    },
    {
      text: "CUSTOM",
      link: `custom`
    },
    {
      text: "LOGIN",
      link: "login"
    }
  ]
};