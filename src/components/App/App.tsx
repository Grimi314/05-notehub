import css from "./App.module.css";
import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import { fetchNotes } from "../../services/noteServices";
import { deleteNote } from "../../services/noteServices";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import NoteList from "../NoteList/NoteList";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import Loader from "../Loader/Loader";

export default function App() {
  const [query, setQuery] = useState("");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(12);
  const [isClicked, setIsClicked] = useState(false);
  const { data, isError, isLoading } = useQuery({
    queryKey: ["note", query, currentPage],
    queryFn: () => fetchNotes(query, currentPage, perPage),
    placeholderData: keepPreviousData,
  });
  const updateSearch = useDebouncedCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value);
      setSearchText(event.target.value);
    },
    1000,
  );

  const totalPages = data?.totalPages ?? 0;

  function handleChachePage(newPage: number) {
    setCurrentPage(newPage);
  }

  function handelCloseModal() {
    setIsClicked(false);
  }

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["note"],
      }),
  });

  function handleDelete(id: number) {
    mutation.mutate(id);
  }
  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox searchText={searchText} updateSearch={updateSearch} />
        {totalPages > 1 && (
          <Pagination
            pageCount={data?.totalPages ?? 0}
            currentPage={currentPage}
            onPageChange={handleChachePage}
          />
        )}
        <button className={css.button} onClick={() => setIsClicked(true)}>
          Create note +
        </button>
      </header>

      {isLoading && <Loader />}
      {data && !isError && (
        <NoteList notes={data?.notes ?? []} onDelete={handleDelete} />
      )}
      {isClicked && (
        <Modal onClose={handelCloseModal}>
          <NoteForm onClose={handelCloseModal} />
        </Modal>
      )}
    </div>
  );
}
