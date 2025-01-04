import { Feed } from "./feed.jsx";
import { Header } from "./header.jsx";
import m from "mithril";

function doSearch() {
    let query = document.getElementById("search_query").value;
    m.request({
        method: "GET",
        url: "/ytod/api/search",
        params: { q: query },
    }).then(function (data) {
        Search.result = data;
    });
}

export let Search = {
    result: {
        title: "",
        items: [],
    },

    view: function () {
        return <div>
            <Header />
            <input type="search" id="search_query" /><button class="btn--primary" onclick={doSearch}>Search</button>
            <Feed feed={Search.result} />
        </div>;
    }

};
