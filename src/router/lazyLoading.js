// lazy loading Components
// https://github.com/vuejs/vue-router/blob/dev/examples/lazy-loading/app.js#L8
//export default (name) => () => import(`${name}`)
export default (name) => () => import(`@/views/app/fnd/${name}`)
//export default (component) => () =>component
