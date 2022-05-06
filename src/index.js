import React from 'react';
import ReactDOM from 'react-dom/client';

function Letters(props) {
  let letterBoxes = [];
  for (let i = 65; i <= 90; i++) {
    letterBoxes.push(<span className='letterBoxes'><div>{String.fromCharCode(i)}</div><div>↓</div><div>{String.fromCharCode((((i - 65) + props.shift) % 26) + 65)}</div></span>)
  }
  return (<div className='twoRow'>{letterBoxes}</div>);
}

class CodeInput extends React.Component {
  getMessage = () => {
    let messageValue = document.getElementById('messageInput').value;
    document.getElementById('messageInput').value = '';
    this.props.onChangeMessage(messageValue);

  }

  render() {
    return (
      <div className='input'>
        <p className='largerText'>Type in a new sentence to be encoded:</p>
        <div className='inputBox'>
          <textarea cols="35" rows="5" id="messageInput"></textarea>
          <button type="submit" onClick={this.getMessage} className='submit btn btn-primary'>Submit</button>
        </div>
      </div>
    );
  }
}

class Encoded extends React.Component {
  encodeMessage = () => {
    if (this.props.message == '') {
      return "You haven't encoded anything yet";
    }
    let encodedMessage = '';
    let encodedLetterIndex;
    for (let i = 0; i < this.props.message.length; i++) {
      let decodedLetterIndex = this.props.message.charCodeAt(i) - 65;//get A down to 0
      if (decodedLetterIndex == -2) {
        encodedMessage += "?";
      } else if (decodedLetterIndex == -26) {
        encodedMessage += "'";
      } else if (decodedLetterIndex == -32) {
        encodedMessage += "!";
      } else if (decodedLetterIndex == -19) {
        encodedMessage += ".";
      } else if (decodedLetterIndex == -21) {
        encodedMessage += ",";
      } else if (decodedLetterIndex == -33) {
        encodedMessage += " ";
      } else {
        if (decodedLetterIndex >= 25) {//make everything capital case for simplicity
          decodedLetterIndex -= 32;
        }
        encodedLetterIndex = ((decodedLetterIndex + this.props.shift) % 26) + 65;//shift the letter, take the remainder in case it goes over 0-25, then move A back to 65
        encodedMessage += String.fromCharCode(encodedLetterIndex);
      }

    }
    return encodedMessage;
  }

  render() {
    return (
      <div className='encoded'>
        <h2>Your encoded message:</h2>
        <p className='largerText'>{this.encodeMessage()}</p>
      </div>
    );
  }
}

class ShiftTracker extends React.Component {
  increaseShift = () => {
    let counter;
    if (this.props.shift == 25) {
      counter = 0;
    } else {
      counter = this.props.shift + 1;
    }
    this.props.onChangeShift(counter);
  }

  decreaseShift = () => {
    let counter;
    if (this.props.shift == 0) {
      counter = 25;
    } else {
      counter = this.props.shift - 1;
    }
    this.props.onChangeShift(counter);
  }

  resetShift = () => {
    this.props.onChangeShift(0);
  }

  render() {
    return (
      <div>
        <div className='wholeShift'>
          <div className='shiftDescriptions'>
            <div>Alphabet Letters:</div>
            <div>Encoded Letters:</div>
          </div>
          <Letters shift={this.props.shift} />
        </div>
        <div className='buttonContainer'>
          <button onClick={this.increaseShift} className='btn btn-primary'>Increase Shift</button>
          <button onClick={this.decreaseShift} className='btn btn-primary'>Decrease Shift</button>
          <button onClick={this.resetShift} className='btn btn-primary'>Decode</button>
        </div>
      </div>
    );
  }
}

class GameBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      shift: 0
    }
  }

  changeMessage = (newMessage) => {
    this.setState({ message: newMessage });
  }

  changeShift = (num) => {
    this.setState({ shift: num });
  }

  render() {
    return (
      <div className='background'>
        <h1 className='heading1'>Caesar Ciphers</h1>
        <ShiftTracker shift={this.state.shift} onChangeShift={this.changeShift} />
        <div className='wrapper'>
          <CodeInput onChangeMessage={this.changeMessage} />
          <Encoded message={this.state.message} shift={this.state.shift} />
        </div>
      </div>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<GameBoard />);
