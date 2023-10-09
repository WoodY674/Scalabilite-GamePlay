export class QueryParams{
    params:{[name:string]: string}
    constructor() {
        this.params = {}
    }

    setVal(key:string, val:string){
        this.params[key] = val
    }

    get(key:string, defaultVal:string=""){
        return (Object.keys(this.params).includes(key) ? this.params[key] : defaultVal)
    }
}

export function getQueryParams(url:string){
    const params = new QueryParams()
    try {
        const paramsStr = url.split( "?" )[ 1 ]
        const eachParams = paramsStr.split( "&" )
        eachParams.forEach( el => {
            const item = el.split( "=" )
            params.setVal( item[ 0 ], item[ 1 ] )
        } )
    }catch ( e ){
    }
    return params
}
