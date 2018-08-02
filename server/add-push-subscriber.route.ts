import {USER_SUBSCRIPTIONS} from './in-memory-db';

export function addPushSubscriber(req, res) {
    // get subscription object from request
    const sub = req.body;
    console.log('Received Subscription on the server: ', sub);
    // store object in in-memory db
    USER_SUBSCRIPTIONS.push(sub);

    res.status(200).json({message: 'Subscription added successfully.'});
}

