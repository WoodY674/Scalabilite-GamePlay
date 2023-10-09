import '@/../styles/globals.scss'
import "public/assets/css/main.css"
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
	return <Component {...pageProps} />
}

export default MyApp
