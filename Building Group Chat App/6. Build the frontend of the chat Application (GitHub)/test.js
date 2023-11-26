function parseJwt (token) {
    if (!token){
        return null
    }
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = Buffer.from(base64, 'base64').toString('utf8');
    return JSON.parse(jsonPayload);
}
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsIm5hbWUiOiJjaGV0YW4iLCJpYXQiOjE3MDA5ODA4NTV9.rVokjzcBLEMoFXQOpqe29szmbPZvQAUPAd9ZSIhnz6E'
const decode = parseJwt (token)
console.log(decode.userId,decode.name)
