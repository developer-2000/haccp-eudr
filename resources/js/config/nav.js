const navConfig = {
    logo: {
        link: "/",
    },
    menu: [
        {
            label: "header.menu.how_it_works",
            link: "/how-it-works",
            hasDropdown: false,
        },
        {
            label: "header.menu.demo",
            link: "/demo/dashboard",
            activePathPrefix: "/demo",
            hasDropdown: false,
        },
        {
            label: "header.menu.about",
            link: "/about",
            hasDropdown: false,
        },
        {
            label: "header.menu.survey",
            link: "/survey",
            hasDropdown: false,
        },
    ],
};

export default navConfig;
