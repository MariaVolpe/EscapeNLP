import PuzzleManager from './PuzzleManager';
import Grid from './Grid';

class GameSession {
  constructor() {
    this.puzzleManager = new PuzzleManager();
    this.grid = new Grid();
    // add in network/connection information, sockets, player information
    // this.chatroom = new ChatRoom(); etcs
  }
}

export default GameSession;
