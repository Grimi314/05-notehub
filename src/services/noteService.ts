import axios from "axios";
import type { Note } from "../types/note";
const myKey = import.meta.env.VITE_NOTEHUB_TOKEN
const BASE_URL = "https://notehub-public.goit.study/api/notes";

    interface FetchNotesProps {
        notes: Note[];
      
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
    return response.data;
}


interface CreateNoteProps {
  title: string ,
  content: string | null ,
  tag: 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping'
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

export async function deleteNote(noteId : string, ) : Promise<Note> {
    const deleteNote = await axios.delete<Note>(`${BASE_URL}/${noteId}`, {
        headers: {
            Authorization: `Bearer ${myKey}`,
            accept: "application/json",
        }
    });
    return deleteNote.data
}