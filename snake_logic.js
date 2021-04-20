class snake {
    constructor(dims = [20, 30], init_length = 3) {
        this.dims = dims;
        this.init_length = init_length;
        this.set_food = false;
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
                this._make_food();
                console.log(this.score)
            }
            else {
                this._move()
            }
        }
        this.turned = false;
    }
    up() { if (this.face != 'down') { this.face = 'up'; this.turned = true } }
    left() { if (this.face != 'right') { this.face = 'left'; this.turned = true } }
    right() { if (this.face != 'left') { this.face = 'right'; this.turned = true } }
    down() { if (this.face != 'up') { this.face = 'down'; this.turned = true } }

    _make_food() {
        let position, row, sq;
        let py_long = this.python.length;
        position = this._randint(1, (this.dims[0] * this.dims[1] - py_long));
        for (row = 0; row < this.dims[0]; row++) {
            for (sq = 0; sq < this.dims[1]; sq++) {
                if (!this._food_in_py(row, sq, py_long)) {
                    if (position == 0) { this.food = [row, sq]; this.humgry = false; return } else { position-- }
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
        let head = this.python[0].slice();
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
    constructor(canv, score_board) {
        this.grid = document.getElementById(canv);
        this.score_board = document.getElementById(score_board);
        this.grid.height = 800;
        this.grid.width = 1200;
        this.cvs = this.grid.getContext('2d');
        this.python = new snake();
        this.python.setup();
        this.start()
        console.log('run!')
    }
    start() {
        let game = this;
        this.fps = setInterval(function () { game.move(game) }, 100);

    }
    move(self) {
        if (!self.python.alive) { clearInterval(self.fps); self.end(); return }
        self.python.run();
        self.draw();
        document.addEventListener('keydown', function (e) { self.turn(e) });

    }
    turn(e) {
        if (e.key == 'ArrowDown') { this.python.down() }
        else if (e.key == 'ArrowUp') { this.python.up() }
        else if (e.key == 'ArrowLeft') { this.python.left() }
        else if (e.key == 'ArrowRight') { this.python.right() }
    }
    draw() {
        this.score_board.innerHTML = this.python.score;
        this.cvs.clearRect(0, 0, this.grid.width, this.grid.height);
        let i;
        for (i = 0; i < this.python.python.length; i++) {
            this.cvs.fillStyle = 'black';
            this.cvs.fillRect(40 * this.python.python[i][1] - 1, 40 * this.python.python[i][0] - 1, 40, 40);
            this.cvs.fillStyle = 'green';
            this.cvs.fillRect(40 * this.python.python[i][1], 40 * this.python.python[i][0], 38, 38);
        }
        this.cvs.fillStyle = 'red';
        this.cvs.fillRect(40 * this.python.food[1], 40 * this.python.food[0], 40, 40);
    }
    end() {
        alert('GAME OVER!\n' + this.python.score.toString())
    }
}