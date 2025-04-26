import axios from 'axios';

export async function fetchBottles() {
	try {
		const response = await axios.post('https://api.studio.thegraph.com/query/109981/ocean/version/latest', {
			query: `{
				driftingBottles(where: { owner: "0xa01f4a6b456122e1e745d113e61aabe1abefb422" }) {
					id
					owner
					tokenURI
				}
			}`
		});
		return response.data.data.driftingBottles;
	} catch (error) {
		console.error("APIの取得に失敗しました:", error);
		return [];
	}
}
