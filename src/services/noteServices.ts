import axios from "axios";
import type { Note } from "../types/note";
const myKey = import.meta.env.VITE_API_KEY
const BASE_URL = "https://notehub-public.goit.study/api/notes";

    interface FetchNotesProps {
        notes: Note[];
        page: number;
        totalPages: number;
    }

export async function fetchNotes(searchText: string, page: number , perPage: number): Promise<FetchNotesProps>{
    const response = await axios.get<FetchNotesProps>(BASE_URL, {
        params: {
            search: searchText,
            page,
            perPage,
        },
        headers: {
            Authorization: `Bearer ${myKey}`,
             accept: "application/json",
            
        }
    });
    return response.data ?? [];
}


interface CreateNoteProps {
  title: string ,
  content: string ,
  tag: string
}

export async  function createNote(newPost: CreateNoteProps): Promise<Note> {
    const createNewNote = await axios.post<Note> (BASE_URL, newPost,    {
      headers: {
        Authorization: `Bearer ${myKey}`,
        accept: "application/json",
      },
    })
    return createNewNote.data;
}

export async function deleteNote(noteId : number, ) : Promise<number> {
    await axios.delete(`${BASE_URL}/${noteId}`, {
        headers: {
            Authorization: `Bearer ${myKey}`,
            accept: "application/json",
        }
    });
    return noteId
}