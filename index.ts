import { fromEvent, from } from 'rxjs'; 
import { map, filter, bufferCount, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

const queryInput = document.getElementById('query') as HTMLInputElement;

type SearchResult = any[];

function searchGitHub(query: string) {
  return from(
    fetch(`https://api.github.com/search/repositories?q=${query}`)
    .then(response => response.json()).then(data => data as SearchResult)
  );
}

const source = fromEvent(queryInput, 'input')
.pipe(
  map((event:Event ) => (event.target as HTMLInputElement).value),
  filter(query => query.length > 3),
  debounceTime(1000),
  distinctUntilChanged((a,b) => a == b),
  switchMap(query => searchGitHub(query)),
  //map(data => data.map(({name, stargazers_count, html_url}) => {    return {      name,     stargazers_count,
      //html_url
    //};
    //}))
);

source.subscribe(repos => {
  const resultElements = document.getElementById('results');
resultElements.innerHTML = repos.map(repo => {return `<p>${repo.html_url}</p>`}).join(',');
});