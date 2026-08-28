import {Filter, ParamMap} from './filter';

export class PeopleFilter implements Filter {

  searchBase: string = "people/search";

  query: string = "";
  names: string[] = [];
  fandoms: string[] = [];

  copyFrom(input: PeopleFilter) {
    this.query = input.query
    this.names = input.names
    this.fandoms = input.fandoms;
  }

  public paramMap(): ParamMap {
    let params: ParamMap = {
      // Work Info
      "people_search[query]": this.query,
      "people_search[name]": this.names.join(","),
      "people_search[fandom]": this.fandoms.join(","),
      "commit": "Search",
      "page":"1"
    };

    return params;
  }
}
