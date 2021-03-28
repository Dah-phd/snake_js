class snake {
    constructor(dims = [20, 40], init_length = 3) {
        this.dims = dims;
        this.init_length = init_length;
        this.set_food = false

    }

    setup() {
        this.alive = true;
        this.python = [];
        let vert;
        for (vert = 0; vert < this.init_length; vert++) {
            this.python.push([
                this.dims[0] / 2 + vert,
                this.dims[1] / 2
            ])
        }
        this.face = 'up';
        this.score = 0;
        this._make_food()
    }

    run() {
        this._colision();
        if (this.alive) {
            if (this.humgry) {
                this._move(false);
                this._make_food()
            }
            else {
                this._move()
            }
        }
        this.turned = false
    }
    up() { if (this.face != 'down') { this.face = 'up'; this.turned = true } }
    left() { if (this.face != 'right') { this.face = 'left'; this.turned = true } }
    right() { if (this.face != 'left') { this.face = 'right'; this.turned = true } }
    down() { if (this.face != 'up') { this.face = 'down'; this.turned = true } }

    _make_food() {
        let position, row, sq;
        let py_long = this.python.length;
        position = this._randint(min = 1, max = (this.dims[0] * this.dims[1] - py_long));
        for (row = 0; row < this.dims[0]; row++) {
            for (sq = 0; sq < this.dims[1]; sq++) {
                if (!this._food_in_py(row, sq, py_long)) {
                    if (position == 0) { this.food = [row, sq]; this.humgry = false } else { position-- }
                }
            }
        }
    }
    _food_in_py(row, sq, tail) {
        let vert;
        for (vert = 0; vert < tail; vert++) {
            if (row == this.python[vert][0] && sq == this.python[vert][1]) { return true }
        }
        return false
    }

    _colision() {

        if (this.python[0][0] >= this.dims[0] || this.python[0][0] < 0 || this.python[0][1] >= this.dims[1] || this.python[0][1] < 0) {
            this.alive = false;
            return
        }
        let vert;
        let tail = this.python.length - 1;
        for (vert = 1; vert < tail; vert++) {
            if (this.python[0][0] == this.python[vert][0] && this.python[0][1] == this.python[vert][1]) {
                this.alive = false;
                return
            }
        }
        if (this.python[0][0] == this.food[0] && this.python[0][1] == this.food[1]) {
            this.humgry = true;
            this.score += 10;
        }
    }

    _move(remove = true) {
        let head = this.python[0];
        if (this.face == 'up') { head[0]-- }
        else if (this.face == 'down') { head[0]++ }
        else if (this.face == 'left') { head[1]-- }
        else { head[1]++ }
        this.python.unshift(head);
        if (remove) { this.python.pop(); }
    }
    _randint(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

}
class game {
    constructor(canv) {
        this.canvas = document.getElementById(canv);
        this.python = new snake();
        this.python.setup();
        this.start()
    }
    start() {
        var id = null;
        clearInterval(id);
        id = setInterval(this.move(), 10);
    }
    move() {
        this.python.run();

    }
}