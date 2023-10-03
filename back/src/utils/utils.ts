import {Request, Response} from "express";
import {CustomMessageRequest} from "../message/custum.message";
export class Utils{
    static validBodyRequest(
        request: Request,
        interfaceModel: any
    ): number {
        // Vérifie si request.body existe
        if(!request.body){
            return -1;
        }
        const requiredProperties = Object.keys(interfaceModel);
        const providedProperties = Object.keys(request.body);
        for (const prop of requiredProperties) {
            if (!providedProperties.includes(prop)) {
                return -2;
            }
        }
        // Vérifie s'il y a des propriétés en trop dans request.body
        for (const prop of providedProperties) {
            if (!requiredProperties.includes(prop)) {
                return -3;
            }
        }
        // Vérifie le type de chaque propriété
        for (const prop of requiredProperties) {
            if (typeof request.body[prop] !== typeof interfaceModel[prop]) {
                return  -4;
            }
        }
        return 1;
    }

}