import {signToken, TokenType, verifyToken} from "../src/helpers/token";

describe( 'token', () => {
    const payload = {userId:"uid", mail:"test@gmail.com"}

    it( 'sign a token', () => {
        expect( typeof signToken(payload) ).toBe(typeof "") ;
    })

    it( 'verify token', () => {
        const token = signToken(payload)
        const tokenPayload = verifyToken(token, TokenType.Fake)
        expect(tokenPayload.userId).toBe( payload.userId );
        expect(tokenPayload.mail).toBe( payload.mail );
    } );
} )
