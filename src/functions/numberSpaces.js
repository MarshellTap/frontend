const integerSpaces = (integer) => {
    return parseFloat(integer).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

const floatSpaces = (floatNumber) => {
    let parts = floatNumber.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return parts.join(".");
}

export {
    integerSpaces,
    floatSpaces
}