export const monacoConfig = {
  // HTML Configuration
  html: {
    format: {
      tabSize: 2,
      insertSpaces: true,
      wrapLineLength: 120,
      unformatted: '',
      contentUnformatted: 'pre,code,textarea',
      indentInnerHtml: false,
      preserveNewLines: true,
      maxPreserveNewLines: null,
      indentHandlebars: false,
      endWithNewline: false,
      extraLiners: 'head, body, /html',
      wrapAttributes: 'auto',
    },
    suggest: {
      html5: true,
    },
    validate: true,
    autoClosingTags: true,
  },

  // Editor Configuration
  editor: {
    readOnly: true,
    minimap: { enabled: false },
    fontSize: 14,
    wordWrap: 'on',
    lineNumbers: 'on',
    folding: true,
    lineDecorationsWidth: 0,
    lineNumbersMinChars: 3,
    automaticLayout: true,
    tabSize: 2,
    scrollBeyondLastLine: false,
    formatOnPaste: true,
    formatOnType: true,
    suggestOnTriggerCharacters: true,
    acceptSuggestionOnEnter: 'on',
    quickSuggestions: {
      other: true,
      comments: false,
      strings: false,
    },
    // Enhanced editor settings
    renderWhitespace: 'selection',
    guides: {
      indentation: true,
      bracketPairs: true,
    },
    bracketPairColorization: {
      enabled: true,
    },
    smoothScrolling: true,
    cursorBlinking: 'smooth',
    cursorSmoothCaretAnimation: true,
    mouseWheelZoom: true,
    padding: {
      top: 16,
      bottom: 16,
    },
    fontFamily: 'Menlo, Monaco, "Courier New", monospace',
    fontLigatures: true,
  },

  // Theme Configuration
  themes: {
    light: {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'tag', foreground: '0000ff' },
        { token: 'attribute.name', foreground: 'ff0000' },
        { token: 'attribute.value', foreground: '008000' },
      ],
      colors: {
        'editor.background': '#ffffff',
        'editor.foreground': '#000000',
        'editor.lineHighlightBackground': '#f0f0f0',
        'editorCursor.foreground': '#000000',
        'editor.selectionBackground': '#b3d4fc',
        'editor.inactiveSelectionBackground': '#d4d4d4',
      },
    },
    dark: {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'tag', foreground: '569CD6' },
        { token: 'attribute.name', foreground: '9CDCFE' },
        { token: 'attribute.value', foreground: 'CE9178' },
        { token: 'comment', foreground: '6A9955' },
      ],
      colors: {
        'editor.background': '#1e1e1e',
        'editor.foreground': '#d4d4d4',
        'editor.lineHighlightBackground': '#2d2d2d',
        'editorCursor.foreground': '#ffffff',
        'editor.selectionBackground': '#264f78',
        'editor.inactiveSelectionBackground': '#3a3d41',
      },
    },
  },

  // Tailwind Classes Configuration
  tailwindClasses: [
    // Previous classes remain the same...
    // Adding more commonly used Tailwind classes
    // Flexbox & Grid
    'flex-row', 'flex-col', 'items-center', 'justify-center', 'gap-2', 'gap-4',
    'grid-cols-1', 'grid-cols-2', 'grid-cols-3', 'grid-cols-4',
    // Responsive Design
    'sm:flex', 'md:flex', 'lg:flex', 'xl:flex',
    'sm:grid', 'md:grid', 'lg:grid', 'xl:grid',
    // Positioning
    'relative', 'absolute', 'fixed', 'sticky',
    'top-0', 'right-0', 'bottom-0', 'left-0',
    // Sizing
    'w-full', 'w-auto', 'h-full', 'h-auto',
    'max-w-sm', 'max-w-md', 'max-w-lg', 'max-w-xl',
    // Animation
    'animate-pulse', 'animate-spin', 'animate-ping', 'animate-bounce',
    // Filters
    'blur-sm', 'blur', 'brightness-90', 'contrast-100',
    // Transforms
    'transform', 'translate-x-2', 'translate-y-2', 'rotate-45',
    // States
    'hover:', 'focus:', 'active:', 'disabled:',
    // Dark Mode
    'dark:bg-gray-800', 'dark:text-white',
  ],
};

// Define custom themes
export const defineThemes = (monaco) => {
  monaco.editor.defineTheme('custom-light', monacoConfig.themes.light);
  monaco.editor.defineTheme('custom-dark', monacoConfig.themes.dark);
};
