import { render, screen } from '@testing-library/react'
import Home from '../pages/index'
import '@testing-library/jest-dom'
import { equals } from '@jest/expect-utils';

describe( 'Home', () => {
    /*    it( 'renders a heading', () => {
            render( <Home /> )

            const heading = screen.getByRole( 'heading', {
                name: /Home Page/i,
            } )

            expect( heading ).toBeInTheDocument()
        } )*/

    it( 'adds 1 + 2 to equal 3', () => {
        expect( 1 + 2 ).toBe( 3 );
    } );
} )
