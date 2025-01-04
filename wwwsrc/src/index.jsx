import m from "mithril";
import { Feed } from "./feed.jsx";
import { Header } from "./header.jsx";

export let Index = {
    feeds: [],

    view: function () {
        allFeeds = [];
        for (let feed in Index.feeds) {
            allFeeds.push(<Feed feed={Index.feeds[feed]}/>);
        }

        return <div>
            <Header />
            {allFeeds}
        </div>;
    },

    updateFeed: function () {
        m.request({
            method: "GET",
            url: "/ytod/api/feeds",
        }).then((res) => {
            Index.feeds = res;
        });
    }
};
