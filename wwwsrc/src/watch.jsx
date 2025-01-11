export let Watch = {
    view: function (vnode) {
        return (
            <div class="p-6 flex justify-center">
                <video controls>
                    <source src={`/ytod/api/video/${vnode.attrs.videoid}`} />
                </video>
            </div>
        );
    }
};
