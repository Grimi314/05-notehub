import css from "./NoteForm.module.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "../../services/noteService";

interface NoteFormProps {
  onClose: () => void;
}

interface FormValues {
  title: string;
  content: string;
  tag: string;
}

const initialValues: FormValues = {
  title: "",
  content: "",
  tag: "Todo",
};

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  content: Yup.string().required("Content is required"),
  tag: Yup.string().required("Tag is required"),
});

export default function NoteForm({ onClose }: NoteFormProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onClose();
    },
  });

  const handleSubmit = (values: FormValues) => {
    mutation.mutate(values);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form className={css.form}>
        <label>
          Title
          <Field name="title" type="text" />
          <ErrorMessage name="title" component="span" />
        </label>

        <label>
          Content
          <Field name="content" as="textarea" />
          <ErrorMessage name="content" component="span" />
        </label>

        <label>
          Tag
          <Field name="tag" as="select">
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage name="tag" component="span" />
        </label>

        <div className={css.actions}>
          <button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Creating..." : "Create"}
          </button>

          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </Form>
    </Formik>
  );
}
