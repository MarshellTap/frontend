import { gql } from '@apollo/client/core'

export const GET_BALANCE = gql`
	query getBalance {
		balance {
			amount
		}
	}
`

export const INIT_GAME = gql`
	mutation ($initData: String) {
		initGame(initData: $initData) {
			is_register,
			name,
			avatar,
			default_avatar,
			temporary_auth_token
		}
	}
`

export const CHECKING_AVAILABILITY_BANDNAME = gql`
	mutation ($bandName: String) {
		checkingAvailabilityBandName(bandName: $bandName) {
			available
		}
	}
`

export const CREATE_BAND = gql`
	mutation ($initData: String, $bandName: String, $avatar: String, $refCode: String) {
		createBand(initData: $initData, bandName: $bandName, avatar: $avatar, refCode: $refCode) {
			success
		}
	}
`

export const INIT_USER = gql`
	mutation ($initData: String) {
		initUser(initData: $initData) {
			telegram_id,
			avatar,
			name,
			bandName,
			balance,
			band {
				code,
				available
			},
			token,
			available_daily_rewards {
				status,
				amount
			}
		}
	}
`

export const CLAIM_DAILY_REWARDS = gql`
	mutation {
		claimDailyRewards {
			amount,
			balance
		}
	}
`

export const GET_TASKS = gql`
	query getTasks {
		tasks {
            own {
                id,
				type,
                title,
                reward,
                info {
                    type,
                    link,
					amount,
					count
                },
                claim
            },
            other {
                id,
				type,
                title,
                reward,
                info {
                    type,
                    link,
					amount,
					count
                },
                claim
            }
        }
	}
`

export const CLAIM_TASKS = gql`
	mutation ($tasks_id: ID) {
		claimTasks(tasks_id: $tasks_id) {
			amount,
			balance
		}
	}
`

export const CLAIM_BAND_EARN = gql`
	mutation {
		claimBandEarn {
			amount,
			balance
		}
	}
`

export const GET_BAND_INFO = gql`
	query getBand {
		band {
			available
		}
	}
`

export const GET_BAND_USERS = gql`
	mutation ($page: Int) {
		bandUsers (page: $page) {
			items {
				avatar,
				name,
				amount
			},
			page {
				current,
				total
			},
			count
		}
	}
`

export const GET_DROP_GAME_TRACKS = gql`
	query getDropGameTasks {
		dropGameTracks {
			id,
			image,
			source,
			author,
			name,
			next_timer,
			history_created_at
		}
	}
`

export const COMPLETE_DROP_GAME = gql`
	mutation ($notes: Int, $track_id: Int) {
		completeDropGame (notes: $notes, track_id: $track_id) {
			balance,
			amount
		}
	}
`