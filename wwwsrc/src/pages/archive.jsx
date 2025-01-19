import { Feed } from "../ui/feed.jsx";
import m from "mithril";

export var Archive = {
    data: {
        title: "Archive",
        items: [],
    },

    view: function () {
        return <Feed class="p-5" feed={Archive.data} />;
    },

    update: function () {
        m.request({
            method: "GET",
            url: "/ytod/api/local_videos",
        }).then(function (data) {
            Archive.data.items = data.result;
        });
    }
};
