import m from "mithril";
import { Index } from "./index.jsx";
import { Watch } from "./watch.jsx";
import { Search } from "./search.jsx";
import { updateUserInfo } from "./globals.js";
import { Archive } from "./archive.jsx";

window.mCreateElement = m;
window.mFragment = { view: vnode => vnode.children };

window.onload = function () {
    updateUserInfo();
    Archive.update();

    m.route(document.body, "/index", {
        "/index": Index,
        "/watch/:videoid": Watch,
        "/search": Search,
        "/archive": Archive,
    });

    Index.updateFeed();
};
