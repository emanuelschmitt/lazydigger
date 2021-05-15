import './App.css';
import {
  MultiDropdownList,
  RangeSlider,
  ReactiveBase,
  ReactiveList,
  SingleDropdownList,
  DynamicRangeSlider,
  SelectedFilters,
  RangeInput,
} from '@appbaseio/reactivesearch';

function App() {
  return (
    <ReactiveBase url="http://localhost:3000" app="lazydigger">
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <div
          style={{
            minWidth: 400,
            padding: '32px',
          }}
        >
          <SingleDropdownList
            componentId="Genre"
            dataField="genres"
            showCount
            URLParams
            title="Genres"
            react={{
              and: ['Styles', 'Country', 'RatingAverage', 'Rareness', 'Price'],
            }}
          />
          <MultiDropdownList
            componentId="Styles"
            dataField="styles"
            showCount
            URLParams
            title="Styles"
            react={{
              and: ['Genre', 'Country', 'RatingAverage', 'Rareness', 'Price'],
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
              and: ['Genre', 'Styles', 'RatingAverage', 'Rareness', 'Price'],
            }}
          />
          <RangeSlider
            componentId="RatingAverage"
            dataField="averageRating"
            title="Average Rating"
            range={{
              start: 0,
              end: 500,
            }}
            react={{
              and: ['Genre', 'Styles', 'Country', 'Rareness', 'Price'],
            }}
          />
          <DynamicRangeSlider componentId="Rareness" dataField="rareness" title="Rareness" />
          <DynamicRangeSlider title="Price" componentId="Price" dataField="lowest_price" />
          <RangeSlider
            componentId="Year"
            dataField="year"
            title="Year"
            range={{
              start: 1920,
              end: new Date().getFullYear(),
            }}
            react={{
              and: ['Genre', 'Styles', 'Country', 'Rareness', 'Price'],
            }}
          />
        </div>
        <div
          style={{
            flexGrow: 1,
            padding: '32px',
          }}
        >
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
              and: ['Genre', 'Styles', 'Country', 'RatingAverage', 'Rareness', 'Price'],
            }}
          />
        </div>
      </div>
    </ReactiveBase>
  );
}

export default App;
