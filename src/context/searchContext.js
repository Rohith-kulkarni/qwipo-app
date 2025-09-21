import React from "react";
const SearchContext = React.createContext({
  searchInput: "",
  onSearch: () => {},
  filteredList: [],
});

export default SearchContext;
