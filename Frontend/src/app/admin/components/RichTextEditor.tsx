import { useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './RichTextEditor.css';
import { toRichHtml } from '../../../utils/renderHtml';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  error?: string;
}

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    // Quill's align whitelist has no "left": the empty option is left (the default).
    [{ align: [] }],
    ['clean'],
  ],
};

const formats = ['header', 'bold', 'italic', 'underline', 'list', 'bullet', 'align'];

export function RichTextEditor({ value, onChange, placeholder, id, error }: RichTextEditorProps) {
  // Quill's markup for an editor the user cleared (e.g. "<p><br></p>"). We report it as ''
  // so required/fallback checks see an empty field, but keep feeding it back to Quill so
  // the editor isn't reset (and the cursor/pending formatting lost) while the user types.
  const blankMarkup = useRef<string | null>(null);

  const handleChange = (html: string, _delta: unknown, _source: unknown, editor: ReactQuill.UnprivilegedEditor) => {
    if (editor.getText().trim() === '') {
      blankMarkup.current = html;
      onChange('');
    } else {
      blankMarkup.current = null;
      onChange(html);
    }
  };

  const editorValue = value === '' && blankMarkup.current !== null ? blankMarkup.current : toRichHtml(value);

  return (
    <div className="flex flex-col gap-1.5">
      <div className={error ? 'rich-text-editor border-destructive' : 'rich-text-editor'}>
        <ReactQuill
          theme="snow"
          value={editorValue}
          onChange={handleChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          id={id}
        />
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
