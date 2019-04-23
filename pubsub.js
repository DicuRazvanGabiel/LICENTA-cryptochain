const PubNub = require('pubnub');

const credentials = {
    publishKey: 'pub-c-065070d7-ec72-4f73-920a-6d7b885b0e2d',
    subscribeKey: 'sub-c-bf5fbb50-65e8-11e9-b4da-e22b76110819',
    secretKey: 'sec-c-MWI4YzMyZjItY2IyNy00NmZkLWJlZGEtOTQ1MmQzMmM1MGRh'
}

const CHANNELS = {
    TEST: 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN'
}

class PubSub {
    constructor({ blockchain }) {
        this.blockchain = blockchain;

        this.pubnub = new PubNub(credentials);

        this.pubnub.subscribe({
            channels: Object.values(CHANNELS)
        });

        this.pubnub.addListener(this.listener());
    }

    listener() {
        return {
            message: messageObject => {
                const { channel, message } = messageObject;
                
                console.log(
                    `Message recives. Channnel: ${channel}. Message: ${message}`
                );

                const parsedMessage = JSON.parse(message);

                if( channel === CHANNELS.BLOCKCHAIN ){
                    this.blockchain.replaceChain(parsedMessage);
                }
            }
        }
    }

    publish({ channel, message }){
        this.pubnub.publish({ channel, message });
    }

    subscribeToChanels() {
        this.pubnub.subscribe({
            channels: [Object.values(CHANNELS)]
          });
    }

    publish({ channel, message }) {
        this.pubnub.publish({ message, channel });
    }

    broadcastChain() {
        this.publish({
            channel: CHANNELS.BLOCKCHAIN,
            message: JSON.stringify(this.blockchain.chain)
        });
    }
}

module.exports = PubSub;