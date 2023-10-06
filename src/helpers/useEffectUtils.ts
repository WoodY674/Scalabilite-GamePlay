export const useEffectFix = () => {
    let isLoaded = false

    function execOnlyOnce(callback:Function){
        if(!isLoaded) {
            callback()
            isLoaded = true
        }
    }
    return { execOnlyOnce };
}
