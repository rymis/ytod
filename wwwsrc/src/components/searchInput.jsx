function triggerSearch(e) {
  const searchButton = document.getElementById("search_button");
  if (e.code === "Enter") {
    e.preventDefault();
    searchButton.click();
  } else {
    e.redraw = false;
  }
}

export const SearchInput = {
  view: function (vnode) {
    return (
      <div class="flex items-center max-w-sm mx-auto">
        <label for={vnode.attrs.id} class="sr-only">{t("Search")}</label>
        <div class="relative w-full">
          <input
            type="text"
            id={vnode.attrs.id}
            onkeydown={triggerSearch}
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search..."
          />
        </div>
        <button
          id="search_button"
          type="button"
          onclick={vnode.attrs.onSearch}
          class="p-2.5 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
          </svg>
          <span class="sr-only">Search</span>
        </button>
      </div>
    );
  }
};
