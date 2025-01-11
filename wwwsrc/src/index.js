import m from "mithril";
import { messages } from "./messages.js";
import { Main } from "./main.jsx";
import { Feeds } from "./feeds.jsx";
import { Watch } from "./watch.jsx";
import { Search } from "./search.jsx";
import { updateUserInfo } from "./globals.js";
import { Archive } from "./archive.jsx";

window.mCreateElement = m;
window.mFragment = { view: vnode => vnode.children };

window.t = function (s) {
    if (window._ytodLang) {
        if (window._ytodLang.hasOwnProperty(s)) {
            return window._ytodLang[s];
        }
    }

    return s;
};

export const pages = {
    feed: 'index',
    watch: 'watch',
    search: 'search',
    archive: 'archive',
};

const routeUpdaters = {
    "index": () => Feeds.updateFeed(),
    "archive": () => Archive.update(),
}

function render(component) {
    return {
        view: function (vnode) {
            const route = m.route.get();
            if (route !== render.lastRoute && routeUpdaters.hasOwnProperty(route)) {
                routeUpdaters[route]();
            }
            render.lastRoute = route;

            return m(Main, m(component, vnode.attrs));
        }
    }
}
render.lastRoute = "index";

window.onload = function () {
    updateUserInfo();
    Archive.update();

    const lang = navigator.language || navigator.userLanguage;
    if (lang.length > 2) {
        const lang2 = lang.substr(0, 2);
        const msgs = messages[lang2];
        if (typeof(msgs) !== "undefined") {
            window._ytodLang = msgs;
        }
    }

    m.route(document.body, "/index", {
        "/index": render(Feeds),
        "/watch/:videoid": render(Watch),
        "/search": render(Search),
        "/archive": render(Archive),
    });

    Feeds.updateFeed();
};
