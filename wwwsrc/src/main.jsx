import { Notifications } from "./components/notifications";
import { Header } from "./ui/header";

export const Main = {
  view: function (vnode) {
    return (
      <div>
        <Header />
        {vnode.children}
        <Notifications />
      </div>
    );
  }
}