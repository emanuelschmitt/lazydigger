import { ReactiveBase, ReactiveList, SelectedFilters } from '@appbaseio/reactivesearch';
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
import { NavBar } from './NavBar';
import { FilterMenu } from './FilterMenu';

const PAGE_SIZE = 25;

function App() {
  return (
    <div>
      <NavBar />
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
              padding: '24px',
              borderRight: '1px solid #ddd',
            }}
          >
            <FilterMenu />
          </div>
          <div
            style={{
              flexGrow: 1,
              padding: '24px',
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <SelectedFilters />
              </Grid>
              <Grid item xs={12}>
                <ReactiveList
                  componentId="SearchResult"
                  dataField="id"
                  pagination
                  URLParams
                  showResultStats={false}
                  sortOptions={[
                    { label: 'Relevance', dataField: 'id', sortBy: 'desc' },
                    { label: 'Rareness', dataField: 'rareness', sortBy: 'desc' },
                    { label: 'Price', dataField: 'lowest_price', sortBy: 'desc' },
                    { label: 'Rating', dataField: 'averageRating', sortBy: 'desc' },
                  ]}
                  size={PAGE_SIZE}
                  render={({ data }) => {
                    return (
                      <Paper>
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
                              {data.map((release: any) => (
                                <TableRow key={release.id}>
                                  <TableCell>{release.artists.map((artist: any) => artist.name).join(', ')}</TableCell>
                                  <TableCell>{release.title}</TableCell>
                                  <TableCell>{release.country}</TableCell>
                                  <TableCell>{release.year}</TableCell>
                                  <TableCell>{release.genres.join(', ')}</TableCell>
                                  <TableCell>
                                    {release.community.rating.average} (#{release.community.rating.count})
                                  </TableCell>
                                  <TableCell>{(release.rareness / 100).toFixed(2)}</TableCell>
                                  <TableCell>{(release.price / 100).toFixed(2)}</TableCell>
                                  <TableCell>
                                    <Link href={release.uri} target="_blank">
                                      View
                                    </Link>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Paper>
                    );
                  }}
                  renderNoResults={() => null}
                  renderPagination={({ totalPages, currentPage, setPage }) => (
                    <TablePagination
                      count={totalPages * PAGE_SIZE}
                      rowsPerPage={PAGE_SIZE}
                      page={currentPage}
                      onChangePage={(_, value) => {
                        setPage(value);
                      }}
                      rowsPerPageOptions={[PAGE_SIZE]}
                      component="div"
                    />
                  )}
                  react={{
                    and: ['Genre', 'Styles', 'Country', 'RatingAverage', 'Rareness', 'Price', 'Year'],
                  }}
                />
              </Grid>
            </Grid>
          </div>
        </div>
      </ReactiveBase>
    </div>
  );
}

export default App;
