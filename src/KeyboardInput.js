class KeyboardInput {
    _mappings = {}
    _pressed = {}

    constructor (debug = false) {
        this.debug = debug
        window.addEventListener('keydown', this.keyPressed.bind(this))
        window.addEventListener('keyup', this.keyReleased.bind(this))
    }

    bind (binding, callback) {
        const keys = Array.isArray(binding)
            ? binding
            : [binding]

        for (const key of keys) {
            this._mappings[key] = callback
        }
    }

    clear () {
        this._mappings = {}
    }

    dispose () {
        window.removeEventListener('keydown', this.keyPressed.bind(this))
        window.removeEventListener('keyup', this.keyReleased.bind(this))
        this.clear()
    }

    keyPressed (e) {
        const key = e.key
        const callback = this._mappings[key]
        if (callback) {
            callback()
            this._pressed[key] = 1
        }

        if (this.debug) {
            console.log(`${e.key} pressed.`)
        }
    }

    keyReleased (e) {
        const key = e.key
        delete this._pressed[key]
    }

    reiteratePressed () {
        for (const key in this._pressed) {
            this.keyPressed({ key })
        }
    }
}

export default KeyboardInput