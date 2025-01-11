import { Alert } from "./alert";
import m from 'mithril';

function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const notificationsState = {
  items: [],
  removeNotification: function (key) {
    const index = notificationsState.items.find(i => i.key === key);
    notificationsState.items.splice(index, 1);
  }
};

export function addNotification(text, type) {
  const key = guid();
  notificationsState.items.push({ key, text, type });
};

export const Notifications = {
  view: function (vnode) {
    return (
      <div class="flex flex-col gap-2 fixed bottom-5 right-5 w-[20rem]">
        {notificationsState.items.map(notification => {
          const { key, text, type } = notification;
          return <Notification key={key} text={text} type={type} timeout={vnode.attrs.timeout} />;
        })}
      </div>
    )
  }
};

export const Notification = {
  oninit: function (vnode) {
    const { key, timeout = 5000 } = vnode.attrs;
    setTimeout(() => {
      notificationsState.removeNotification(key);
      m.redraw();
    }, timeout);
  },
  view: function (vnode) {
    const { text, type } = vnode.attrs;
    return (
      <Alert class="w-full" text={text} type={type} />
    );
  }
};