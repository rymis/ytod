import { Feed } from "../ui/feed.jsx";
import { SearchInput } from "../components/searchInput.jsx";
import m from "mithril";

function doSearch() {
    const query = document.getElementById("search_query").value;
    Search.loading = true;
    m.request({
        method: "GET",
        url: "/ytod/api/search",
        params: { q: query },
    }).then(function (data) {
        Search.result = data;
        Search.loading = false;
    });
}

export let Search = {
    result: {
        title: "",
        items: [],
    },
    loading: false,

    view: function (vnode) {
        return (
            <div class="p-6">
                <SearchInput id="search_query" onSearch={doSearch} />
                <div>
                    <div class={this.loading ? null : "hidden"}>Loading...</div>
                    <div class={!this.loading ? null : "hidden"}>
                        <Feed feed={Search.result} />
                    </div>
                </div>
            </div>
        );
    }

};
