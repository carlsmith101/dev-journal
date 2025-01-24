import { ChangeEvent } from 'react';

type Story = {
  objectId: number
  url: string
  title: string
  author: string
  num_comments: number
  points: number
}

const App = () => {
  const stories = [
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

  return (
    <div>
      <h1>Development Journal</h1>
  
      <Search />
  
      <hr />
  
      <List list={stories} />
    </div>
  );
}

const Search = () => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {

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

type ListProps = {
  list: Story[]
}

const List = (props: ListProps) => (
  <ul>
    {props.list.map((item: any) => (
      <Item key={item.objectId} item={item} />
    ))}
  </ul>
);

type ItemProps = {
  item: Story
}

const Item = (props: ItemProps) => (
  <li>
  <span>
    <a href={props.item.url}>{props.item.title}</a>
  </span>
  <span>{props.item.author}</span>
  <span>{props.item.num_comments}</span>
  <span>{props.item.points}</span>
</li>
)

export default App;
