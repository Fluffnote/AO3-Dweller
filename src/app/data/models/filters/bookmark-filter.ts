import {Filter, ParamMap} from './filter';

export class BookmarkFilter implements Filter {

  searchBase: string = "bookmarks/search";

  query: string = "";

  copyFrom(input: BookmarkFilter) {
    this.query = input.query
  }

  public paramMap(): ParamMap {
    let params: ParamMap = {
      "people_search[query]": this.query,
      "commit": "Search",
      "page":"1"
    };

    return params;
  }
}
