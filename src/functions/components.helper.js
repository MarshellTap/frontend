import store from "~/store/index.js";

const showHeader = async () => {
    const header = store.state.components.header;
    if (header.visible) return;
    await store.dispatch('setComponentsHeaderVisible', true)
}

const hideHeader = async () => {
    const header = store.state.components.header;
    if (!header.visible) return;
    return await store.dispatch('setComponentsHeaderVisible', false);
}

const showBottomMenu = async () => {
    const menu = store.state.components.menu;
    if (menu.visible) return;
    await store.dispatch('setComponentsMenuVisible', true)
}

const hideBottomMenu = async () => {
    const menu = store.state.components.menu;
    if (!menu.visible) return;
    return await store.dispatch('setComponentsMenuVisible', false);
}

const showHeaderAndBottomMenu = async () => {
    await showHeader()
    await showBottomMenu()
}

const hideHeaderAndBottomMenu = async () => {
    await hideHeader()
    await hideBottomMenu()
}

export {
    showHeaderAndBottomMenu,
    hideHeaderAndBottomMenu,
    showHeader,
    hideHeader,
    showBottomMenu,
    hideBottomMenu
}