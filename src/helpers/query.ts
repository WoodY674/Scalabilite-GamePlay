export class QueryParams{
    params:{[name:string]: string}
    constructor() {
        this.params = {}
    }

    setVal(key:string, val:string){
        this.params[key] = val
    }

    get(key:string, defaultVal:string=""){
        try {
            return this.params[ key ]
        }catch ( e ){
        }
        return defaultVal
    }
}

export function getQueryParams(url:string){
    const paramsStr = url.split("?")[1]
    const eachParams= paramsStr.split("&")
    const params = new QueryParams()
    eachParams.forEach(el=>{
        const item = el.split("=")
        params.setVal(item[0], item[1])
    })
    return params
}
