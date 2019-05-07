const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const Blockchain = require('./blockchain');
const PubSub = require('./app/pubsub');
const request = require('request');
const TransactionPool = require('./wallet/transaction-pool');
const Wallet = require('./wallet');
const TransactionMiner = require('./app/transaction-miner');

const app = express();
const blockchain = new Blockchain();
const transactionPool = new TransactionPool();
const wallet = new Wallet();
const pubsub = new PubSub({ blockchain, transactionPool, wallet });
const transactionMiner = new TransactionMiner({ 
                                                blockchain, 
                                                transactionPool, 
                                                wallet, 
                                                pubsub 
                                            });

const DEFAUL_PORT = 3000;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAUL_PORT}`;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'client/dist')));

app.post('/api/mine', (req, res) => {
    const { data } = req.body;

    blockchain.addBlock({ data });

    pubsub.broadcastChain();

    res.redirect('/api/blocks');
});

app.post('/api/transact', (req, res) => {
    const { amount, recipient } = req.body;
    let transaction = transactionPool
        .existingTransaction({ inputAddress: wallet.publicKey });

    try {
        if(transaction){
            transaction.update({ senderWallet: wallet, recipient, amount });
        } else {
            transaction = wallet.createTransaction({ 
                amount, 
                recipient, 
                chain: blockchain.chain 
            });
        }
    } catch (error) {
        return res.status(400).json({ type: 'error', message: error.message })
    }

    transactionPool.setTransaction(transaction);

   pubsub.broadcastTransaction(transaction);

    res.json({ type:'success', transaction });
});

app.get('/api/transaction-pool-map', (req, res) => {
    res.json(transactionPool.transactionMap);
});

app.get('/api/blocks', (req, res) => {
    res.json(blockchain.chain);
});

app.get('/api/mine-transactions', (req, res) => {
    transactionMiner.mineTransactions();

    res.redirect('/api/blocks');
});

app.get('/api/wallet-info', (req, res) => {
    const address = wallet.publicKey

    res.json({ 
        address,
        balance: Wallet.calculateBalance({
            chain: blockchain.chain,
            address
        })
    })
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname,'client/dist/index.html'));
})

const syncWithRootState = () => {
    request({ url: `${ROOT_NODE_ADDRESS}/api/blocks` }, (error, response, body) => {
        if (!error && response.statusCode === 200) {
          const rootChain = JSON.parse(body);
    
          console.log('replace chain on a sync with', rootChain);
          blockchain.replaceChain(rootChain);
        }
    });

    request({ url: `${ROOT_NODE_ADDRESS}/api/transaction-pool-map` }, (error, response, body) => {
        if (!error && response.statusCode === 200) {
          const rootTransactionPoolMap = JSON.parse(body);
    
          console.log('replace transaction pool map on a sync with', rootTransactionPoolMap);
          transactionPool.setMap(rootTransactionPoolMap);
        }
    });
};

let PEER_PORT;

if(process.env.GENERATE_PEER_PORT === 'true'){
    PEER_PORT = DEFAUL_PORT + Math.ceil(Math.random() * 1000);
}

const PORT = PEER_PORT || DEFAUL_PORT;
app.listen(PORT, () => {
    console.log(`listening at localhost:${PORT}`)

    if(PORT !== DEFAUL_PORT){
        syncWithRootState();
    }
    
});