import { Header } from "./header.jsx";
import { Feed } from "./feed.jsx";
import m from "mithril";

export var Archive = {
    data: {
        title: "Archive",
        items: [],
    },

    view: function () {
        console.log(Archive.data);
        return <div>
            <Header />
            <Feed feed={Archive.data} />
        </div>;
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
