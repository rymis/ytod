import { Header } from "./header.jsx";

export let Watch = {
    view: function(vnode) {
        return <div>
            <Header />
            <video controls>
                <source src={`/ytod/api/video/${vnode.attrs.videoid}`} />
            </video>
        </div>;
    }
};
