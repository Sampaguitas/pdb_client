export const sidemenuService = {
    select,
};

function select(item) {
    return new Promise(function(resolve){
        resolve(item);
    });
}