import clsx from "clsx";

export const showModal = (modalId) => () => {
  const modal = document.getElementById(modalId);
  modal.showModal();
}

export const closeModal = (modalId) => () => {
  const modal = document.getElementById(modalId);
  modal.close();
}

export const Modal = {
  view: function (vnode) {
    const { modalId, header, footer, class: className } = vnode.attrs;

    return (
      <dialog
        id={modalId}
        class={clsx("bg-white rounded-lg shadow dark:bg-gray-700", { [className]: className })}>
        <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
            {header}
          </h3>
          <button
            type="button"
            onclick={closeModal(modalId)}
            class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
          >
            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
            </svg>
            <span class="sr-only">Close modal</span>
          </button>
        </div>
        <div class="p-4 md:p-5 space-y-4">
          {vnode.children}
        </div>
        {footer && <div class="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
          {footer}
        </div>
        }
      </dialog>
    );
  }
};
