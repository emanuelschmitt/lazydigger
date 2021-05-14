import './App.css';
import {
  MultiDropdownList,
  RangeSlider,
  ReactiveBase,
  ReactiveList,
  SingleDropdownList,
  DynamicRangeSlider,
  SelectedFilters
} from '@appbaseio/reactivesearch';

function App() {
  return (
    <ReactiveBase url="http://localhost:3000" app="lazydigger">
      <SingleDropdownList
        componentId="Genre"
        dataField="genres"
        showCount
        URLParams
        title="Genres"
        react={{
          and: ['Styles', 'Country', 'RatingAverage'],
        }}
      />
      <MultiDropdownList
        componentId="Styles"
        dataField="styles"
        showCount
        URLParams
        title="Styles"
        react={{
          and: ['Genre', 'Country', 'RatingAverage'],
        }}
        showFilter
      />
      <SingleDropdownList
        componentId="Country"
        dataField="country"
        showCount
        URLParams
        title="Country"
        react={{
          and: ['Styles', 'Genre', 'RatingAverage'],
        }}
      />
      <RangeSlider
        componentId="RatingAverage"
        dataField="community.rating.average"
        title="Average Rating"
        range={{
          start: 0,
          end: 5,
        }}
      />
      {/* <DynamicRangeSlider
        componentId="Want"
        dataField="community.want"
        title="Want"
      />
      <DynamicRangeSlider
        componentId="Have"
        dataField="community.have"
        title="Have"
      /> */}
      <DynamicRangeSlider
        componentId="Price"
        dataField="lowest_price"
        title="Price"
      />
      <SelectedFilters />
      <ReactiveList
        componentId="SearchResult"
        dataField="id"
        pagination
        URLParams
        size={20}
        renderItem={(res: any) => (
          <div key={res.id}>
            {res.artists.map((artist: any) => artist.name).join(', ')}
            {' - '}
            {res.title}
          </div>
        )}
        react={{
          and: ['Genre', 'Styles', 'Country', 'RatingAverage', 'Want', 'Have', 'Price'],
        }}
      />
    </ReactiveBase>
  );
}

export default App;
