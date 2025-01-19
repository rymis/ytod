import m from "mithril";
import { isSubscribed, updateUserInfo } from "../globals.js";
import { Button } from "../components/button.jsx";
import { Modal, showModal } from "../components/modal.jsx";
import { guid } from "../utils/service.js";
import { addNotification } from "../components/notifications.jsx";
import { getTimeSpanText } from "../utils/datetime.js";

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

export let Item = {
    id: guid(),
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
        let subscribe;
        if (!isSubscribed(item.channel_id)) {
            subscribe = <Button color="blue" size="xs" onClick={getSubscribeCb(item, true)} name="Subscribe" />;
        } else {
            subscribe = <Button color="red" size="xs" onClick={getSubscribeCb(item, false)} name="Unsubscribe" />;
        }
        const modalId = `description-modal-${this.id}`;
        return (
            <div
                class="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
            >
                {thumbnail}
                <div class="flex justify-between">
                    <span class="font-bold text-gray-600">{item.title}</span>
                    {item.description && <button class="w-4 h-4 shrink-0 self-center" type="button" onclick={showModal(modalId)}>
                        <img src="info.svg" />
                    </button>}
                </div>
                <a class="underline underline-offset-1 italic" href={item.link}>Watch on YouTube</a><br />
                <span class="text-gray-800 font-semibold text-sm">Channel </span>
                <span class="text-gray-600 uppercase">{item.channel}</span>
                <div class="pt-3 flex gap-2">
                    {subscribe}
                    {video}
                </div>
                <div class="text-gray-500 text-sm">{getTimeSpanText(item.time)}</div>
                <Modal
                    name="description"
                    header={item.channel}
                    content={item.description}
                    modalId={modalId}
                    class="max-h-[80%] w-[80%] md:w-2/3 lg:w-1/2"
                >
                    <div class="px-3 py-2">
                        <h4 class="font-semibold text-gray-700 dark:text-white pb-3">{item.title}</h4>
                        <p>
                            {item.description}
                        </p>
                    </div>
                </Modal>
            </div >
        );
    }
};
