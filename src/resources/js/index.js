import { Artist } from './artist.js';

Artist.init('canvas', 720, 1280);
const test = Artist.createElement();
//test.routine((pencil) => {
//        pencil
//            .drawLine()
//            .drawLine()
//            .drawLine()
//            .drawRectangle()
//            
//        alert(pencil);
//    }); // 이렇게 되면 좋겠다!
Artist.start();
