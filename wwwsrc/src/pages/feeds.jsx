import m from "mithril";
import { Item } from "../ui/item.jsx";
import { Filter } from "../ui/filter.jsx";

export let Feeds = {
    feeds: [],

    view: function () {
        allItems = [];
        for (let feedName in Feeds.feeds) {
            const feed = Feeds.feeds[feedName];
            allItems.push(...feed.items);
        }

        allItems.sort((i1, i2) => i2.time - i1.time);
        return (
            <div>
                <Filter feeds={Feeds.feeds} />
                <div class="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {allItems.map(item => <Item item={item}></Item>)}
                </div>
            </div>
        );
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
