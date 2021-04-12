require ('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const plaid = require('plaid');

const app = express();
app.use(cors())
app.use(bodyParser.json());

const plaidClient = new plaid.Client({
  clientID: process.env.CLIENT_ID,
  secret: process.env.SECRET,
  env: plaid.environments.sandbox
})

app.get('/create_link_token', async (req, res) => {
  const response = await plaidClient.createLinkToken({
    user: {
      client_user_id: 'some_user_guy'
    },
    client_name: 'Bushy Finance App',
    products: ['auth', 'transactions'],
    country_codes: ['US'],
    language: 'en',
    webhook: 'https://sample-web-hook.com', // whaddis?
    account_filters: {
      depository: {
        account_subtypes: ['checking', 'savings']
      }
    }
  })
  return res.send({linkToken: response.link_token})
})

//get info about linkToken? //WTF is this for?
app.post('/get_link_token', async (req, res) => {
  const response = await plaidClient.getLinkToken(linkToken).catch(err => {
    if (!linkToken) return "no link token"
  })
})

app.post('/token_exchange', async (req, res) => {
  //destructure publicToken in response data
  const { publicToken } = req.body
  const response = await plaidClient
    .exchangePublicToken(publicToken)
    .catch(err => {
      if (!publicToken) return 'no public token'
    })
  const itemId = response.item_id
  res.send({accessToken: response.access_token})
})

app.post('/transactions', async (req, res) => {
  const { accessToken } = req.body
  const response = await plaidClient
    .getTransactions(accessToken, '2021-04-01', '2021-04-08', {
      count: 250,
      offset: 0
    })
    .catch(err => {
      if (!accessToken) return 'no access token'
    })
  console.log('actual response: ', response)
  const transactions = response.transactions
  res.send({transactions})
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`listening on port ${PORT}!`));
