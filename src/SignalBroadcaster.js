class SignalBroadcaster {
    _subscriptions = {}

    constructor () {
        if (SignalBroadcaster._instance) {
            return SignalBroadcaster._instance

        } else {
            return SignalBroadcaster._instance = this
        }
    }

    broadcast (signal, args) {
        const callbacks = this._subscriptions[signal] || []
        for (const callback of callbacks) {
            callback(args)
        }
    }

    clear (signals) {
        if (Array.isArray(signals)) {
            for (const signal of signals) {
                delete this._subscriptions[signal]
            }

        } else {
            this._subscriptions = {}
        }
    }

    subscribe (signal, callback) {
        const callbacks = this._subscriptions[signal] || (this._subscriptions[signal] = [])
        callbacks.push(callback)
    }
}

export default SignalBroadcaster