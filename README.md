# Mermaid Diagram Editor

A modern, interactive editor for creating and exporting [Mermaid](https://mermaid.js.org/) diagrams with live preview.

![Mermaid Diagram Editor Screenshot](https://via.placeholder.com/800x450.png?text=Mermaid+Diagram+Editor)

## Features

- **Live Preview**: See your diagrams render in real-time as you type
- **Multiple Themes**: Choose from default, forest, dark, or neutral themes
- **Export to PNG**: Save your diagrams as PNG images with one click
- **Fullscreen Mode**: Focus on your diagram with distraction-free viewing
- **Error Handling**: Clear error messages when your syntax needs correction
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- **Frontend**: React 19 with TypeScript
- **UI Framework**: Material UI 7
- **Build Tool**: Vite 6
- **Diagram Rendering**: Mermaid.js 11
- **File Export**: File-saver

## Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm 9.0 or higher

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/mermaid-editor.git
   cd mermaid-editor
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

1. **Creating a Diagram**: Type Mermaid syntax in the left editor panel
2. **Changing Themes**: Select a theme from the dropdown above the preview
3. **Exporting**: Click the "Save PNG" button to download your diagram
4. **Fullscreen View**: Click the fullscreen icon to expand the preview

### Example Diagram

```
graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B
```

## Building for Production

To build the application for production:

```bash
npm run build
```

The built files will be in the `dist` directory and can be served by any static file server.

## Mermaid Syntax Resources

- [Flowchart Syntax](https://mermaid.js.org/syntax/flowchart.html)
- [Sequence Diagram Syntax](https://mermaid.js.org/syntax/sequenceDiagram.html)
- [Class Diagram Syntax](https://mermaid.js.org/syntax/classDiagram.html)
- [Entity Relationship Diagram](https://mermaid.js.org/syntax/entityRelationshipDiagram.html)
- [State Diagram Syntax](https://mermaid.js.org/syntax/stateDiagram.html)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Mermaid.js](https://mermaid.js.org/) for the diagram rendering engine
- [Material UI](https://mui.com/) for the UI components
- [Vite](https://vitejs.dev/) for the blazing fast build tool
