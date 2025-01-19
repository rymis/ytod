import { Item } from "./item.jsx";

export let Feed = {
    view: function (vnode) {
        let data = vnode.attrs.feed || { items: [], title: "" };

        let items = [];

        for (let item of data.items) {
            items.push(<Item item={item}></Item>);
        }

        return (
            <div class={vnode.attrs.class}>
                <div class="py-4 text-center text-gray-800 text-lg">{data.title}</div>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">{items}</div>
            </div>
        );
    }
};
