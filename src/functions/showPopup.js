import store from "~/store/index.js";
import {uuid} from "vue-uuid";

export default (type, message, title = null) => {
    return store.dispatch('notifications/addItemNotificationsPopup', {
        id: uuid.v4(), type, message, ...(title && {title})
    })
}