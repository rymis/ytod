import m from "mithril";
import { isSubscribed, updateUserInfo } from "./globals.js";
import { Button } from "./components/button.jsx";
import { Modal } from "./components/modal.jsx";
import { addNotification } from "./components/notifications.jsx";

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
                addNotification('Video was successfully queued', 'success')
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
    })(item.channel_id, isSubscribe ? "subscribe" : "unsubscribe");
}

function showDescription(e) {
    e.preventDefault();
    Item.Modal.show(); 
}

export let Item = {
    last_id: 0,
    descriptionOpen: false,

    view: function (vnode) {
        let item = vnode.attrs.item;

        if (!item) {
            return <div class="invalid_item">Invalid use of Item</div>;
        }

        let thumbnail = item.thumbnail ? <img class="rounded-lg" src={item.thumbnail.url} width={item.thumbnail.width} height={item.thumbnail.height} /> : <span />;
        let video = item.watch ?
            <Button color="green" size="xs" onClick={getWatchCb(item)} name="Watch" /> :
            <Button color="yellow" size="xs" onClick={getDownloadCb(item)} name="Download" />;
        let description = <span />;
        let subscribe;
        if (!isSubscribed(item.channel_id)) {
            subscribe = <Button color="blue" size="xs" onClick={getSubscribeCb(item, true)} name="Subscribe" />;
        } else {
            subscribe = <Button color="red" size="xs" onClick={getSubscribeCb(item, false)} name="Unsubscribe" />;
        }

        if (item.description) {
            let id = Item.last_id++;
            description =
                <div class="">
                    <input type="checkbox" id={`item-collapsible-${id}`} />
                    <label for={`item-collapsible-${id}`}>Description</label>
                    <div class={`item-collapsible-${id}-area`}>
                        <div class="hidden">{item.description}</div>
                    </div>
                </div>;
        }
        return (
            <div class="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                {thumbnail}
                <div class="font-bold text-gray-600 pb-2">{item.title}</div>
                <a class="underline underline-offset-1 italic" href={item.link}>Watch on YouTube</a><br />
                <span class="text-gray-800 font-semibold text-sm">Channel </span>
                <span class="text-gray-600 uppercase">{item.channel}</span>
                <div class="pt-3 flex gap-2">
                    {subscribe}
                    {video}
                </div>
                <Modal header="Description" content={description} modalId="description-modal" open={this.descriptionOpen} />
            </div >
        );
    }
};
