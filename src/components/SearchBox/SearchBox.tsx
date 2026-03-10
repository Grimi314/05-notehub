import css from "./SearchBox.module.css";

interface SearchBoxProps {
  searchText: string;
  updateSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchBox({
  searchText,
  updateSearch,
}: SearchBoxProps) {
  return (
    <input
      className={css.input}
      type="text"
      placeholder="Search notes"
      defaultValue={searchText}
      onChange={updateSearch}
    />
  );
}
