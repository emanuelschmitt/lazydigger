import './App.css';
import {
  MultiDropdownList,
  RangeSlider,
  ReactiveBase,
  ReactiveList,
  SingleDropdownList,
  DynamicRangeSlider,
  SelectedFilters,
} from '@appbaseio/reactivesearch';
import {
  Grid,
  Table,
  TableCell,
  TableRow,
  TableBody,
  TableHead,
  TableContainer,
  TablePagination,
  Paper,
  Link,
} from '@material-ui/core';

function App() {
  return (
    <ReactiveBase url={process.env.REACT_APP_ELASTICSEARCH_URL} app="lazydigger">
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <div
          style={{
            maxWidth: 400,
            padding: '32px',
            borderRight: '1px solid #ddd',
          }}
        >
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
              <RangeSlider
                componentId="RatingAverage"
                dataField="averageRating"
                title="Average Rating"
                URLParams
                range={{
                  start: 0,
                  end: 500,
                }}
                react={{
                  and: ['Genre', 'Styles', 'Country', 'Rareness', 'Price', 'Year'],
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <DynamicRangeSlider
                componentId="Rareness"
                dataField="rareness"
                title="Rareness"
                URLParams
                react={{
                  and: ['Genre', 'Styles', 'Country', 'Price', 'RatingAverage', 'Year'],
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <DynamicRangeSlider
                title="Price"
                componentId="Price"
                dataField="lowest_price"
                URLParams
                react={{
                  and: ['Genre', 'Styles', 'Country', 'Rareness', 'RatingAverage', 'Year'],
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <RangeSlider
                componentId="Year"
                dataField="year"
                title="Year"
                URLParams
                range={{
                  start: 1920,
                  end: new Date().getFullYear(),
                }}
                react={{
                  and: ['Genre', 'Styles', 'Country', 'Rareness', 'Price', 'RatingAverage'],
                }}
              />
            </Grid>
          </Grid>
        </div>
        <div
          style={{
            flexGrow: 1,
            padding: '32px',
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <SelectedFilters />
            </Grid>
            <Grid item xs={12}>
              <Paper>
                <ReactiveList
                  componentId="SearchResult"
                  dataField="id"
                  pagination
                  URLParams
                  showResultStats={false}
                  size={25}
                  render={(data) => {
                    return (
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Artists</TableCell>
                              <TableCell>Title</TableCell>
                              <TableCell>Country</TableCell>
                              <TableCell>Year</TableCell>
                              <TableCell>Genres</TableCell>
                              <TableCell>Rating</TableCell>
                              <TableCell>Rareness</TableCell>
                              <TableCell>Price</TableCell>
                              <TableCell></TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {data.data.map((res: any) => (
                              <TableRow key={res.id}>
                                <TableCell>{res.artists.map((artist: any) => artist.name).join(', ')}</TableCell>
                                <TableCell>{res.title}</TableCell>
                                <TableCell>{res.country}</TableCell>
                                <TableCell>{res.year}</TableCell>
                                <TableCell>{res.genres.join(', ')}</TableCell>
                                <TableCell>
                                  {res.community.rating.average} (#{res.community.rating.count})
                                </TableCell>
                                <TableCell>{(res.rareness / 100).toFixed(2)}</TableCell>
                                <TableCell>{(res.price / 100).toFixed(2)}</TableCell>
                                <TableCell>
                                  <Link href={res.uri} target="_blank">
                                    View
                                  </Link>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    );
                  }}
                  renderNoResults={() => null}
                  renderPagination={({ totalPages, currentPage, setPage }) => (
                    <TablePagination
                      count={totalPages * 10}
                      rowsPerPage={10}
                      page={currentPage}
                      onChangePage={(_, value) => {
                        setPage(value);
                      }}
                      rowsPerPageOptions={[10]}
                      component="div"
                    />
                  )}
                  react={{
                    and: ['Genre', 'Styles', 'Country', 'RatingAverage', 'Rareness', 'Price', 'Year'],
                  }}
                />
              </Paper>
            </Grid>
          </Grid>
        </div>
      </div>
    </ReactiveBase>
  );
}

export default App;
