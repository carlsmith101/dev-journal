import { BaseSyntheticEvent, SyntheticEvent } from "react";

const list = [
  {
    title: 'React',
    url: 'https://reactjs.org/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectId: 0
  },
  {
    title: 'Redux',
    url: 'https://redux.js.org/',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectId: 1
  }
];

const App = () => (
  <div>
    <h1>Development Journal</h1>

    <Search />

    <hr />

    <List />
  </div>
);

const Search = () => {
  const handleChange = (event: BaseSyntheticEvent) => {

    console.log(event);

    console.log(event.target.value);
  }

  return (
    <div>
      <label htmlFor="search">Search: </label>
      <input id="search" type="text" onChange={handleChange}/>
    </div>
  );
}

const List = () => (
  <ul>
    {list.map(item => (
      <li key={item.objectId}>
        <span>
          <a href={item.url}>{item.title}</a>
        </span>
        <span>{item.author}</span>
        <span>{item.num_comments}</span>
        <span>{item.points}</span>
      </li>
    ))}
  </ul>
);

export default App;
