import { createDataResource } from './data/resource';

const DATA_URL = '/owid-co2-data.json';
const resource = createDataResource(DATA_URL);

function App() {
  const data = resource.read();
  console.log(data);

  return <h1>Hello World!</h1>;
}

export default App;
