import { MultiDropdownList, RangeSlider, SingleRange, SingleDropdownList, RangeInput } from '@appbaseio/reactivesearch';
import { Grid } from '@material-ui/core';

export function FilterMenu() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <SingleDropdownList
          componentId="Genre"
          dataField="genres"
          showCount
          URLParams
          title="Genres"
          react={{
            and: ['Styles', 'Country', 'RatingAverage', 'Rareness', 'Price', 'RatingAverage', 'Year'],
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <MultiDropdownList
          componentId="Styles"
          dataField="styles"
          showCount
          URLParams
          title="Styles"
          react={{
            and: ['Genre', 'Country', 'RatingAverage', 'Rareness', 'Price', 'RatingAverage', 'Year'],
          }}
          showFilter
        />
      </Grid>
      <Grid item xs={12}>
        <SingleDropdownList
          componentId="Country"
          dataField="country"
          showCount
          URLParams
          title="Country"
          react={{
            and: ['Genre', 'Styles', 'RatingAverage', 'Rareness', 'Price', 'RatingAverage', 'Year'],
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <RangeInput
          componentId="Year"
          dataField="year"
          //@ts-ignore
          title="Year"
          URLParams
          range={{
            start: 1920,
            end: new Date().getFullYear(),
          }}
          style={{}}
          stepValue={1}
          //@ts-ignore
          react={{
            and: ['Genre', 'Styles', 'Country', 'Rareness', 'Price', 'RatingAverage'],
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <SingleRange
          componentId="Rareness"
          dataField="rareness"
          title="Rareness"
          showRadio
          data={[
            { start: 0, end: 100, label: 'Common' },
            { start: 100, end: 200, label: 'Uncommon' },
            { start: 200, end: 500, label: 'Rare' },
            { start: 500, end: 100000, label: 'Ultra Rare' },
          ]}
          URLParams
          react={{
            and: ['Genre', 'Styles', 'Country', 'Price', 'RatingAverage', 'Year'],
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <SingleRange
          title="Price"
          componentId="Price"
          dataField="lowest_price"
          showRadio
          URLParams
          data={[
            { start: 0, end: 10, label: '0 - 10 EUR' },
            { start: 10, end: 25, label: '10 - 25 EUR' },
            { start: 25, end: 50, label: '25 - 50 EUR' },
            { start: 50, end: 75, label: '50 - 75 EUR' },
            { start: 75, end: 100, label: '75 - 100 EUR' },
            { start: 100, end: 200, label: '100 - 200 EUR' },
            { start: 200, end: 1000000, label: '> 200 EUR' },
          ]}
          react={{
            and: ['Genre', 'Styles', 'Country', 'Rareness', 'RatingAverage', 'Year'],
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <RangeSlider
          componentId="RatingAverage"
          dataField="averageRating"
          title="Average Rating"
          URLParams
          range={{
            start: 400,
            end: 500,
          }}
          react={{
            and: ['Genre', 'Styles', 'Country', 'Rareness', 'Price', 'Year'],
          }}
        />
      </Grid>
    </Grid>
  );
}
