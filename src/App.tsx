import SelectBar from './SelectBar'
import './App.css';
import { usersArray } from './Util/data';

function App() {
  return (
    <div>
      <section style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <h3 style={{ color: '#F54149' }}>
          ZEPTO
        </h3>
        <SelectBar options={usersArray}/>
      </section>

    </div>
  );
}

export default App;
