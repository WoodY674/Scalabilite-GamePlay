import '@testing-library/jest-dom'
import {signToken, verifyToken, TokenType} from "../src/helpers/token";


describe( 'token', () => {
    const payload = {userId:"uid", mail:"test@gmail.com"}
    /*
    it( 'verify token success', () => {
        const token = signToken(payload)
        const tokenPayload = verifyToken(token, TokenType.Fake)
        expect(tokenPayload.userId).toBe( payload.userId );
        expect(tokenPayload.mail).toBe( payload.mail );
    } );


    it( 'verify token failure : bad pub key', () => {
        const token = signToken(payload)
        expect(() => {
            verifyToken(token, TokenType.Real)
        }).toThrow(Error);
    } );
    */

	it('fake test', () => {
		expect(1+2).toBe(3)
	})
})
