export default () => {
    const search = new URLSearchParams(window.location.search);
    return Object.fromEntries(search.entries());
}