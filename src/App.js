function App() {
  async function handleOpenFile() {
    const result = await window.api.openFile();
    console.log(result);
    var audio = new Audio("atom://" + result);
    audio.play();
  }

  return (
    <div className="App">
      <button onClick={handleOpenFile}>Open</button>
    </div>
  );
}

export default App;
