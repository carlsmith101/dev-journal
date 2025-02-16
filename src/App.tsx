import React, { ChangeEvent, Fragment, HTMLInputTypeAttribute, MouseEventHandler, ReactNode, useEffect, useState } from 'react';

type Story = {
  objectId: number
  url: string
  title: string
  author: string
  num_comments: number
  points: number
}

const initialStories = [
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

const getAsyncStories = () => new Promise((resolve) => {
  setTimeout(
    () => resolve({ data: { stories: initialStories } }),
    2000
  )
});

const useStorageState = (key: string, initialState: string) => {
  const [value, setValue] = useState(
    localStorage.getItem(key) || initialState
  );

  useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue] as const;
};

const App = () => {
  const [searchTerm, setSearchTerm] = useStorageState(
    'search',
    'React'
  );

  const [stories, setStories] = useState<Story[]>([]);

  useEffect(() => {
    getAsyncStories().then(result => {
      setStories(result.data.stories)
    });
  }, [])

  const handleRemoveStory = (item: Story) => {
    const newStories = stories.filter(
      (story) => item.objectId !== story.objectId
    );

    setStories(newStories);
  }

  const handleSearch = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setSearchTerm(event.target.value)
  };

  const searchedStories = stories.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>Development Journal</h1>

      <InputWithLabel
        id="search"
        value={searchTerm}
        isFocused
        onInputChange={handleSearch}
      >
        Search:
      </InputWithLabel>
      <hr />

      <List list={searchedStories} onRemoveItem={handleRemoveStory} />
    </div>
  );
}

type InputWithLabelProps = {
  id: string
  type?: HTMLInputTypeAttribute
  value: string
  isFocused: boolean
  onInputChange: (event: ChangeEvent<HTMLInputElement>) => void
  children: ReactNode
}

const InputWithLabel = ({
  id,
  type = 'text',
  value,
  isFocused,
  onInputChange,
  children
}: InputWithLabelProps) => (
  <>
    <label htmlFor={id}>{children}</label>
    &nbsp;
    <input
      id={id}
      type={type}
      value={value}
      autoFocus={isFocused}
      onChange={onInputChange}
    />
  </>
);

type ListProps = {
  list: Story[]
  onRemoveItem: (item: Story) => void
};

const List = ({ list, onRemoveItem }: ListProps) => (
  <ul>
    {list.map((item) => (
      <Item
        key={item.objectId}
        item={item}
        onRemoveItem={onRemoveItem}
      />
    ))}
  </ul>
);

type ItemProps = {
  item: Story
  onRemoveItem: (item: Story) => void
};

const Item = ({ item, onRemoveItem }: ItemProps) => (
  <li>
    <span>
      <a href={item.url}>{item.title}</a>
    </span>
    <span>{item.author}</span>
    <span>{item.num_comments}</span>
    <span>{item.points}</span>
    <span>
      <button type='button' onClick={() => onRemoveItem(item)}>
        Dismiss
      </button> 
    </span>
  </li>
);

export default App;
