import m from "mithril";
import { Feeds } from "./feeds.jsx";
import { Watch } from "./watch.jsx";
import { Search } from "./search.jsx";
import { updateUserInfo } from "./globals.js";
import { Archive } from "./archive.jsx";

window.mCreateElement = m;
window.mFragment = { view: vnode => vnode.children };

export const pages = {
    feed: 'index',
    watch: 'watch',
    search: 'search',
    archive: 'archive',
};

window.onload = function () {
    updateUserInfo();
    Archive.update();

    m.route(document.body, "/index", {
        "/index": Feeds,
        "/watch/:videoid": Watch,
        "/search": Search,
        "/archive": Archive,
    });

    Feeds.updateFeed();
};
