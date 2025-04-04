import React, { ChangeEvent, Fragment, HTMLInputTypeAttribute, MouseEventHandler, ReactNode, useCallback, useEffect, useReducer, useState } from 'react';
import axios from 'axios';

import './App.css';

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

type StoriesState = {
  data: Story[]
  isLoading: boolean
  isError: boolean
}

type StoriesFetchInitAction = {
  type: 'STORIES_FETCH_INIT'
}

type StoriesFetchSuccessAction = {
  type: 'STORIES_FETCH_SUCCESS'
  payload: Story[]
};

type StoriesFetchFailureAction = {
  type: 'STORIES_FETCH_FAILURE'
};

type StoriesRemoveAction = {
  type: 'REMOVE_STORY'
  payload: Story;
};

type StoriesAction =
  | StoriesFetchInitAction
  | StoriesFetchSuccessAction
  | StoriesFetchFailureAction
  | StoriesRemoveAction

const storiesReducer = (
  state: StoriesState,
  action: StoriesAction
) => {
  switch (action.type) {
    case 'STORIES_FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false
      }
    case 'STORIES_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload
      }
    case 'STORIES_FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true
      }
    case 'REMOVE_STORY':
      return {
        ...state,
        data: state.data.filter(
          (story: Story) => action.payload.objectId !== story.objectId
        )
      }
    default:
      throw new Error();
  }
};

const useStorageState = (key: string, initialState: string) => {
  const [value, setValue] = useState(
    localStorage.getItem(key) || initialState
  );

  useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue] as const;
};

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

const App = () => {
  const [searchTerm, setSearchTerm] = useStorageState(
    'search',
    'React'
  );

  const [url, setUrl] = useState(
    `${API_ENDPOINT}${searchTerm}`
  );

  const [stories, dispatchStories] = useReducer(
    storiesReducer,
    { data: [], isLoading: false, isError: false }
  );

  const handleFetchStories = useCallback(async () => {
    if (!searchTerm) return;

    dispatchStories({ type: 'STORIES_FETCH_INIT' })

    try {
      const result = await axios.get(url)

      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: result.data.hits
      });
    } catch {
      dispatchStories({ type: 'STORIES_FETCH_FAILURE' });
    }
  }, [url]);

  useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);


  const handleRemoveStory = (item: Story) => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item
    });
  }

  const handleSearchInput = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setSearchTerm(event.target.value)
  };

  const handleSearchSubmit = () => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);

    event?.preventDefault();
  }

  return (
    <div className="container">
      <h1 className="headline-primary">Development Journal</h1>

      <SearchForm
      searchTerm={searchTerm}
      onSearchInput={handleSearchInput}
      onSearchSubmit={handleSearchSubmit}
      ></SearchForm>

      {stories.isError && <p>Something went wrong ...</p>}

      {stories.isLoading ? (
        <p>Loading ...</p>
      ) : (
        <List list={stories.data} onRemoveItem={handleRemoveStory} />
      )}
    </div>
  );
}

type searchFormProps = {
  searchTerm: string
  onSearchInput: (event: ChangeEvent<HTMLInputElement>) => void
  onSearchSubmit: () => void
}

const SearchForm = ({
  searchTerm,
  onSearchInput,
  onSearchSubmit,
}: searchFormProps) => (
  <form onSubmit={onSearchSubmit} className="search-form">
  <InputWithLabel
    id="search"
    value={searchTerm}
    isFocused
    onInputChange={onSearchInput}
  >
    <strong>Search:</strong>
  </InputWithLabel>

  <button
    type="submit"
    disabled={!searchTerm}
    className="button button_large"
  >
    Submit
  </button>
  </form>
)

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
    <label htmlFor={id} className="label">
      {children}
    </label>
    &nbsp;
    <input
      id={id}
      type={type}
      value={value}
      autoFocus={isFocused}
      onChange={onInputChange}
      className="input"
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
  <li className="item">
    <span style={{ width: '40%' }}>
      <a href={item.url}>{item.title}</a>
    </span>
    <span style={{ width: '30%' }}>{item.author}</span>
    <span style={{ width: '10%' }}>{item.num_comments}</span>
    <span style={{ width: '10%' }}>{item.points}</span>
    <span style={{ width: '10%' }}>
      <button
        type='button'
        onClick={() => onRemoveItem(item)}
        className="button button_small"  
      >
        Dismiss
      </button>
    </span>
  </li>
);

export default App;
