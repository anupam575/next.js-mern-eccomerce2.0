"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setSearchKeyword,
  clearSearchKeyword,
} from "../../../redux/slices/searchSlice";
import {
  fetchSuggestions,
  clearSuggestions,
} from "../../../redux/slices/suggestionsSlice";
import { useRouter } from "next/navigation";

import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

export default function SearchBar() {
  const [keyword, setKeyword] = useState("");
  const suggestions = useSelector((state) => state?.suggestions?.list) || [];

  const dispatch = useDispatch();
  const router = useRouter();

  // Auto fetch suggestions
  useEffect(() => {
    if (keyword.trim()) {
      const timer = setTimeout(
        () => dispatch(fetchSuggestions(keyword)),
        300
      );
      return () => clearTimeout(timer);
    } else {
      dispatch(clearSuggestions());
    }
  }, [keyword, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = keyword.trim();
    if (!trimmed) return;

    dispatch(setSearchKeyword(trimmed));
    dispatch(clearSuggestions());
    router.push("/product");
  };

  const handleSelectSuggestion = (sugg) => {
    setKeyword(sugg.name);
    dispatch(setSearchKeyword(sugg.name));
    dispatch(clearSuggestions());
    router.push("/product");
  };

  const clearInput = () => {
    setKeyword("");
    dispatch(clearSearchKeyword());
    dispatch(clearSuggestions());
  };

  return (
    <div className="relative w-full max-w-xl">
      {/* SEARCH BAR */}
      <Paper
        component="form"
        onSubmit={handleSubmit}
        className="flex items-center w-full border-2 border-amber-500 overflow-hidden rounded-md shadow-sm"
      >
        <InputBase
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search products..."
          className="flex-1 px-3 py-2 text-sm"
          autoComplete="off"
        />

        {/* Clear Button */}
        {keyword && (
          <IconButton onClick={clearInput} aria-label="clear">
            <CloseIcon className="text-gray-600" />
          </IconButton>
        )}

        {/* Search Button */}
        <IconButton
          type="submit"
          aria-label="search"
          className="!rounded-none bg-amber-400 hover:bg-amber-500 w-14 h-full"
        >
          <SearchIcon className="text-black" />
        </IconButton>
      </Paper>

      {/* SUGGESTIONS DROPDOWN */}
      {suggestions.length > 0 && (
        <ul className="absolute z-50 w-full bg-white shadow-lg rounded-md max-h-64 overflow-y-auto border border-gray-200 mt-1
                       scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent hover:scrollbar-thumb-gray-300">
          {suggestions.map((sugg) => (
            <li
              key={sugg._id}
              onClick={() => handleSelectSuggestion(sugg)}
              className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm"
            >
              {sugg.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
