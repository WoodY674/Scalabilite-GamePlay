import React, { useEffect, useState } from 'react'
import Game from '@/components/Game'
import axios from 'axios'
import { GameData } from '@/models/interfaces/gameData.interface'
import { useEffectFix } from '../src/helpers/useEffectUtils'
import { getQueryParams } from '../src/helpers/query'
import { v4 as UID } from 'uuid'
import { signToken, TokenType, verifyToken } from '../src/helpers/token'
import LoadingAnim from '@/components/Loading'
import { Cookies } from 'react-cookie'

interface DataRequiredLaunchSession {
	userMail: string
	userId: string
	userAvatar: string
}

const Home: React.FC = () => {
	const { execOnlyOnce } = useEffectFix()
	const cookies = new Cookies()
	const [gameData, setGameData] = useState<GameData | null>(null)

	useEffect(() => {
		execOnlyOnce(() => {
			if (gameData == null) {
				const data = gatheringData()
				launcheSession(data)
			}
		})
	}, [])

	function gatheringData() {
		const data: DataRequiredLaunchSession = {
			userMail: '',
			userId: '',
			userAvatar: '',
		}
		try {
			const params = getQueryParams(window.location.search)
			let token = null

			try {
				token = cookies.get('sign_in')
			} catch (e) {
				console.log('token seems absent', e)
			}
			if (token === null || token === undefined) {
				if (process.env.NEXT_PUBLIC_IS_LOCAL == 'true') {
					// fake to be usable on local
					cookies.set('sign_in', signToken({ userId: params.get('userId', UID()), mail: params.get('mail', 'player@example.com') }))
				}
				data['userMail'] = params.get('mail', 'player@example.com')
				data['userId'] = params.get('userId', UID())
			} else {
				const payload = verifyToken(token, TokenType.Real)
				data['userMail'] = payload.mail
				data['userId'] = payload.userId
			}
			data['userAvatar'] = params.get('avatar')
		} catch (e) {
			console.log('An error occured when gathering data: ', e)
		}
		return data
	}

	function launcheSession(data: DataRequiredLaunchSession) {
		console.log('data', data, cookies.get('sign_in'))
		axios
			.post(
				`http://${process.env.NEXT_PUBLIC_BACK_URL}/session/launch`,
				{
					avatar: data.userAvatar,
				},
				{
					headers: {
						Authorization: cookies.get('sign_in'),
					},
				}
			)
			.then(function (response: any) {
				console.log(response.data)
				setGameData({
					mapBackground: response.data.map.backgroundImg,
					width: response.data.map.width,
					height: response.data.map.height,
					sessionId: response.data.map.id,
					userMail: data.userMail,
					treasures: response.data.treasures,
					players: response.data.players,
					currentPlayer: response.data.currentPlayer,
				})
			})
			.catch(function (e) {
				console.log('err', e)
			})
	}

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'Center',
				width: '100vw',
				height: '100%',
				background: 'url(assets/img/background.jpg)',
				backgroundSize: 'cover',
			}}>
			<h1>Pixel Game</h1>
			{gameData == null ? <LoadingAnim size={200} /> : <Game gameData={gameData} />}
		</div>
	)
}

export default Home
