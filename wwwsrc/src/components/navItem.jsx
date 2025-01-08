import clsx from "clsx";

export const NavItem = {
  view: function (vnode) {
    const c = clsx(
      'text-lg group-hover:text-blue-600 dark:group-hover:text-blue-500',
      {
        'text-gray-500 dark:text-gray-400': !vnode.attrs.selected,
        'text-blue-600 dark:text-gray-500 font-bold': vnode.attrs.selected
      }
    );
    return (
      <a href={vnode.attrs.path} class="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-100 dark:hover:bg-gray-800 group">
        {vnode.attrs.icon}
        <span
          class={c}>
          {vnode.attrs.name}
        </span>
      </a>
    );
  }
};