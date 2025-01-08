import { Header } from "./header.jsx";

export let Watch = {
    view: function (vnode) {
        return <div>
            <Header />
            <div class="p-6 flex justify-center">
                <video controls>
                    <source src={`/ytod/api/video/${vnode.attrs.videoid}`} />
                </video>
            </div>
        </div>;
    }
};
