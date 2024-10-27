import store from "~/store/index.js";

export default async (name = null, props = null) => {
    const modal = store.state.modal
    if (
        modal.closeAnimation ||
        (
            !modal.active &&
            !name
        )
    ) return;
    if (modal.active) {
        await store.dispatch('modal/setModalCloseAnimation', true)
        setTimeout(() => {
            store.dispatch('modal/setModalCloseAnimation', false)
            if (name && name !== modal.selected) {
                if (props) store.dispatch('modal/setModalProps', props)
                store.dispatch('modal/setModalActive', name)
            } else store.dispatch('modal/setModalActive')
        }, 200)
    } else {
        if (props) {
            await store.dispatch('modal/setModalProps', props)
        }
        await store.dispatch('modal/setModalActive', name)
    }
}