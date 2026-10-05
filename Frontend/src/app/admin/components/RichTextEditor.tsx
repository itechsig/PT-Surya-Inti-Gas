import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './RichTextEditor.css';

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
    [{ align: [false, 'left', 'center', 'right', 'justify'] }],
    ['clean'],
  ],
};

const formats = ['header', 'bold', 'italic', 'underline', 'list', 'bullet', 'align'];

export function RichTextEditor({ value, onChange, placeholder, id, error }: RichTextEditorProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className={error ? 'rich-text-editor border-destructive' : 'rich-text-editor'}>
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
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
