/*************************************************
/*  Functions with moving **start** and **end** 
/*************************************************/

/* Cell being dragged */
let dragged_cell = undefined;

/* Offset from mouse coords to left top corner */
let offset_x = undefined;
let offset_y = undefined;


/* Return true if mouse is over given @cell */
function is_mouse_over(cell) {
    return cell.x <= mouseX && mouseX <= cell.x + SIZE
        && cell.y <= mouseY && mouseY <= cell.y + SIZE;
}


function mousePressed() {
    let draggable = [start, end];
    for (let cell of draggable) 
        if (cell && is_mouse_over(cell)) {
            // Mark the draggable cell
            dragged_cell = cell;
            // Create new cell
            let new_cell = new Cell(cell.row, cell.col);
            // Preserve same walls for the new cell
            new_cell.walls = Array.from(cell.walls);
            // Update grid
            grid[cell.row][cell.col] = new_cell;
            // Calculate offset for moving things
            offset_x = dragged_cell.x - mouseX;
            offset_y = dragged_cell.y - mouseY;
            console.log("Dragging [row, col] = " + [cell.row, cell.col])
            return;
        }
}


function mouseDragged() {
    if (dragged_cell) {
        dragged_cell.x = mouseX + offset_x;
        dragged_cell.y = mouseY + offset_y;
    }
}


function mouseReleased() {
    if (!dragged_cell)
        return;

    // TODO: does not work if outside the canvas
    // Find previous cell      
    let col = int(mouseX / SIZE);
    let row = int(mouseY / SIZE);
    let prev_cell = grid[row][col];

    // Place dragged cell
    dragged_cell.x = prev_cell.x;
    dragged_cell.y = prev_cell.y;
    dragged_cell.row = row;
    dragged_cell.col = col;
    dragged_cell.walls = Array.from(prev_cell.walls);

    // Update grid
    grid[row][col] = dragged_cell;

    // If we had a solution found, recalculate it if we took start or end
    if ((dragged_cell === start || dragged_cell == end) && solution.length) {
        dfs();
        for (let x of generator);
    }

    dragged_cell = undefined;
}
