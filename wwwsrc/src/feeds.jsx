import m from "mithril";
import { Feed } from "./feed.jsx";
import { Header } from "./header.jsx";
import { Notifications } from "./components/notifications.jsx";

export let Feeds = {
    feeds: [],

    view: function () {
        allFeeds = [];
        for (let feed in Feeds.feeds) {
            allFeeds.push(<Feed feed={Feeds.feeds[feed]} />);
        }

        return (<div class="p-5">{allFeeds}</div>);
    },

    updateFeed: function () {
        m.request({
            method: "GET",
            url: "/ytod/api/feeds",
        }).then((res) => {
            Feeds.feeds = res;
        });
    }
};
