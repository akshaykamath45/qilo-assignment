import React from "react";
import { Button, Stack } from "@chakra-ui/react";
import { BeatLoader } from "react-spinners";
import { Input } from "@chakra-ui/react";
import "./SearchBar.css";
export const SearchBar = ({
  handleSearch,
  onFetchUserLocation,
  isLoading,
  inputCityName,
  handleInput,
}) => {
  return (
    <div className="search-component">
      <Input
        type="text"
        onChange={handleInput}
        placeholder="Search city"
        value={inputCityName}
        htmlSize={75}
        width="auto"
        variant="outline"
        size="md"
        required
        className="search-input"
      ></Input>
      <Stack direction="row" spacing={4} align="center" className="button">
        <Button onClick={handleSearch} colorScheme="blue">
          Search
        </Button>
        <Button
          onClick={onFetchUserLocation}
          colorScheme="blue"
          isLoading={isLoading}
          spinner={<BeatLoader size={8} color="white" />}
        >
          User Location
        </Button>
      </Stack>
    </div>
  );
};

export default SearchBar;
