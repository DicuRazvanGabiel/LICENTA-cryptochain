import React from 'react'

const Transaction = ({ transaction }) => {
    const { input, outputMap } = transaction;
    const recipients = Object.keys(outputMap);

    return (
        <div>
            <div>
                From: {input.address}
            </div>
            < br />
            <div>
                Balance: {input.amount}
            </div>
            <div>
                {
                    recipients.map( recipient =>(
                        <div key={recipient}>
                            <div>
                                To: {recipient}
                            </div>
                            <div>
                                Sent: {outputMap[recipient]}
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}

export default Transaction;