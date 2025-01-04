import m from "mithril";
import { isSubscribed, updateUserInfo } from "./globals.js";

function getDownloadCb(item) {
    return (function (video_id) { 
        return function () {
            m.request({
                method: "POST",
                url: "/ytod/api/download",
                body: {
                    video_id: video_id,
                },
            }).then((res) => {
                alert(JSON.stringify(res));
            });
        };
    })(item.video_id);
}

function getWatchCb(item) {
    return (function (watch) { 
        return function () {
            m.route.set("/watch/:videoid", { "videoid": watch });
        };
    })(item.watch);
}

function getSubscribeCb(item, isSubscribe) {
    return (function (chan_id, method) { 
        return function () {
            m.request({
                method: "GET",
                url: `/ytod/api/${method}`,
                params: {
                    channel_id: chan_id,
                },
            }).then(() => {
                updateUserInfo();
            });
        };
    })(item.channel_id, isSubscribe? "subscribe": "unsubscribe");


}

export let Item = {
    last_id: 0,

    view: function (vnode) {
        let item = vnode.attrs.item;
        console.log(item);

        if (!item) {
            return <div class="invalid_item">Invalid use of Item</div>;
        }

        let thumbnail = item.thumbnail? <img style="width:auto" src={item.thumbnail.url} width={item.thumbnail.width} height={item.thumbnail.height} /> : <span />;
        let video = item.watch? <button class="btn--green" onclick={getWatchCb(item)}>Watch</button>: <button class="btn--yellow" onclick={getDownloadCb(item)}>Download</button>;
        let description = <span />;
        let subscribe;
        if (!isSubscribed(item.channel_id)) {
            subscribe = <button class="btn--blue" onclick={getSubscribeCb(item, true)}>Subscribe</button>;
        } else {
            subscribe = <button class="btn--red" onclick={getSubscribeCb(item, true)}>Unsubscribe</button>;
        }

        if (item.description) {
            let id = Item.last_id++;
            description = <div class="collapsible-wrap card no-pad">
                <input type="checkbox" id={`item-collapsible-${id}`} />
                <label for={`item-collapsible-${id}`}>Description</label>
                <div class={`item-collapsible-${id}-area`}>
                    <p>{item.description}</p>
                </div>
            </div>;
        }

        return <div class="card g--6" style="margin-bottom: 1em">
            <h3>{item.title}</h3>
            {thumbnail}<br />
                    <a href={item.link}>Watch on YouTube</a><br />
                    Channel: {item.channel}
                    {subscribe}
                    {video}
                    {description}
        </div>;
    }
};
