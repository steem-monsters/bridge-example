const bridge = require('@splinterlands/external-bridge');

const GAME_API_URL = 'https://node.splinterlands.com';
const DEPOSIT_ACCOUNT = 'sl-bsc';
const SUPPORTED_TOKENS = ['DEC', 'SPS'];

start();

async function start() {
	bridge.init({ 
		game_api_url: GAME_API_URL,
		save_state: (last_block) => { console.log(`Loaded block ${last_block}...`); },  // TODO: Store the last block num processed 
		load_state: () => null // TODO: Load and return the last block num processed
	});

	bridge.stream(onGameTx, ['token_transfer']);
}

async function onGameTx(tx) {
	const data = JSON.parse(tx.data);

	// Check if the tokens were sent to the specified deposit account
	if(data.to !== DEPOSIT_ACCOUNT)
		return;

	// Check if the token transferred is one that is supported by this bridge
	if(!SUPPORTED_TOKENS.includes(data.token))
		return;

	console.log(tx);
}