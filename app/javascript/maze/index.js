import './style.css'
import * as maze from './maze'

document.getElementById('goRightButton').addEventListener('click', event => {
    maze.goRight();
});

document.getElementById('goLeftButton').addEventListener('click', event => {
    maze.goLeft();
});

document.getElementById('goUpButton').addEventListener('click', event => {
    maze.goUp();
});

document.getElementById('goDownButton').addEventListener('click', event => {
    maze.goDown();
});

document.getElementById('goButton').addEventListener('click', event => {
    workspace.execute();
});
