/**
 *
 * AuthorsAutoComplete
 *
 */
import { RequiredFormLabel } from 'app/components/RequiredFormLabel';
import * as React from 'react';
import { Form } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { AuthorBadge } from '../AuthorBadge';
import { useAddBookAuthorsSlice } from './slice';
import { selectAuthors } from './slice/selectors';
import { Author } from './slice/types';

interface IProps {
  required?;
}

let NEW_AUTHOR_ID = 0;

export const ConnectForm = ({ children }) => {
  const methods = useFormContext();

  return children({ ...methods });
};

export function AuthorsAutoComplete(props: IProps) {
  const dispatch = useDispatch();
  const { actions } = useAddBookAuthorsSlice();

  const authorsList = useSelector(selectAuthors);

  React.useEffect(() => {
    dispatch(actions.requestAuthors());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { fields, append, remove } = useFieldArray({
    name: 'authors',
    control: useFormContext().control,
  });

  // to clear field after author addition
  const ref = React.useRef<any>(null);

  const authorSelected = (list: Author[]) => {
    // this will populate that field array (i.e. 'authors' field)

    // If we have already added the author, exit
    if (
      fields.filter(a => a[Object.keys(a)[1]] === list[0].fullName).length > 0
    ) {
      ref.current.clear();
      return;
    }

    append({
      id: list[0].id,
      fullName: list[0].fullName,
    });
    // clear field once the author is added
    ref.current.clear();
  };

  // method for adding a new author not in the list
  const addNewAuthor = (event: Event) => {
    const key = (event as KeyboardEvent).key;
    const value = (event.target as HTMLInputElement).value;
    if (key === 'Enter') {
      // If we have already added the author, exit
      if (fields.filter(a => a[Object.keys(a)[1]] === value).length > 0) {
        ref.current.clear();
        return;
      }
      NEW_AUTHOR_ID += 1;
      append({
        id: NEW_AUTHOR_ID,
        fullName: value,
      });
      ref.current.clear();
    }
  };

  return (
    <ConnectForm>
      {methods => (
        <Form.Group>
          {props.required ? (
            <RequiredFormLabel htmlFor="author">Author(s)</RequiredFormLabel>
          ) : (
            <Form.Label htmlFor="author">Author(s)</Form.Label>
          )}
          <div className="mb-2">
            {methods.getValues('authors')?.map((author: Author, i) => (
              <AuthorBadge
                key={i}
                name={author.fullName}
                fieldId={i}
                remove={remove}
              />
            ))}
          </div>
          {/* Here I'm allowing RHF to control Typeahead */}
          <Controller
            control={methods.control}
            name="author"
            render={({ field }) => (
              <Typeahead
                {...field}
                ref={ref}
                id="author"
                isInvalid={!!methods.formState.errors.authors}
                labelKey={author => author.fullName}
                options={authorsList}
                onChange={authorSelected} // selected is an array
                onKeyDown={addNewAuthor}
                minLength={2}
              />
            )}
          />
          <Form.Control.Feedback type="invalid">
            {/*for some reason this is not rendering despite being in the DOM*/}
            {methods.formState.errors['authors']?.message}
          </Form.Control.Feedback>
          {/* workaround */}
          <small className="text-danger">
            {methods.formState.errors['authors']?.message}
          </small>
        </Form.Group>
      )}
    </ConnectForm>
  );
}
