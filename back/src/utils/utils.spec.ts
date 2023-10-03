import {Utils} from "./utils";
import {Request, Response} from "express";

describe('Utils', () => {
    describe('validBodyRequest', () => {
        it('should return -1 if request.body does not exist', () => {
            const request: Partial<Request> = {};
            const interfaceModel = {};
            const result = Utils.validBodyRequest(request as Request, interfaceModel);
            expect(result).toBe(-1);
        });

        it('should return -2 if a required property is missing in request.body', () => {
            const request: Partial<Request> = {body: {prop1: 'value1'}};
            const interfaceModel = {prop1: '', prop2: ''};
            const result = Utils.validBodyRequest(request as Request, interfaceModel);
            expect(result).toBe(-2);
        });

        it('should return -3 if there are extra properties in request.body', () => {
            const request: Partial<Request> = {body: {prop1: 'value1', prop2: 'value2', prop3: 'value3'}};
            const interfaceModel = {prop1: '', prop2: ''};
            const result = Utils.validBodyRequest(request as Request, interfaceModel);
            expect(result).toBe(-3);
        });

        it('should return -4 if a property in request.body has a different type than the corresponding property in interfaceModel', () => {
            const request: Partial<Request> = {body: {prop1: 123}};
            const interfaceModel = {prop1: ''};
            const result = Utils.validBodyRequest(request as Request, interfaceModel);
            expect(result).toBe(-4);
        });

        it('should return 1 if all validation checks pass', () => {
            const request: Partial<Request> = {body: {prop1: 'value1', prop2: 'value2'}};
            const interfaceModel = {prop1: '', prop2: ''};
            const result = Utils.validBodyRequest(request as Request, interfaceModel);
            expect(result).toBe(1);
        });
    });

});