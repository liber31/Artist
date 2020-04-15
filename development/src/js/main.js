import './artist/setup.js'; // artist 라이브러리를 사용하기 위해 첫 설정을 함
import { drawingStart, room_goto } from './artist/index.js';
import { sample } from './rooms/sample.js';
import { sample2 } from './rooms/sample2.js';

drawingStart();

window.variables.room['sample'] = sample;
window.variables.room['sample2'] = sample2;
room_goto('sample');
