import { NavItem } from "./components/navItem";
import { pages } from ".";
import m from 'mithril';

export var Header = {
    view: function () {
        const path = m.route.get();
        return (
            <header class="w-full h-16 bg-gray-50 border-b border-gray-200 dark:bg-gray-700 dark:border-gray-600">
                <div class="grid h-full max-w-lg grid-cols-4 mx-auto font-medium">
                    <NavItem path="#/index" name="Feeds" selected={path === pages.feed} />
                    <NavItem path="#/search" name="Search" selected={path === pages.search} />
                    <NavItem path="#/archive" name="Archive" selected={path === pages.archive} />
                </div>
            </header>
        );
    }

};
