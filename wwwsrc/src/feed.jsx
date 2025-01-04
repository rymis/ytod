import { Item } from "./item.jsx";

export let Feed = {
    view: function (vnode) {
        let data = vnode.attrs.feed || { items: [], title: "" };

        let items = [];

        items.push(<div class="g--12 g-m--12"><h2>{data.title}</h2></div>);

        for (let item of data.items) {
            items.push(<Item item={item}></Item>);
        }

        return <div class="container-wrap" style="width: 1024px">{items}</div>;
    }
};
