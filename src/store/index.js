import {createStore} from "vuex";

export default createStore({
    state: {
        author_id: null
    },
    mutations: {
        setAuthorId(state, author_id) {
            state.author_id = author_id
        }
    }
})