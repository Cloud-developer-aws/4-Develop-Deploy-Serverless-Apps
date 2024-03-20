import jsonwebtoken from 'jsonwebtoken'

const certificate = `-----BEGIN CERTIFICATE-----
MIIDHTCCAgWgAwIBAgIJOzlNqRjJzOjYMA0GCSqGSIb3DQEBCwUAMCwxKjAoBgNV
BAMTIWRldi1sczh4YW81N2dwc254dXE0LnVzLmF1dGgwLmNvbTAeFw0yNDAzMjAx
MDIxMjdaFw0zNzExMjcxMDIxMjdaMCwxKjAoBgNVBAMTIWRldi1sczh4YW81N2dw
c254dXE0LnVzLmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
ggEBAMGdY2hZSJYRA2GQHc9SaReSF1zfIJ/FmKwEcTLSWhtegwKJpy6VLwF7Mlyz
L/JbtkmnkPmj33ujdKgQ9fU1QNWQuiN0T7NNhTh8ljC4Ry0KW8ysjrIzz0q6XlC3
lfsUUXhJvKLl6nYPFIWmpb56xJsSJrO/3UtyoEevRfgA96lhKbCZL5R+xoBHDt9A
0+vl7v6P7Shcu82YdwfFyDeXORbpiyQkoxl3rLphR7F33byjafFzptd35l+RQEeP
1CZx0WeHKoblVx8ZTyF49vjoFFt/UfA8yV2CFTm0/7qdJ7XT6V7WBVmZjjHLRFqB
pXyexgWMKNoDdT12NxQfntKC3NcCAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAd
BgNVHQ4EFgQUxlXBnZpTZOi4sEwDrMZPPNEcGUAwDgYDVR0PAQH/BAQDAgKEMA0G
CSqGSIb3DQEBCwUAA4IBAQCXch8jOKL44RNgbMmYQGY4yvNn/nlAfaijC3y2nJaW
NyLaw3EG+/fIiROUNZy0LsebmKH71M+/fG4ZPt1J3/I1QMUCPKqLpva+I66eIjX+
DFNsp3ptMzL2kfsxDwVTsZoBJmxs4RrG2kS6fqTDwo1QkWsenSDyCZjtr0MNH9GV
8u+W7yt7UROED7Em28v32IxH8x+RjGajLWUBGNoO/G4M/Tte0OZG6IRSeIoi/azO
6qh7AscaZg4oP95Rum8gdpPT9kZ8nKlgZyl/3NpRC+geG446EOxlJ9qa5/fjZTDW
ln8ZaPjvIdzGdl0RIFDPPOw/uZZXv0F4LAlGY94CKsxF
-----END CERTIFICATE-----`;

export async function handler(event) {
  try {
    const jwtToken = verifyToken(event.authorizationToken)
    console.log('User was authorized', jwtToken)

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    console.log('User was not authorized', e.message)

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

function verifyToken(authHeader) {
  if (!authHeader) throw new Error('No authorization header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authorization header')

  const split = authHeader.split(' ')
  const token = split[1]

  return jsonwebtoken.verify(token, certificate, { algorithms: ['RS256'] })
}
