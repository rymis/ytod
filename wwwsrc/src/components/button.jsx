import clsx from "clsx";

export const Button = {
  view: function (vnode) {
    const { size = 'base', color = 'blue' } = vnode.attrs;
    const cl = clsx(
      {
        "focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800": color === "green",
        "focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900": color === "red",
        "focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg me-2 mb-2 dark:focus:ring-yellow-900": color === "yellow",
        "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800": color === "blue",
        "px-3 py-2 text-xs": size === 'xs',
        "px-3 py-2 text-sm": size === 'sm',
        "px-5 py-2.5 text-sm": size === 'base',
        "px-5 py-3 text-base": size === 'lg',
        "px-6 py-3.5 text-base": size === 'xl'
      }
    );

    return (
      <button
        type="button"
        class={cl}
        onclick={vnode.attrs.onClick}
      >
        {vnode.attrs.name}
      </button>
    );
  }
};
