import siteConfig from "./site.js";

const navConfig = {
    logo: {
        text: siteConfig.name,
        link: "/",
    },
    menu: [
        {
            label: "messages.nav.menu.how_it_works",
            link: "/how-it-works",
            hasDropdown: false,
        },
        {
            label: "messages.nav.menu.demo",
            link: "/demo/dashboard",
            activePathPrefix: "/demo",
            hasDropdown: false,
        },
        {
            label: "messages.nav.menu.survey",
            link: "/survey",
            hasDropdown: false,
        },
    ],
};

export default navConfig;
