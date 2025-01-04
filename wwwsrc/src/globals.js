import m from "mithril";

export var UserInfo = {
    user: "unknown",
    lang: "en",
    feeds: [],
};

export function updateUserInfo() {
    m.request({
        method: "GET",
        url: "/ytod/api/user_info",
    }).then(function (data) {
        UserInfo = data;
    });
}

export function isSubscribed(feed) {
    for (var f of UserInfo.feeds) {
        if (f === feed) {
            return true;
        }
    }
    return false;
}
