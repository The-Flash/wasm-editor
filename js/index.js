const CELL_SIZE = 50;

function draw(state) {
    const image = state.internal.image();
    const canvas = document.getElementById("my-canvas");
    /**
     * @type {CanvasRenderingContext2D}
     */
    const context = canvas.getContext("2d");

    // context.fillStyle = "red";
    // context.fillRect(0, 0, 50, 50);
    context.strokeStyle = "black";
    context.lineWidth = 1;
    const width = image.width();
    const height = image.height();

    const cells = image.cells();

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            const index = ((y * width) + x) * 3;;
            const color = `rgb(${cells[index + 0]}, ${cells[index + 1]}, ${cells[index + 2]})`;
            context.fillStyle = color;
            context.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
    }

    for (let x = 0; x <= width; x++) {
        context.beginPath();
        context.moveTo(x * CELL_SIZE + 0.5, 0);
        context.lineTo(x * CELL_SIZE + 0.5, height * CELL_SIZE);
        context.stroke();
    }

    for (let y = 0; y <= height; y++) {
        context.beginPath();
        context.moveTo(0, y * CELL_SIZE + 0.5);
        context.lineTo(width * CELL_SIZE, y * CELL_SIZE + 0.5);
        context.stroke();
    }
}

function setupCanvas(state) {
    const image = state.internal.image;
    /**
     * @type {HTMLCanvasElement}
     */
    const canvas = document.getElementById("my-canvas");

    canvas.addEventListener("click", (event) => {
        const canvas = event.target;
        const rect = canvas.getBoundingClientRect();

        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;

        x = Math.floor(x / CELL_SIZE);
        y = Math.floor(y / CELL_SIZE);
        state.internal.brush(x, y, state.currentColor)
        draw(state);
    });

    canvas.addEventListener("mousedown", () => {
        state.dragging = true;
        state.internal.start_undo_block();
    });

    canvas.addEventListener("mouseup", () => {
        state.dragging = false;
        state.internal.close_undo_block();
    });

    canvas.addEventListener("mousemove", (event) => {
        if (!state.dragging) return;

        const canvas = event.target;
        const rect = canvas.getBoundingClientRect();

        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;

        x = Math.floor(x / CELL_SIZE);
        y = Math.floor(y / CELL_SIZE);
        state.internal.brush(x, y, state.currentColor)
        draw(state);
    });

    document.getElementById("red").addEventListener("click", () => {
        state.currentColor = [255, 200, 200];
    });

    document.getElementById("green").addEventListener("click", () => {
        state.currentColor = [200, 255, 200];
    });

    document.getElementById("blue").addEventListener("click", () => {
        state.currentColor = [200, 200, 255];
    });

    document.getElementById("undo").addEventListener("click", () => {
        state.internal.undo();
        draw(state);
    });

    document.getElementById("redo").addEventListener("click", () => {
        state.internal.redo();
        draw(state);
    })
}

async function main() {
    const lib = await import("../pkg/index.js").catch(console.error);
    const internal = new lib.InternalState(10, 10);

    const state = {
        internal,
        currentColor: [200, 255, 200],
        dragging: false
    }
    console.log(state)
    draw(state);
    setupCanvas(state);
}

main();