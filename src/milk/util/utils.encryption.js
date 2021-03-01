/* ############################ */
/* #### AES-GCM Encryption #### */
/* ############################ */
/*
1.	Generate a key and store it someplace safe:
		generateKey()
	(note: unlike the password parameter, which can be a string of your choosing, you must use a valid generated key fot the key parameter.)
2.	Encrypt using a secret password and key. encryptItem(key, password, payloadToEncrypt)
		let encryptedText = await encryptItem('9UvLZGgrOPSelucjydrF5wCMabD3v_wiGqbFo_Okplg', 'mySuperSecretPassword123!@#P@$$w0RD!', 'Got a secret? Can you keep it?');
3.	Decrypt using the same secret password and key. decryptItem(key, password, encryptedToDecrypt)
		let decryptedText = await decryptItem('9UvLZGgrOPSelucjydrF5wCMabD3v_wiGqbFo_Okplg', 'mySuperSecretPassword123!@#P@$$w0RD!', encryptedText);
NOTE: WebCrypto Further Reading (https://diafygi.github.io/webcrypto-examples/)
*/
/* ############################ */
/* ## generateKey() ## */
export const generateAESGCMKey = async () => {
	let new_key = '';
	await window.crypto.subtle.generateKey(
		{
			name: 'AES-GCM',
			length: 256,
		},
		true,
		['encrypt', 'decrypt']
	)
	.then(async (key) => {
		await window.crypto.subtle.exportKey(
			'jwk',
			key
		)
		.then((keydata) => {
			new_key = keydata;
		})
		.catch((err) => {
			if (window.debugging) { console.error(err); };
		});
	})
	.catch((err) => {
		if (window.debugging) { console.error(err); };
	});
	return await new_key.k;
}
export const generateKey = generateAESGCMKey;
/* ## encryptItem(key, password, payloadToEncrypt) ## */
export const encryptAESGCM = async (key, secret, data) => {
	let encoded_data = '';
	if (secret.length < 1) { secret = '$3(63+$^|+__Utw:afXjtE,viA>ji2k>.CC_'; };
	secret = new TextEncoder('utf-8').encode(secret);
	data = new TextEncoder('utf-8').encode(data);
	await window.crypto.subtle.importKey(
		'jwk',
		{
			kty: 'oct',
			k: key,
			alg: 'A256GCM',
			ext: true,
		},
		{
			name: 'AES-GCM',
		},
		false,
		['encrypt']
	)
	.then(async (key) => {
		await window.crypto.subtle.encrypt(
			{
				name: 'AES-GCM',
				iv: secret,
				additionalData: secret,
				tagLength: 128,
			},
			key,
			data
		)
		.then((encrypted) => {
			let binary = '';
			const bytes = new Uint8Array(encrypted);
			for (let i = 0; i < bytes.byteLength; i++) { binary += String.fromCharCode(bytes[i]); };
			encoded_data = `${encodeURIComponent(window.btoa(binary))}`;
		})
		.catch((err) => {
			if (window.debugging) { console.error(err); };
		});
	})
	.catch((err) => {
		if (window.debugging) { console.error(err); };
	});
	return await encoded_data;
}
export const encryptItem = encryptAESGCM;
/* ## decryptItem(key, password, payloadToDecrypt) ## */
export const decryptAESGCM = async (key, secret, data) => {
	let decoded_data = '';
	if (secret.length < 1) { secret = '$3(63+$^|+__Utw:afXjtE,viA>ji2k>.CC_'; };
	secret = new TextEncoder('utf-8').encode(secret);
	const binary_string = window.atob(`${decodeURIComponent(data)}`);
	let bytes = new Uint8Array(binary_string.length);
	for (let i = 0; i < binary_string.length; i++){ bytes[i] = binary_string.charCodeAt(i); };
	data = bytes.buffer;
	await window.crypto.subtle.importKey(
		'jwk',
		{
			kty: 'oct',
			k: key,
			alg: 'A256GCM',
			ext: true,
		},
		{
			name: 'AES-GCM',
		},
		false,
		['decrypt']
	)
	.then(async (key) => {
		await window.crypto.subtle.decrypt(
			{
				name: 'AES-GCM',
				iv: secret,
				additionalData: secret,
				tagLength: 128,
			},
			key,
			data
		)
		.then((decrypted) => {
			decoded_data = new TextDecoder().decode(new Uint8Array(decrypted));
		})
		.catch((err) => {
			if (window.debugging) { console.error(err); };
		});
	})
	.catch((err) => {
		if (window.debugging) { console.error(err); };
	});
	return await decoded_data;
}
export const decryptItem = decryptAESGCM;