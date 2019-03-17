const keypair = require('keypair');
const forge = require('node-forge');

const validateLogin = (username, hashedPassword) => {
    return (username === hashedPassword);
}

const getRsaKeyPair = () => {
    let rsa = forge.pki.rsa;
    let pair = keypair();
    // let publicKey = forge.pki.publicKeyFromPem(pair.public);
    // let privateKey = forge.pki.privateKeyFromPem(pair.private);
    // return { publicKey: publicKey, privateKey: privateKey};
    return pair;
}

module.exports = { validateLogin, getRsaKeyPair }