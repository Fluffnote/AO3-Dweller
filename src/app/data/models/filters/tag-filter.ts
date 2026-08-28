import {Filter, ParamMap} from './filter';

export class TagFilter implements Filter {

  searchBase: string = "tags/search";

  query: string = "";

  copyFrom(input: TagFilter) {
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
